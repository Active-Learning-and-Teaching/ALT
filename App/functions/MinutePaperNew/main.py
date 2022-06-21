import json
import os
import time
from datetime import datetime

import firebase_admin
import numpy as np
import pandas as pd
from firebase_admin import db
from flask import Flask, jsonify
from scipy.spatial.distance import euclidean
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from flask import request

app = Flask(__name__)

# http://localhost:8080//minutePaperSummarizer?passCode=kywqztbp&startTime=27/01/2022%2014:36:56&endTime=27/01/2022%2014:39:56
DATABASE_URL = "https://testfortls.firebaseio.com/"


def fetch_mp_responses(passCode, start_time, end_time):
    try:
        cred_obj = firebase_admin.credentials.Certificate("cred.json")
        default_app = firebase_admin.initialize_app(
            cred_obj, {"databaseURL": DATABASE_URL}
        )
    except ValueError:
        pass

    ref = db.reference("/InternalDb/FeedbackResponse/")

    understood_list = []
    doubt_list = []

    start_time = datetime.strptime(start_time, "%d/%m/%Y %H:%M:%S")
    end_time = datetime.strptime(end_time, "%d/%m/%Y %H:%M:%S")

    feedback_responses = ref.order_by_child("passCode").equal_to(passCode).get()
    for response in feedback_responses.values():
        if response != "":
            timestamp = datetime.strptime(response["timestamp"], "%d/%m/%Y %H:%M:%S")
            if (
                response["passCode"] == passCode
                and timestamp >= start_time
                and timestamp <= end_time
            ):
                for value in response["responses"][0]:
                    understood_list.append(value)
                for value in response["responses"][1]:
                    doubt_list.append(value)

    return understood_list, doubt_list


def perform_clustering(corpus, num_clusters=5):

    corpus = np.array(corpus)

    embedder = SentenceTransformer("distilbert-base-nli-stsb-mean-tokens")
    corpus_embeddings = embedder.encode(corpus)

    # Define kmeans model
    clustering_model = KMeans(n_clusters=num_clusters)

    # Fit the embedding with kmeans clustering.
    clustering_model.fit(corpus_embeddings)

    # Get the cluster id assigned to each news headline.
    cluster_assignment = clustering_model.labels_

    clustered_sentences = [[] for i in range(num_clusters)]
    for sentence_id, cluster_id in enumerate(cluster_assignment):
        clustered_sentences[cluster_id].append(corpus[sentence_id])

    # Getting the sentence closest to Centroid

    kmeans = clustering_model

    # Loop over all clusters and find index of closest point to the cluster center and append to closest_pt_idx list.
    closest_pt_idx = []
    for iclust in range(kmeans.n_clusters):
        # get all points assigned to each cluster:
        cluster_pts = corpus[kmeans.labels_ == iclust]
        # get all indices of points assigned to this cluster:
        cluster_pts_indices = np.where(kmeans.labels_ == iclust)[0]

        cluster_cen = kmeans.cluster_centers_[iclust]
        min_idx = np.argmin(
            [
                euclidean(corpus_embeddings[idx], cluster_cen)
                for idx in cluster_pts_indices
            ]
        )

        closest_pt_idx.append(cluster_pts_indices[min_idx])

    total_responses = len(corpus)

    results = []

    for i, cluster in enumerate(clustered_sentences):
        print("Cluster ", i)
        print(cluster)
        print(f"Cluster Summary {i+1}: {corpus[closest_pt_idx[i]]}")
        cluster_summary = corpus[closest_pt_idx[i]]
        result = [cluster_summary, len(cluster) / total_responses, cluster]
        results.append(result)
    
    results.sort(key=lambda x : x[1])
    return results


def save_summary(summary, passCode, total_count):
    summary_dict = {}
    for i in range(len(summary)):
        summary_dict[str(i)] = {}
        for j in range(len(summary[i])):
            summary_dict[str(i)][str(j)] = str(summary[i][j])

    ref = db.reference("/InternalDb/Feedback/")

    summary_dict = json.dumps(summary_dict)

    feedbacks = ref.order_by_child("passCode").equal_to(passCode).get()
    for key, value in feedbacks.items():
        if value["passCode"] == passCode:
            ref.child(key).update({"summary": summary_dict})
            ref.child(key).update(
                {
                    "response_count": {
                        0: total_count[0],
                        1: total_count[1],
                    }
                }
            )

    return summary_dict


@app.route("/minutePaperSummarizer", methods=["GET"])
def minutePaperSummarizer():
    if request.method == "GET":
        starting_time = time.time()
        if request.args and "passCode" in request.args:
            passCode = request.args.get("passCode")
            start_time = request.args.get("startTime")
            end_time = request.args.get("endTime")
        else:
            return ({"message": "Malformed request"},)

        print(passCode, start_time, end_time)

        understood_list, doubt_list = fetch_mp_responses(passCode, start_time, end_time)

        def check_na(string):
            if string.lower().strip() == "na" or len(string) < 3:
                return False
            else:
                return True

        understood_list = list(filter(check_na, understood_list))  # remove NA responses
        doubt_list = list(filter(check_na, doubt_list))  # remove NA responses

        summary = [perform_clustering(understood_list), perform_clustering(doubt_list)]

        summary_dict = save_summary(
            summary, passCode, (len(understood_list), len(doubt_list))
        )

        print("--- %s seconds ---" % (time.time() - starting_time))

        return jsonify({"message": "Success", "summary": summary_dict})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

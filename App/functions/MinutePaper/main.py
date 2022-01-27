import os
from flask import Flask, request
import firebase_admin
from firebase_admin import db
import spacy
import pytextrank
from datetime import datetime
import time

app = Flask(__name__)

# http://localhost:8080//minutePaperSummarizer?passCode=kywqztbp&startTime=27/01/2022%2014:36:56&endTime=27/01/2022%2014:39:56
DATABASE_URL = "https://testfortls.firebaseio.com/"


def fetch_mp_responses(passCode, start_time, end_time):
    try:
        cred_obj = firebase_admin.credentials.Certificate('cred.json')
        default_app = firebase_admin.initialize_app(
            cred_obj, {'databaseURL': DATABASE_URL})
    except ValueError:
        pass

    ref = db.reference("/InternalDb/FeedbackResponse/")

    understood_list = []
    doubt_list = []

    start_time = datetime.strptime(start_time, "%d/%m/%Y %H:%M:%S")
    end_time = datetime.strptime(end_time, "%d/%m/%Y %H:%M:%S")

    feedback_responses = ref.order_by_child(
        'passCode').equal_to(passCode).get()
    for response in feedback_responses.values():
        if (response != ""):
            timestamp = datetime.strptime(
                response['timestamp'], "%d/%m/%Y %H:%M:%S")
            if (response["passCode"] == passCode and timestamp >= start_time and timestamp <= end_time):
                for value in response['responses'][0]:
                    understood_list.append(value)
                for value in response['responses'][1]:
                    doubt_list.append(value)

    return understood_list, doubt_list


def summarize_responses(understood_list, doubt_list):

    understood_text = ". ".join(understood_list)
    doubt_text = ". ".join(doubt_list)
    # load a spaCy model, depending on language, scale, etc.
    nlp = spacy.load("en_core_web_sm")

    # add PyTextRank to the spaCy pipeline
    # tr = pytextrank.TextRank()
    # nlp.add_pipe(tr.PipelineComponent, name='textrank', last=True)
    nlp.add_pipe("textrank")
    understood_doc = nlp(understood_text)
    doubt_doc = nlp(doubt_text)

    understood_out = []
    doubt_out = []
    summary = []

    for sent in understood_doc._.textrank.summary(limit_phrases=15, limit_sentences=3):
        understood_out.append(sent)

    for sent in doubt_doc._.textrank.summary(limit_phrases=15, limit_sentences=3):
        doubt_out.append(sent)

    summary.append(understood_out)
    summary.append(doubt_out)

    print(summary)
    return summary


def save_summary(summary, passCode):
    summary_dict = {}
    for i in range(len(summary)):
        summary_dict[str(i)] = {}
        for j in range(len(summary[i])):
            summary_dict[str(i)][str(j)] = str(summary[i][j])

    ref = db.reference("/InternalDb/Feedback/")

    feedbacks = ref.order_by_child("passCode").equal_to(passCode).get()
    for key, value in feedbacks.items():
        if(value["passCode"] == passCode):
            ref.child(key).update({"summary": summary_dict})

    return summary_dict


@app.route("/minutePaperSummarizer", methods=["GET"])
def minutePaperSummarizer():
    if (request.method == "GET"):
        starting_time = time.time()
        if request.args and 'passCode' in request.args:
            passCode = request.args.get('passCode')
            start_time = request.args.get('startTime')
            end_time = request.args.get('endTime')
        else:
            return {"message": 'Malformed request'},

        print(passCode, start_time, end_time)

        understood_list, doubt_list = fetch_mp_responses(
            passCode, start_time, end_time)

        summary = summarize_responses(understood_list, doubt_list)

        summary_dict = save_summary(summary, passCode)

        print("--- %s seconds ---" % (time.time() - starting_time))

        return {"message": 'Success', "summary": summary_dict}


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

import os
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
import spacy
import pytextrank
from datetime import datetime
import time
import logging

app = Flask(_name_)


try:
   
    nlp = spacy.load("en_core_web_md")
    nlp.add_pipe("textrank")
    app.logger.info("Loaded spaCy model with TextRank pipeline")
except Exception as e:
    app.logger.error(f"Failed to initialize spaCy: {e}")
    raise

DATABASE_URL = "https://testfortls.firebaseio.com/"
FIREBASE_CRED = 'cred.json'


try:
    cred = credentials.Certificate(FIREBASE_CRED)
    firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
except Exception as e:
    app.logger.error(f"Firebase initialization failed: {e}")
    raise

def preprocess_responses(responses):
    processed = []
    for resp in responses:
        resp = resp.strip()
        if not resp:
            continue
        if resp[-1] not in {'.', '!', '?'}:
            resp += '.'
        processed.append(resp)
    return ' '.join(processed)

def fetch_mp_responses(passCode, start_time, end_time):
    try:
        ref = db.reference("/InternalDb/FeedbackResponse/")
        start_time = datetime.strptime(start_time, "%d/%m/%Y %H:%M:%S")
        end_time = datetime.strptime(end_time, "%d/%m/%Y %H:%M:%S")

        understood, doubts = [], []
        
        responses = ref.order_by_child('passCode').equal_to(passCode).get()
        for key, val in responses.items():
            if val.get("passCode") != passCode:
                continue
            
            ts = datetime.strptime(val['timestamp'], "%d/%m/%Y %H:%M:%S")
            if start_time <= ts <= end_time:
                understood.extend(val['responses'][0])
                doubts.extend(val['responses'][1])

        return understood, doubts
    
    except Exception as e:
        app.logger.error(f"Error fetching responses: {e}")
        return [], []

def summarize_text(text, phrase_limit=20, sentence_limit=3):
    if not text.strip():
        return []
    
    try:
        doc = nlp(text)
        return [sent.text for sent in doc._.textrank.summary(
            limit_phrases=phrase_limit,
            limit_sentences=sentence_limit
        )]
    except Exception as e:
        app.logger.error(f"Summarization error: {e}")
        return []

def summarize_responses(understood_list, doubt_list):
    understood_text = preprocess_responses(understood_list)
    doubt_text = preprocess_responses(doubt_list)

    return [
        summarize_text(understood_text, phrase_limit=20),
        summarize_text(doubt_text, phrase_limit=20)
    ]

def save_summary(summary, passCode):
    try:
        ref = db.reference("/InternalDb/Feedback/")
        feedbacks = ref.order_by_child("passCode").equal_to(passCode).get()
        
        for key in feedbacks.keys():
            ref.child(key).update({
                "summary": {
                    "understood": summary[0],
                    "doubts": summary[1]
                }
            })
            return True
    except Exception as e:
        app.logger.error(f"Error saving summary: {e}")
        return False

@app.route("/minutePaperSummarizer", methods=["GET"])
def minutePaperSummarizer():
    start_time = time.time()
    args = request.args
    
    if not all(k in args for k in ('passCode', 'startTime', 'endTime')):
        return jsonify({"error": "Missing required parameters"}), 400
    
    passCode = args['passCode']
    start = args['startTime']
    end = args['endTime']

    try:
        understood, doubts = fetch_mp_responses(passCode, start, end)
        summary = summarize_responses(understood, doubts)
        if save_summary(summary, passCode):
            return jsonify({
                "summary": {
                    "understood": summary[0],
                    "doubts": summary[1]
                },
                "processing_time": f"{time.time() - start_time:.2f}s"
            })
        return jsonify({"error": "Failed to save summary"}), 500

    except Exception as e:
        app.logger.error(f"Endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

if _name_ == "_main_":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
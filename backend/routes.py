from flask import Flask,request,jsonify
from flask_cors import CORS
import re
import string
import os
import joblib

app=Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "df_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and vectorizer loaded successfully with joblib.")
except Exception as e:
    print(f"\n ERROR LOADING MODELS: {e}\n")
    model, vectorizer = None, None


def wordopt(text):
  text=text.lower()
  text=re.sub(r'\[.*?\]','',text)
  text=re.sub(r"\\W"," ",text)
  text=re.sub(r'https?://\S+|www\.\S+','',text)
  text=re.sub(r'<.*?>+','',text)
  text=re.sub(r'[%s]'%re.escape(string.punctuation),'',text)
  text=re.sub(r'\n','',text)
  text=re.sub(r'\w*\d\w','',text)
  return text

@app.route("/predict",methods=['POST'])
def predict():
  data = request.get_json(silent=True)
    
  if not data or 'text' not in data:
    return jsonify({
      'error': 'Invalid request payload. Expected JSON with key "text".'
    }), 400

  raw_text = data['text']

  final_data=wordopt(raw_text)
  vectorized_data=vectorizer.transform([final_data])

  prediction=model.predict(vectorized_data)[0]
  probability=model.predict_proba(vectorized_data)[0]

  confidence_score = round(float(probability[prediction]) * 100, 1) # e.g., 85.0
  label_str = "REAL" if prediction == 1 else "FAKE"

  return jsonify({
     'label':label_str,
     'confidence':confidence_score,
     'summary': f'The model classified this article as {label_str} with {confidence_score}% confidence.'
  }),200
  


if __name__=="__main__":
    app.run(debug=True,port=5000)
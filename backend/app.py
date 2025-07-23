# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permette al frontend di fare richieste

@app.route("/")
def home():
    return jsonify({"message": "Benvenuto nel backend di AroundCities!"})

if __name__ == "__main__":
    app.run(debug=True, port=5025)

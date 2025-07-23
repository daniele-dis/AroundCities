# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)  # permette al frontend di fare richieste

@app.route("/")
def home():
    return jsonify({"message": "Benvenuto nel backend di AroundCities!"})

if __name__ == "__main__":
    app.run(debug=True, port=5025)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    # Qui puoi mettere la tua logica di controllo utente, DB ecc.
    if email == "test@example.com" and password == "1234":
        return {"user": {"email": email, "name": "Test User"}}
    return {"error": "Credenziali non valide"}, 401

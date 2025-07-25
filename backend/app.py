from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configura il database SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aroundcities.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelli
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120), nullable=False)

class CityVisit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city_name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route("/")
def home():
    return jsonify({"message": "Benvenuto nel backend di AroundCities!"})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email, password=password).first()
    if user:
        return {"user": {"email": user.email, "name": user.name}}
    return {"error": "Credenziali non valide"}, 401

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Crea le tabelle se non esistono
    app.run(debug=True, port=5025)
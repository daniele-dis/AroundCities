from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
CORS(app)

# Configura il database SQLite per crearlo nella cartella backend
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + app.root_path + '/aroundcities.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelli del database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

class CityVisit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city_name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    hotels_data = db.Column(db.Text, default="[]")
    food_data = db.Column(db.Text, default="[]")
    monuments_data = db.Column(db.Text, default="[]")

    user = db.relationship('User', backref='city_visits', lazy=True)

    def __repr__(self):
        return f'<CityVisit {self.city_name} by User {self.user_id}>'

@app.route("/")
def home():
    """Endpoint di benvenuto."""
    return jsonify({"message": "Benvenuto nel backend di AroundCities!"})

@app.route("/register", methods=["POST"])
def register():
    """Endpoint per la registrazione di un nuovo utente."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"error": "Dati mancanti per la registrazione"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Un utente con questa email esiste già"}), 409

    new_user = User(email=email, password=password, name=name)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Utente registrato con successo", "user": {"id": new_user.id, "email": new_user.email, "name": new_user.name}}), 201

@app.route("/login", methods=["POST"])
def login():
    """Endpoint per il login dell'utente."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        return jsonify({"user": {"id": user.id, "email": user.email, "name": user.name}}), 200
    return jsonify({"error": "Credenziali non valide"}), 401

@app.route("/city_data/<int:user_id>/<string:city_name>", methods=["GET"])
def get_city_data(user_id, city_name):
    """
    Endpoint per recuperare i dati di una città per un utente specifico.
    Restituisce liste vuote se nessun dato è stato trovato.
    """
    city_visit = CityVisit.query.filter_by(user_id=user_id, city_name=city_name).first()
    if city_visit:
        return jsonify({
            "hotels": json.loads(city_visit.hotels_data),
            "food": json.loads(city_visit.food_data),
            "monuments": json.loads(city_visit.monuments_data)
        }), 200
    return jsonify({
        "hotels": [],
        "food": [],
        "monuments": []
    }), 200

@app.route("/city_data/<int:user_id>/<string:city_name>", methods=["POST"])
def save_city_data(user_id, city_name):
    """
    Endpoint per salvare o aggiornare i dati di una città per un utente specifico.
    """
    data = request.get_json()
    hotels = json.dumps(data.get("hotels", []))
    food = json.dumps(data.get("food", []))
    monuments = json.dumps(data.get("monuments", []))

    city_visit = CityVisit.query.filter_by(user_id=user_id, city_name=city_name).first()

    try:
        if city_visit:
            city_visit.hotels_data = hotels
            city_visit.food_data = food
            city_visit.monuments_data = monuments
        else:
            new_city_visit = CityVisit(
                user_id=user_id,
                city_name=city_name,
                hotels_data=hotels,
                food_data=food,
                monuments_data=monuments
            )
            db.session.add(new_city_visit)
        
        db.session.commit()
        return jsonify({"message": "Dati della città salvati con successo"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Errore durante il salvataggio dei dati: {e}")
        return jsonify({"error": f"Errore del server: {e}"}), 500

@app.route("/user_cities/<int:user_id>", methods=["GET"])
def get_user_cities(user_id):
    """
    Endpoint per recuperare la lista di tutte le città visitate da un utente.
    """
    city_visits = CityVisit.query.filter_by(user_id=user_id).all()
    visited_cities = [visit.city_name for visit in city_visits]
    return jsonify({"visited_cities": visited_cities}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5025)
// src/components/CityDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/CityDetailPage.css"; 
import MapImage from '../img/map.jpg'; 

export default function CityDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cityData = location.state?.cityData;

  // Recupera l'ID utente dal localStorage
  const loggedInUserId = localStorage.getItem('userId');

  const [hotels, setHotels] = useState([]);
  const [food, setFood] = useState([]);
  const [monuments, setMonuments] = useState([]);

  const [newHotel, setNewHotel] = useState("");
  const [newFood, setNewFood] = useState("");
  const [newMonument, setNewMonument] = useState("");

  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5025"; 

  // Reindirizza l'utente se non è loggato
  useEffect(() => {
    if (!loggedInUserId) {
      navigate('/login');
    }
  }, [loggedInUserId, navigate]);

  // Carica i dati dal backend all'avvio del componente
  useEffect(() => {
    const fetchCityData = async () => {
      if (!cityData || !loggedInUserId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/city_data/${loggedInUserId}/${cityData.name}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHotels(data.hotels || []);
        setFood(data.food || []);
        setMonuments(data.monuments || []);
      } catch (error) {
        console.error("Errore durante il recupero dei dati della città:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, [cityData, loggedInUserId]);

  if (!cityData) {
    return (
      <div className="city-detail-container">
        <p>Errore: dati della città mancanti. Torna alla pagina precedente e riprova.</p>
        <button onClick={() => navigate(-1)}>← Torna indietro</button>
      </div>
    );
  }

  // Gestisci il salvataggio di un singolo dato nel backend
  const handleSaveItem = async (type) => {
    const today = new Date().toLocaleDateString('it-IT');
    let newName = "";

    if (type === 'hotels' && newHotel) {
      newName = newHotel;
      setNewHotel("");
    } else if (type === 'food' && newFood) {
      newName = newFood;
      setNewFood("");
    } else if (type === 'monuments' && newMonument) {
      newName = newMonument;
      setNewMonument("");
    } else {
      console.warn(`Nessun nuovo elemento da salvare per la categoria: ${type}`);
      return;
    }

    const newItem = { id: Date.now(), name: newName, date: today };

    let updatedHotels = [...hotels];
    let updatedFood = [...food];
    let updatedMonuments = [...monuments];

    if (type === 'hotels') {
      updatedHotels.push(newItem);
      setHotels(updatedHotels);
    } else if (type === 'food') {
      updatedFood.push(newItem);
      setFood(updatedFood);
    } else if (type === 'monuments') {
      updatedMonuments.push(newItem);
      setMonuments(updatedMonuments);
    }

    const updatedDataToSave = {
      hotels: updatedHotels,
      food: updatedFood,
      monuments: updatedMonuments,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/city_data/${loggedInUserId}/${cityData.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDataToSave)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Dati per ${cityData.name} (${type}) salvati sul server!`);
    } catch (error) {
      console.error(`Errore nel salvataggio dei dati per ${type}:`, error);
    }
  };

  const handleDeleteItem = async (type, id) => {
    let updatedArray;
    let currentData = { hotels, food, monuments };
    let setFunction;

    if (type === 'hotels') {
      updatedArray = hotels.filter(item => item.id !== id);
      currentData.hotels = updatedArray;
      setFunction = setHotels;
    } else if (type === 'food') {
      updatedArray = food.filter(item => item.id !== id);
      currentData.food = updatedArray;
      setFunction = setFood;
    } else if (type === 'monuments') {
      updatedArray = monuments.filter(item => item.id !== id);
      currentData.monuments = updatedArray;
      setFunction = setMonuments;
    }
    
    if (setFunction) {
      setFunction(updatedArray);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/city_data/${loggedInUserId}/${cityData.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Elemento eliminato dal server!'); 
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'elemento:", error);
    }
  };

  if (loading) {
    return (
      <div className="city-detail-container">
        <p>Caricamento dati della città...</p>
      </div>
    );
  }

  return (
    <div className="city-detail-container">
      <img src={MapImage} alt="Map Background" className="map-background" />
      
      <header className="city-detail-header">
        <button onClick={() => navigate(-1)} className="back-button-detail">← Torna alla lista</button>
        <h1 className="city-title-detail">{cityData.name}</h1>
        <p className="city-region">{cityData.region}</p>
      </header>

      <main className="city-sections">
        {/* CARD Hotel & B&B */}
        <div className="city-card-combined">
          <h2>🏨 Hotel & B&B</h2>
          <div className="places-display-section">
            <ul className="places-list">
              {hotels.map((item) => (
                <li key={item.id}>
                  <div>{item.name} <br/> <span className="item-date">Aggiunto il: {item.date}</span></div>
                  <button onClick={() => handleDeleteItem('hotels', item.id)} className="delete-button">X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="input-form-section">
            <label htmlFor="hotels-input">Nome Hotel/B&B:</label>
            <input
              id="hotels-input"
              type="text"
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              placeholder="Inserisci un hotel..."
            />
            <button onClick={() => handleSaveItem('hotels')} className="save-item-button">Salva Hotel</button>
          </div>
        </div>

        {/* CARD Food & Restaurant */}
        <div className="city-card-combined">
          <h2>🍽️ Food & Restaurant</h2>
          <div className="places-display-section">
            <ul className="places-list">
              {food.map((item) => (
                <li key={item.id}>
                  <div>{item.name} <br/> <span className="item-date">Aggiunto il: {item.date}</span></div>
                  <button onClick={() => handleDeleteItem('food', item.id)} className="delete-button">X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="input-form-section">
            <label htmlFor="food-input">Nome Ristorante/Street Food:</label>
            <input
              id="food-input"
              type="text"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              placeholder="Inserisci un ristorante..."
            />
            <button onClick={() => handleSaveItem('food')} className="save-item-button">Salva Ristorante</button>
          </div>
        </div>

        {/* CARD Monumenti */}
        <div className="city-card-combined">
          <h2>🏛️ Monumenti</h2>
          <div className="places-display-section">
            <ul className="places-list">
              {monuments.map((item) => (
                <li key={item.id}>
                  <div>{item.name} <br/> <span className="item-date">Aggiunto il: {item.date}</span></div>
                  <button onClick={() => handleDeleteItem('monuments', item.id)} className="delete-button">X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="input-form-section">
            <label htmlFor="monuments-input">Nome Monumento:</label>
            <input
              id="monuments-input"
              type="text"
              value={newMonument}
              onChange={(e) => setNewMonument(e.target.value)}
              placeholder="Inserisci un monumento..."
            />
            <button onClick={() => handleSaveItem('monuments')} className="save-item-button">Salva Monumento</button>
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/CityDetailPage.css";

export default function CityDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cityData = location.state?.cityData;

  const [hotels, setHotels] = useState("");
  const [food, setFood] = useState("");
  const [monuments, setMonuments] = useState("");
  const [dataSaved, setDataSaved] = useState(false);

  // Carica i dati salvati all'avvio del componente
  useEffect(() => {
    if (cityData) {
      const savedData = JSON.parse(localStorage.getItem(cityData.name)) || {};
      if (savedData.hotels) {
        setHotels(savedData.hotels);
        setFood(savedData.food);
        setMonuments(savedData.monuments);
        setDataSaved(true);
      }
    }
  }, [cityData]);

  if (!cityData) {
    return (
      <div className="city-detail-container">
        <p>Errore: dati della città mancanti. Torna alla pagina precedente e riprova.</p>
        <button onClick={() => navigate(-1)}>← Torna indietro</button>
      </div>
    );
  }

  const handleSaveData = () => {
    const newData = { hotels, food, monuments };
    localStorage.setItem(cityData.name, JSON.stringify(newData));
    setDataSaved(true);
    alert(`Dati per ${cityData.name} salvati!`);
  };

  const handleAddToProfile = () => {
    // Aggiorna l'elenco delle città nel profilo
    const visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];
    if (!visitedCities.includes(cityData.name)) {
      localStorage.setItem("visitedCities", JSON.stringify([...visitedCities, cityData.name]));
    }
    alert(`${cityData.name} è stata aggiunta al tuo profilo!`);
  };

  return (
    <div className="city-detail-container">
    <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
      
      <header className="city-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">← Torna alla lista</button>
        <h1 className="city-title">
          {cityData.name}
          <button
            onClick={handleAddToProfile}
            className="add-city-button"
            aria-label="Aggiungi città al profilo"
          >
            +
          </button>
        </h1>
        <p className="city-region">{cityData.region}</p>
      </header>

      <main className="city-sections">
        {dataSaved ? (
          // Visualizzazione dei dati salvati
          <>
            <div className="city-card-detail">
              <h2>🏨 Hotel & B&B</h2>
              <p>{hotels}</p>
            </div>
            <div className="city-card-detail">
              <h2>🍽️ Food & Restaurant</h2>
              <p>{food}</p>
            </div>
            <div className="city-card-detail">
              <h2>🏛️ Monumenti</h2>
              <p>{monuments}</p>
            </div>
            <button onClick={() => setDataSaved(false)} className="edit-button">Modifica Dati</button>
          </>
        ) : (
          // Interfaccia per inserire i dati
          <div className="input-container">
            <h3>Aggiungi i tuoi consigli per {cityData.name}</h3>
            <label htmlFor="hotels-input">🏨 Hotel & B&B:</label>
            <textarea
              id="hotels-input"
              value={hotels}
              onChange={(e) => setHotels(e.target.value)}
              placeholder="Inserisci una lista di hotel..."
            />
            <label htmlFor="food-input">🍽️ Food & Restaurant:</label>
            <textarea
              id="food-input"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="Inserisci i migliori ristoranti..."
            />
            <label htmlFor="monuments-input">🏛️ Monumenti:</label>
            <textarea
              id="monuments-input"
              value={monuments}
              onChange={(e) => setMonuments(e.target.value)}
              placeholder="Inserisci i monumenti da non perdere..."
            />
            <button onClick={handleSaveData} className="save-button">Salva Dati</button>
          </div>
        )}
      </main>
    </div>
  );
}
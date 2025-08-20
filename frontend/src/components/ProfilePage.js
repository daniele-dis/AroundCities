import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../css/ProfilePage.css";

export default function ProfilePage() {
  const [visitedCities, setVisitedCities] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 
  const userId = localStorage.getItem('userId'); // Usa l'ID utente dal localStorage per la sicurezza
  const [loggedInUser, setLoggedInUser] = useState('');
  const API_BASE_URL = "http://localhost:5025"; 

  // Utilizziamo location.key come dipendenza per forzare il ricaricamento
useEffect(() => {
    if (!userId) {
        navigate('/login');
        return; 
    }
    const user = localStorage.getItem('loggedInUser');
    if (user) {
        setLoggedInUser(user);
    }
    
    const fetchUserCities = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user_cities/${userId}`);
            const data = await response.json();
            setVisitedCities(data.visited_cities);
        } catch (error) {
            console.error("Errore nel recupero delle città dell'utente:", error);
        }
    };
    fetchUserCities();
}, [userId, location.key, navigate]);

  // FUNZIONE DI NAVIGAZIONE CORRETTA
  const handleCityClick = (cityName) => {
    navigate(`/city/${encodeURIComponent(cityName)}`, {
      state: {
        cityData: { name: cityName },
      },
    });
  };

  const handleRemoveCity = async (cityToRemove) => {
    const isConfirmed = window.confirm(
      `Sei sicuro di voler rimuovere tutti i dati per ${cityToRemove}?`
    );
    
    if (!isConfirmed) {
      return;
    }

    const updatedCities = visitedCities.filter(city => city !== cityToRemove);
    setVisitedCities(updatedCities);

    try {
      await fetch(`${API_BASE_URL}/city_data/${userId}/${cityToRemove}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotels: [], food: [], monuments: [] })
      });
      console.log(`Dati per ${cityToRemove} eliminati dal database.`);
    } catch (error) {
      console.error("Errore durante la rimozione della città:", error);
    }
  };

  return (
    <div className="profile-container">
      <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
      <button onClick={() => navigate(-1)} className="back-button-profile">
        ← Torna alla Mappa
      </button>
      <header className="profile-header">

        <div class ="div-username">
        <h1>{loggedInUser?.endsWith('a') ? 'a' : ''} {loggedInUser},
        Città Visitate: <span className="city-count">{visitedCities.length}</span></h1>
        </div>

        
      </header>
      <main className="profile-main">
        <p className="city-subtitle">Clicca Sulle Città Per Vedere Cosa Hai Già Visitato e Modificarlo Se Vuoi.</p>
        {visitedCities.length > 0 ? (
          <ul className="city-list">
            {visitedCities.map((city, index) => (
              <li key={index}>
                <span onClick={() => handleCityClick(city)}>{city}</span>
                <button className="remove-city-button" onClick={() => handleRemoveCity(city)}>
                  Rimuovi Città
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-cities-message">Non hai ancora visitato nessuna città. Inizia ad aggiungerne dalla mappa!</p>
        )}
      </main>
    </div>
  );
}
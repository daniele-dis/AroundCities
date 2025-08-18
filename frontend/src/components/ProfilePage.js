import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProfilePage.css"; 

export default function ProfilePage() {
  const [visitedCities, setVisitedCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carica la lista delle città salvate
    const storedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];
    setVisitedCities(storedCities);
  }, []);

  const handleCityClick = (cityName) => {
    // Naviga alla pagina dei dettagli della città, passando il nome
    navigate(`/city/${encodeURIComponent(cityName.toLowerCase())}`, {
      state: {
        cityData: { name: cityName },
      },
    });
  };

  return (
    <div className="profile-container">
    <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />

      <button onClick={() => navigate(-1)} className="back-button-profile">
        ← Torna alla Mappa
      </button>
      <header className="profile-header">
        <h1>Il Mio Profilo</h1>
        <p>Città visitate: <span className="city-count">{visitedCities.length}</span></p>
      </header>
      <main className="profile-main">
        {visitedCities.length > 0 ? (
          <ul className="city-list">
            {visitedCities.map((city, index) => (
              <li key={index} onClick={() => handleCityClick(city)}>
                {city}
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
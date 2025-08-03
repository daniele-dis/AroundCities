import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import citiesData from '../data/cities.json';
import { COUNTRY_NAMES } from './MapPage';
import '../css/CityPage.css'; 

export default function CityPage() {
    const { countryCode } = useParams();
    const navigate = useNavigate();

    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

    useEffect(() => {
        setLoading(true);
        const citiesInCountry = citiesData.filter(city => city.country === countryCode);

        if (searchTerm) {
            const results = citiesInCountry.filter(city => 
                city.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCities(results);
        } else {
            setFilteredCities(citiesInCountry);
        }
        setLoading(false);
    }, [countryCode, searchTerm]);

    const handleCityClick = (city) => {
        navigate(`/city/${encodeURIComponent(city.name.toLowerCase())}`, {
            state: { cityData: city }
        });
    };

    const handleBackClick = (event) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <div className="city-page-container">
            <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />

            {/* Inizia l'intestazione (header), che era mancante nel codice precedente */}
            <header className="city-page-header">
                <button onClick={handleBackClick} className="back-button" aria-label="Torna alla mappa">
                    ← Torna alla mappa
                </button>
                <h1 className="country-title">Città in {countryName}</h1>
                <input
                    type="text"
                    placeholder="Cerca città..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="city-search-input"
                    aria-label="Cerca città"
                />
            </header>
            {/* Finisce l'intestazione */}
            
            <main>
                <div className="cities-scroll-container">
                    <section className="cities-grid">
                        {loading ? (
                            <p className="loading-message">Caricamento in corso...</p>
                        ) : filteredCities.length > 0 ? (
                            filteredCities.map((city, index) => (
                                <div
                                    key={index}
                                    className="city-card"
                                    onClick={() => handleCityClick(city)}
                                    role="button"
                                    tabIndex="0"
                                    aria-label={`Dettagli della città di ${city.name}`}
                                >
                                    <h2 className="city-name">{city.name}</h2>
                                    <p className="city-region">{city.region}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-results">Nessuna città trovata. Prova un'altra ricerca.</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
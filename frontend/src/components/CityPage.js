import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import citiesData from '../data/cities.json';
import { COUNTRY_NAMES } from './MapPage';
import '../css/CityPage.css'; // Assicurati di creare un file CSS per lo stile

export default function CityPage() {
    const { countryCode } = useParams();
    const navigate = useNavigate();

    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Prende il nome del paese dalla mappatura
    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

    // Effetto per filtrare le città all'avvio e quando la ricerca cambia
    useEffect(() => {
        let citiesInCountry = citiesData.filter(city => city.country === countryCode);

        if (searchTerm) {
            citiesInCountry = citiesInCountry.filter(city => 
                city.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredCities(citiesInCountry);
    }, [countryCode, searchTerm]);

    const handleCityClick = (city) => {
        // Naviga alla pagina dei dettagli della città
        navigate(`/city/${encodeURIComponent(city.name.toLowerCase())}`, {
            state: { cityData: city }
        });
    };

    const handleBackClick = () => {
        // Torna alla pagina precedente (MapPage)
        navigate(-1);
    };

    return (
        <div className="city-page-container">
            <div className="city-page-header">
                <button onClick={handleBackClick} className="back-button">
                    ← Torna alla mappa
                </button>
                <h2 className="country-title">Città in {countryName}</h2>
                <input
                    type="text"
                    placeholder="Cerca città..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="city-search-input"
                />
            </div>

            <div className="cities-grid">
                {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                        <div
                            key={index}
                            className="city-card"
                            onClick={() => handleCityClick(city)}
                        >
                            <h4>{city.name}</h4>
                            <div className="city-info">
                                <span className="city-region">{city.region}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">Nessuna città trovata.</p>
                )}
            </div>
        </div>
    );
}
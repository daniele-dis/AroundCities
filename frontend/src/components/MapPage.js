// src/components/MapPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/MapPage.css';

const regions = [
  { id: 'europe', name: 'Europa', emoji: '🇪🇺', color: '#88C9BF' },
  { id: 'south-america', name: 'Sud America', emoji: '🌎', color: '#F5A623' },
  { id: 'north-america', name: 'Nord America', emoji: '🇺🇸', color: '#4A90E2' },
  { id: 'asia', name: 'Asia', emoji: '🌏', color: '#D0021B' },
  { id: 'africa', name: 'Africa', emoji: '🌍', color: '#F8E71C' },
  { id: 'oceania', name: 'Oceania', emoji: '🇦🇺', color: '#7ED321' }
];

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
    console.log(`Selected region: ${regionId}`);
  };

  const handleCityClick = (city) => {
    navigate(`/city/${city.id}`);
  };

  return (
    <div className="map-page-container">
      <header className="map-header">
        <h1 className="city-glow-title">Around Cities</h1>
        <p className="city-subtitle">Esplora le storie del mondo</p>
      </header>

      <div className="map-interactive-container">
        <div className="world-map">
          <svg viewBox="0 0 800 400" className="map-svg">
            <path 
              d="M350,100 L400,120 L380,150 L330,130 Z" 
              className={`map-region ${selectedRegion === 'europe' ? 'active' : ''}`}
              onClick={() => handleRegionClick('europe')}
              fill={regions.find(r => r.id === 'europe').color}
            />
            
            <path 
              d="M300,250 L350,270 L320,320 L280,300 Z" 
              className={`map-region ${selectedRegion === 'south-america' ? 'active' : ''}`}
              onClick={() => handleRegionClick('south-america')}
              fill={regions.find(r => r.id === 'south-america').color}
            />
            
            <path 
              d="M200,100 L250,120 L280,180 L230,160 Z" 
              className={`map-region ${selectedRegion === 'north-america' ? 'active' : ''}`}
              onClick={() => handleRegionClick('north-america')}
              fill={regions.find(r => r.id === 'north-america').color}
            />
            
            <path 
              d="M500,150 L550,170 L580,220 L530,200 Z" 
              className={`map-region ${selectedRegion === 'asia' ? 'active' : ''}`}
              onClick={() => handleRegionClick('asia')}
              fill={regions.find(r => r.id === 'asia').color}
            />
            
            <path 
              d="M400,250 L450,270 L420,320 L380,300 Z" 
              className={`map-region ${selectedRegion === 'africa' ? 'active' : ''}`}
              onClick={() => handleRegionClick('africa')}
              fill={regions.find(r => r.id === 'africa').color}
            />
            
            <path 
              d="M600,300 L650,320 L620,370 L580,350 Z" 
              className={`map-region ${selectedRegion === 'oceania' ? 'active' : ''}`}
              onClick={() => handleRegionClick('oceania')}
              fill={regions.find(r => r.id === 'oceania').color}
            />
          </svg>
        </div>

        <div className="regions-sidebar">
          {regions.map(region => (
            <button
              key={region.id}
              className={`region-button ${selectedRegion === region.id ? 'active' : ''}`}
              onClick={() => handleRegionClick(region.id)}
              style={{ backgroundColor: region.color }}
            >
              <span className="region-emoji">{region.emoji}</span>
              <span className="region-name">{region.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedRegion && (
        <div className="region-details">
          <h3>{regions.find(r => r.id === selectedRegion).name}</h3>
          <div className="cities-grid">
            {getCitiesForRegion(selectedRegion).map(city => (
              <div 
                key={city.id} 
                className="city-card"
                onClick={() => handleCityClick(city)}
              >
                {city.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Funzione helper per ottenere le città per regione
function getCitiesForRegion(regionId) {
  const cities = {
    europe: [
      { id: 'rome', name: 'Roma' },
      { id: 'paris', name: 'Parigi' },
      { id: 'barcelona', name: 'Barcellona' }
    ],
    'south-america': [
      { id: 'buenos-aires', name: 'Buenos Aires' },
      { id: 'rio', name: 'Rio de Janeiro' },
      { id: 'lima', name: 'Lima' }
    ],
    // Aggiungi altre città per le altre regioni
  };

  return cities[regionId] || [];
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/MapPage.css';

const worldContinentsGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": { "name": "Europe", "id": "europe" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [10, 50], [20, 60], [30, 55], [25, 45], [10, 50]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "South America", "id": "south-america" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-70, -10], [-60, -20], [-50, -30], [-80, -40], [-70, -10]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "North America", "id": "north-america" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-120, 40], [-100, 50], [-80, 30], [-110, 20], [-120, 40]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "Asia", "id": "asia" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80, 40], [100, 50], [120, 30], [90, 20], [80, 40]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "Africa", "id": "africa" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [10, 0], [30, 10], [40, -10], [20, -20], [10, 0]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "Oceania", "id": "oceania" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [140, -10], [150, -20], [160, -30], [130, -40], [140, -10]
                ]]
            }
        }
    ]
};

const regions = [
    { id: 'europe', name: 'Europa', emoji: '🇪🇺', color: '#6A994E' },
    { id: 'south-america', name: 'Sud America', emoji: '🌎', color: '#C15543' },
    { id: 'north-america', name: 'Nord America', emoji: '🇺🇸', color: '#4F6D7A' },
    { id: 'asia', name: 'Asia', emoji: '🌏', color: '#8C5252' },
    { id: 'africa', name: 'Africa', emoji: '🌍', color: '#B08E3B' },
    { id: 'oceania', name: 'Oceania', emoji: '🇦🇺', color: '#5C7C7B' }
];

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(user);
        }
    }, []);

    const handleRegionClick = (regionId) => {
        setSelectedRegion(regionId);
    };

    const handleCityClick = (city) => {
        navigate(`/city/${city.id}`);
    };

    const getFeatureStyle = () => {
        return {
            fillColor: 'transparent',
            weight: 0,
            opacity: 0,
            color: 'transparent',
            fillOpacity: 0
        };
    };

    const onEachFeature = (feature, layer) => {
        const regionId = feature.properties.id;
        
        layer.on({
            click: () => handleRegionClick(regionId)
        });
    };

    return (
        <div className="map-page-container">
            <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
            
            <header className="map-header">
                <h1 className="city-glow-title-map">
                    Benvenuto{loggedInUser ? `, ${loggedInUser}` : ''}!
                </h1>
                <p className="city-subtitle">Esplora le storie del mondo</p>
            </header>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Around Cities. Tutti i diritti riservati.</p>
                <p>Sviluppato da Daniele Di Sarno & Ciro La Rocca</p>
            </footer>

            <div className="map-interactive-container">
                <div className="world-map">
                    <MapContainer 
                        center={[20, 0]}
                        zoom={2}
                        minZoom={2}
                        maxBounds={[[-90, -180], [90, 180]]}
                        maxBoundsViscosity={1.0}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={worldContinentsGeoJSON}
                            style={getFeatureStyle}
                            onEachFeature={onEachFeature}
                        />
                    </MapContainer>
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
        'north-america': [
            { id: 'new-york', name: 'New York' },
            { id: 'mexico-city', name: 'Città del Messico' },
            { id: 'toronto', name: 'Toronto' }
        ],
        asia: [
            { id: 'tokyo', name: 'Tokyo' },
            { id: 'beijing', name: 'Pechino' },
            { id: 'mumbai', name: 'Mumbai' }
        ],
        africa: [
            { id: 'cairo', name: 'Il Cairo' },
            { id: 'capetown', name: 'Città del Capo' },
            { id: 'lagos', name: 'Lagos' }
        ],
        oceania: [
            { id: 'sydney', name: 'Sydney' },
            { id: 'auckland', name: 'Auckland' },
            { id: 'melbourne', name: 'Melbourne' }
        ]
    };
    return cities[regionId] || [];
}
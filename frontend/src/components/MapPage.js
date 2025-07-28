import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/MapPage.css';
import citiesData from '../data/cities.json';

// Configurazione completa dei continenti con codici paese
const CONTINENTS = {
  EUROPE: {
    id: 'europe',
    name: 'Europa',
    emoji: '🇪🇺',
    color: '#6A994E',
    countries: ['AD', 'AL', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA']
  },
  SOUTH_AMERICA: {
    id: 'south-america',
    name: 'Sud America',
    emoji: '🌎',
    color: '#C15543',
    countries: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE']
  },
  NORTH_AMERICA: {
    id: 'north-america',
    name: 'Nord America',
    emoji: '🇺🇸',
    color: '#4F6D7A',
    countries: ['US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU', 'DO', 'HT', 'JM', 'BS', 'BB', 'GD', 'KN', 'LC', 'VC', 'TT']
  },
  ASIA: {
    id: 'asia',
    name: 'Asia',
    emoji: '🌏',
    color: '#8C5252',
    countries: ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE']
  },
  AFRICA: {
    id: 'africa',
    name: 'Africa',
    emoji: '🌍',
    color: '#B08E3B',
    countries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW']
  },
  OCEANIA: {
    id: 'oceania',
    name: 'Oceania',
    emoji: '🇦🇺',
    color: '#5C7C7B',
    countries: ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'TO', 'TV', 'KI', 'FM', 'MH', 'NR', 'PW']
  }
};

const worldContinentsGeoJSON = {
    "type": "FeatureCollection",
    "features": Object.values(CONTINENTS).map(continent => ({
        "type": "Feature",
        "properties": { "name": continent.name, "id": continent.id },
        "geometry": {
            "type": "Polygon",
            "coordinates": [getContinentCoordinates(continent.id)]
        }
    }))
};

function getContinentCoordinates(continentId) {
  // Coordinate approssimative dei continenti (personalizzabili)
  const coords = {
    'europe': [[10, 50], [20, 60], [30, 55], [25, 45], [10, 50]],
    'south-america': [[-70, -10], [-60, -20], [-50, -30], [-80, -40], [-70, -10]],
    // ... aggiungi altri continenti
  };
  return coords[continentId] || [[0, 0], [0, 0], [0, 0], [0, 0]];
}

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(user);
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            const currentContinent = Object.values(CONTINENTS).find(c => c.id === selectedRegion);
            const regionCities = citiesData.filter(city => 
                currentContinent?.countries.includes(city.country)
            );
            setFilteredCities(regionCities);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedRegion && searchTerm) {
            const currentContinent = Object.values(CONTINENTS).find(c => c.id === selectedRegion);
            const filtered = citiesData.filter(city => 
                currentContinent?.countries.includes(city.country) &&
                city.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCities(filtered);
        } else if (selectedRegion) {
            const currentContinent = Object.values(CONTINENTS).find(c => c.id === selectedRegion);
            const regionCities = citiesData.filter(city => 
                currentContinent?.countries.includes(city.country)
            );
            setFilteredCities(regionCities);
        }
    }, [searchTerm, selectedRegion]);

    const handleRegionClick = (regionId) => {
        setSelectedRegion(regionId);
        setSearchTerm('');
    };

    const handleCityClick = (city) => {
        navigate(`/city/${encodeURIComponent(city.name.toLowerCase())}`, {
            state: {
                cityData: {
                    ...city,
                    lat: parseFloat(city.lat),
                    lng: parseFloat(city.lng)
                }
            }
        });
    };

    const getFeatureStyle = () => ({
        fillColor: 'transparent',
        weight: 0,
        opacity: 0,
        color: 'transparent',
        fillOpacity: 0
    });

    const onEachFeature = (feature, layer) => {
        layer.on({
            click: () => handleRegionClick(feature.properties.id)
        });
    };

   return (
    <div className="map-page-container">
        
    <div className="welcome-box">
        <div className="city-glow-title-map">
            Benvenuto{loggedInUser?.endsWith('a') ? 'a' : ''}, {loggedInUser}
        </div>
        <div className="city-subtitle">
            Seleziona una regione dal mondo per iniziare a esplorare.
        </div>
    </div>

        {/* Contenuto interattivo della mappa */}
        <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
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
                {Object.values(CONTINENTS).map(region => (
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
                <div className="region-header">
                    <h3>{CONTINENTS[selectedRegion.toUpperCase().replace('-', '_')]?.name || selectedRegion}</h3>
                    <input
                        type="text"
                        placeholder="Cerca città..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                {filteredCities.length > 0 ? (
                    <div className="cities-grid">
                        {filteredCities.map((city, index) => (
                            <div
                                key={`${city.name}-${index}`}
                                className="city-card"
                                onClick={() => handleCityClick(city)}
                            >
                                <h4>{city.name}</h4>
                                <div className="city-info">
                                    <span className="country-code">{city.country}</span>
                                    <div className="coordinates">
                                        <span>Lat: {Number(city.lat).toFixed(4)}</span>
                                        <span>Lng: {Number(city.lng).toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">
                        {searchTerm ? 'Nessun risultato trovato' : 'Caricamento città...'}
                    </p>
                )}
            </div>
        )}
    </div>
);

}
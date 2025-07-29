import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/MapPage.css';
import citiesData from '../data/cities.json';
import worldContinentsGeoJSON from '../data/continents.json'; // Questo è il tuo file continents.json

// Correggi l'icona di default di Leaflet che potrebbe non caricarsi correttamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Configurazione completa dei continenti con codici paese
const CONTINENTS = {
    EUROPE: {
        id: 'europe',
        name: 'Europe', // Corretto: deve corrispondere a "Europe" nel GeoJSON
        emoji: '🇪🇺',
        color: '#6A994E',
        countries: ['AD', 'AL', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA']
    },
    SOUTH_AMERICA: {
        id: 'south-america',
        name: 'South America', // Corretto: deve corrispondere a "South America" nel GeoJSON
        emoji: '🌎',
        color: '#C15543',
        countries: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE']
    },
    NORTH_AMERICA: {
        id: 'north-america',
        name: 'North America', // Corretto: deve corrispondere a "North America" nel GeoJSON
        emoji: '🇺🇸',
        color: '#4F6D7A',
        countries: ['US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU', 'DO', 'HT', 'JM', 'BS', 'BB', 'GD', 'KN', 'LC', 'VC', 'TT']
    },
    ASIA: {
        id: 'asia',
        name: 'Asia', // Già corretto
        emoji: '🌏',
        color: '#8C5252',
        countries: ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE']
    },
    AFRICA: {
        id: 'africa',
        name: 'Africa', // Già corretto
        emoji: '🌍',
        color: '#B08E3B',
        countries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW']
    },
    OCEANIA: {
        id: 'oceania',
        name: 'Australia', // Corretto: deve corrispondere a "Australia" nel GeoJSON, non "Oceania"
        emoji: '🇦🇺',
        color: '#5C7C7B',
        countries: ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'TO', 'TV', 'KI', 'FM', 'MH', 'NR', 'PW']
    },
    ANTARCTICA: {
        id: 'antarctica',
        name: 'Antarctica', // Corretto: deve corrispondere a "Antarctica" nel GeoJSON
        emoji: '🇦🇶',
        color: '#A0A0A0',
        countries: []
    }
};

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Mappa per tenere traccia dei layer Leaflet per ID del continente
    const continentLayers = useRef({});

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(user);
    }, []);

    // Helper function to get continent ID from GeoJSON continent name
    const getContinentIdFromGeoJSONName = (geoJSONContinentName) => {
        // Trova il continente nella tua configurazione basandosi sul nome, ignorando la case
        const foundContinent = Object.values(CONTINENTS).find(c => c.name.toLowerCase() === geoJSONContinentName.toLowerCase());
        return foundContinent ? foundContinent.id : null;
    };

    // Helper function to get continent config from its ID
    const getContinentConfigById = (id) => {
        return Object.values(CONTINENTS).find(c => c.id === id);
    };

    // Effetto per filtrare le città quando cambia la regione selezionata
    useEffect(() => {
        if (selectedRegion) {
            const currentContinentConfig = getContinentConfigById(selectedRegion);
            const regionCities = citiesData.filter(city =>
                currentContinentConfig?.countries.includes(city.country)
            );
            setFilteredCities(regionCities);
        } else {
            setFilteredCities([]); // Nessuna regione selezionata, nessuna città mostrata
        }
        setSearchTerm(''); // Resetta il termine di ricerca quando cambia la regione
    }, [selectedRegion]);

    // Effetto per filtrare le città quando cambia il termine di ricerca
    useEffect(() => {
        if (selectedRegion) {
            const currentContinentConfig = getContinentConfigById(selectedRegion);
            if (searchTerm) {
                const filtered = citiesData.filter(city =>
                    currentContinentConfig?.countries.includes(city.country) &&
                    city.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredCities(filtered);
            } else {
                const regionCities = citiesData.filter(city =>
                    currentContinentConfig?.countries.includes(city.country)
                );
                setFilteredCities(regionCities);
            }
        }
    }, [searchTerm, selectedRegion]);

    const handleRegionClick = (regionId) => {
        // Se c'è una regione selezionata in precedenza, ripristina il suo stile
        if (selectedRegion && continentLayers.current[selectedRegion]) {
            const prevLayer = continentLayers.current[selectedRegion];
            // Trova la feature associata al layer per ripristinare lo stile corretto
            const prevFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === selectedRegion
            );
            if (prevFeature) {
                prevLayer.setStyle(getFeatureStyle(prevFeature));
            }
        }

        // Se la regione cliccata è quella già selezionata, deselezionala
        // Altrimenti, seleziona la nuova regione
        const newSelectedRegion = selectedRegion === regionId ? null : regionId;
        setSelectedRegion(newSelectedRegion);

        // Applica lo stile di selezione al layer appena cliccato (se presente)
        if (newSelectedRegion && continentLayers.current[newSelectedRegion]) {
            const currentLayer = continentLayers.current[newSelectedRegion];
            const currentFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === newSelectedRegion
            );
            if (currentFeature) {
                currentLayer.setStyle(getFeatureStyle(currentFeature));
                currentLayer.bringToFront(); // Porta in primo piano il continente selezionato
            }
        }
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

    const getFeatureStyle = (feature) => {
        // Usa la proprietà 'CONTINENT' dal GeoJSON
        const continentNameFromGeoJSON = feature.properties.CONTINENT;
        const continentId = getContinentIdFromGeoJSONName(continentNameFromGeoJSON);
        const continentConfig = getContinentConfigById(continentId);

        if (!continentConfig) {
            // Questo caso dovrebbe verificarsi solo se c'è un continente nel GeoJSON senza una configurazione corrispondente
            console.warn(`Nessuna configurazione trovata per il continente: ${continentNameFromGeoJSON}`);
            return {
                fillColor: '#ccc', // Colore di fallback grigio chiaro
                weight: 1,
                opacity: 1,
                color: 'gray',
                fillOpacity: 0.2
            };
        }

        return {
            fillColor: continentConfig.color,
            weight: continentId === selectedRegion ? 3 : 1, // Bordo più spesso se selezionato
            opacity: 1,
            color: continentConfig.color, // Bordo dello stesso colore del continente
            fillOpacity: continentId === selectedRegion ? 0.7 : 0.2 // Opacità maggiore se selezionato, altrimenti minore
        };
    };

    const onEachFeature = (feature, layer) => {
        const continentNameFromGeoJSON = feature.properties.CONTINENT;
        const continentId = getContinentIdFromGeoJSONName(continentNameFromGeoJSON);
        const continentConfig = getContinentConfigById(continentId);

        if (!continentId || !continentConfig) {
            console.warn(`Could not find configuration or ID for continent: ${continentNameFromGeoJSON}. Event listeners will not be attached.`);
            return; // Non aggiungere listener se non possiamo identificare il continente
        }

        // Memorizza il riferimento al layer Leaflet per poterlo manipolare in seguito
        continentLayers.current[continentId] = layer;

        layer.on({
            click: () => handleRegionClick(continentId),
            mouseover: (e) => {
                const currentLayer = e.target;
                currentLayer.setStyle({
                    weight: 4,
                    color: continentConfig.color, // Colore del bordo basato sulla configurazione
                    fillColor: continentConfig.color, // Riempimento con lo stesso colore
                    dashArray: '',
                    fillOpacity: 0.6 // Opacità maggiore all'hover
                });
                currentLayer.bringToFront();
            },
            mouseout: (e) => {
                const currentLayer = e.target;
                currentLayer.setStyle(getFeatureStyle(feature)); // Ripristina lo stile normale
            }
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
                        {/* Assicurati che il nome sia preso correttamente */}
                        <h3>{getContinentConfigById(selectedRegion)?.name || selectedRegion}</h3>
                        <input
                            type="text"
                            placeholder="Cerca città..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button
                            className="clear-selection-button"
                            onClick={() => handleRegionClick(selectedRegion)}>
                            Annulla Selezione
                        </button>
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
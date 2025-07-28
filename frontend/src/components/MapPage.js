import React, { useState, useEffect } from "react"; // <-- AGGIUNGI 'useEffect' QUI
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Non dimenticare di importare il CSS di Leaflet
import '../css/MapPage.css'; // Il tuo file CSS personalizzato


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
        },
    ]
};


// Colori più tenui per le regioni, per un aspetto meno "giocattoloso"
const regions = [
    { id: 'europe', name: 'Europa', emoji: '🇪🇺', color: '#6A994E' }, // Verde oliva
    { id: 'south-america', name: 'Sud America', emoji: '🌎', color: '#C15543' }, // Rosso mattone
    { id: 'north-america', name: 'Nord America', emoji: '🇺🇸', color: '#4F6D7A' }, // Blu-grigio
    { id: 'asia', name: 'Asia', emoji: '🌏', color: '#8C5252' }, // Marrone rossiccio
    { id: 'africa', name: 'Africa', emoji: '🌍', color: '#B08E3B' }, // Giallo ocra
    { id: 'oceania', name: 'Oceania', emoji: '🇦🇺', color: '#5C7C7B' } // Verde acqua scuro
];

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(''); // <-- AGGIUNGI QUESTO STATO
    const navigate = useNavigate();

    // <-- AGGIUNGI QUESTO useEffect
    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(user);
        }
        // else {
        //     // Opzionale: reindirizza al login se l'utente non è loggato
        //     navigate('/login'); 
        // }
    }, []);
    // --> FINE AGGIUNTA useEffect

    const handleRegionClick = (regionId) => {
        setSelectedRegion(regionId);
        console.log(`Selected region: ${regionId}`);
        // Puoi aggiungere qui una logica per centrare la mappa sulla regione selezionata
        // o per ingrandire su di essa se necessario. Richiederebbe l'uso di 'useMap' hook di react-leaflet.
    };

    const handleCityClick = (city) => {
        navigate(`/city/${city.id}`);
    };

    // Stile per i livelli GeoJSON (continenti)
    const getFeatureStyle = (feature) => {
        // Assicurati che `feature.properties.id` corrisponda agli ID delle tue regioni.
        // Se il tuo GeoJSON reale usa un'altra proprietà (es. 'continent'), dovrai adattare qui.
        const region = regions.find(r => r.id === feature.properties.id);
        return {
            fillColor: region ? region.color : '#ccc', // Usa il colore della regione o un default
            weight: 2, // Spessore del bordo
            opacity: 1, // Opacità del bordo
            color: 'white', // Colore del bordo
            dashArray: '3', // Linea tratteggiata per il bordo
            fillOpacity: selectedRegion === feature.properties.id ? 0.9 : 0.7, // Opacità di riempimento
        };
    };

    // Funzione per gestire le interazioni con le feature GeoJSON (mouseover, click, mouseout)
    const onEachFeature = (feature, layer) => {
        const regionId = feature.properties.id; // L'ID del continente dal GeoJSON
        
        // Assicurati che il feature sia una delle regioni che ti interessano
        if (!regions.some(r => r.id === regionId)) {
            // Se il tuo GeoJSON contiene features che non sono continenti o che non vuoi interattive,
            // puoi ignorarle qui.
            return; 
        }

        layer.on({
            click: () => handleRegionClick(regionId),
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 5, // Bordo più spesso all'hover
                    color: '#666', // Colore del bordo all'hover
                    dashArray: '', // Bordo solido all'hover
                    fillOpacity: 0.9 // Opacità di riempimento maggiore all'hover
                });
                layer.bringToFront(); // Porta il poligono in primo piano all'hover
            },
            mouseout: (e) => {
                e.target.setStyle(getFeatureStyle(feature)); // Ripristina lo stile originale
            }
        });
    };

    return (
        <div className="map-page-container">

            <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
            
            <header className="map-header">
                {/* <-- MODIFICA QUESTA RIGA */}
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
                        center={[20, 0]} // Centro della mappa [latitudine, longitudine]
                        zoom={2}         // Livello di zoom iniziale
                        minZoom={2}      // Livello di zoom minimo
                        maxBounds={[[-90, -180], [90, 180]]} // Limita il panning
                        maxBoundsViscosity={1.0} // Impedisce di fare il panning fuori dai limiti
                        style={{ height: "100%", width: "100%" }} // Assicura che la mappa riempia il div
                        zoomControl={false} // Disabilita il controllo zoom di default
                        attributionControl={false} // Disabilita l'attribuzione Leaflet
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            // Puoi scegliere altri fornitori di tile, ad esempio per un look più artistico:
                            // "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
                            // "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                            // Vedi: https://leaflet-extras.github.io/leaflet-providers/preview/
                        />
                        {/* Renderizza i dati GeoJSON per i continenti */}
                        {worldContinentsGeoJSON && (
                            <GeoJSON
                                data={worldContinentsGeoJSON}
                                style={getFeatureStyle}
                                onEachFeature={onEachFeature}
                            />
                        )}
                    </MapContainer>
                </div>

                <div className="regions-sidebar">
                    {regions.map(region => (
                        <button
                            key={region.id}
                            className={`region-button ${selectedRegion === region.id ? 'active' : ''}`}
                            onClick={() => handleRegionClick(region.id)}
                            style={{ backgroundColor: region.color }} // Il colore di sfondo del pulsante
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

// Funzione helper per ottenere le città per regione (lasciata invariata)
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
        ],
    };


    return cities[regionId] || [];

}
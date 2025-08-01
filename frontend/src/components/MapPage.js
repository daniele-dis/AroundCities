import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/MapPage.css';
import '../css/LoginPage.css';
import citiesData from '../data/cities.json';
import worldContinentsGeoJSON from '../data/continents.json'; // Questo è il tuo file continents.json

// Correggi l'icona di default di Leaflet che potrebbe non caricarsi correttamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Mappatura completa da codice paese a nome paese
export const COUNTRY_NAMES = {
    // Europa
    'AD': 'Andorra', 'AL': 'Albania', 'AT': 'Austria', 'BE': 'Belgio', 'BA': 'Bosnia ed Erzegovina',
    'BG': 'Bulgaria', 'HR': 'Croazia', 'CY': 'Cipro', 'CZ': 'Repubblica Ceca', 'DK': 'Danimarca',
    'EE': 'Estonia', 'FI': 'Finlandia', 'FR': 'Francia', 'DE': 'Germania', 'GR': 'Grecia',
    'HU': 'Ungheria', 'IS': 'Islanda', 'IE': 'Irlanda', 'IT': 'Italia', 'XK': 'Kosovo',
    'LV': 'Lettonia', 'LI': 'Liechtenstein', 'LT': 'Lituania', 'LU': 'Lussemburgo', 'MT': 'Malta',
    'MD': 'Moldavia', 'MC': 'Monaco', 'ME': 'Montenegro', 'NL': 'Paesi Bassi', 'MK': 'Macedonia del Nord',
    'NO': 'Norvegia', 'PL': 'Polonia', 'PT': 'Portogallo', 'RO': 'Romania', 'SM': 'San Marino',
    'RS': 'Serbia', 'SK': 'Slovacchia', 'SI': 'Slovenia', 'ES': 'Spagna', 'SE': 'Svezia',
    'CH': 'Svizzera', 'UA': 'Ucraina', 'GB': 'Regno Unito', 'VA': 'Città del Vaticano',
    // America (Nord e Sud combinati)
    'US': 'Stati Uniti', 'CA': 'Canada', 'MX': 'Messico', 'BZ': 'Belize', 'CR': 'Costa Rica',
    'SV': 'El Salvador', 'GT': 'Guatemala', 'HN': 'Honduras', 'NI': 'Nicaragua', 'PA': 'Panama',
    'CU': 'Cuba', 'DO': 'Repubblica Dominicana', 'HT': 'Haiti', 'JM': 'Giamaica', 'BS': 'Bahamas',
    'BB': 'Barbados', 'GD': 'Grenada', 'KN': 'Saint Kitts e Nevis', 'LC': 'Santa Lucia',
    'VC': 'Saint Vincent e Grenadine', 'TT': 'Trinidad e Tobago',
    'AR': 'Argentina', 'BO': 'Bolivia', 'BR': 'Brasile', 'CL': 'Cile', 'CO': 'Colombia',
    'EC': 'Ecuador', 'FK': 'Isole Falkland', 'GF': 'Guyana Francese', 'GY': 'Guyana',
    'PY': 'Paraguay', 'PE': 'Perù', 'SR': 'Suriname', 'UY': 'Uruguay', 'VE': 'Venezuela',
    // Asia
    'AF': 'Afghanistan', 'AM': 'Armenia', 'AZ': 'Azerbaigian', 'BH': 'Bahrain', 'BD': 'Bangladesh',
    'BT': 'Bhutan', 'BN': 'Brunei', 'KH': 'Cambogia', 'CN': 'Cina', 'GE': 'Georgia',
    'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran', 'IQ': 'Iraq', 'IL': 'Israele',
    'JP': 'Giappone', 'JO': 'Giordania', 'KZ': 'Kazakistan', 'KW': 'Kuwait', 'KG': 'Kirghizistan',
    'LA': 'Laos', 'LB': 'Libano', 'MY': 'Malesia', 'MV': 'Maldive', 'MN': 'Mongolia',
    'MM': 'Myanmar', 'NP': 'Nepal', 'KP': 'Corea del Nord', 'OM': 'Oman', 'PK': 'Pakistan',
    'PH': 'Filippine', 'QA': 'Qatar', 'SA': 'Arabia Saudita', 'SG': 'Singapore', 'KR': 'Corea del Sud',
    'LK': 'Sri Lanka', 'SY': 'Siria', 'TW': 'Taiwan', 'TJ': 'Tagikistan', 'TH': 'Thailandia',
    'TR': 'Turchia', 'TM': 'Turkmenistan', 'AE': 'Emirati Arabi Uniti', 'UZ': 'Uzbekistan',
    'VN': 'Vietnam', 'YE': 'Yemen',
    // Africa
    'DZ': 'Algeria', 'AO': 'Angola', 'BJ': 'Benin', 'BW': 'Botswana', 'BF': 'Burkina Faso',
    'BI': 'Burundi', 'CV': 'Capo Verde', 'CM': 'Camerun', 'CF': 'Repubblica Centrafricana', 'TD': 'Ciad',
    'KM': 'Comore', 'CG': 'Congo-Brazzaville', 'CD': 'Congo-Kinshasa', 'DJ': 'Gibuti', 'EG': 'Egitto',
    'GQ': 'Guinea Equatoriale', 'ER': 'Eritrea', 'SZ': 'eSwatini', 'ET': 'Etiopia', 'GA': 'Gabon',
    'GM': 'Gambia', 'GH': 'Ghana', 'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'CI': 'Costa d\'Avorio',
    'KE': 'Kenya', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libia', 'MG': 'Madagascar',
    'MW': 'Malawi', 'ML': 'Mali', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MA': 'Marocco',
    'MZ': 'Mozambico', 'NA': 'Namibia', 'NE': 'Niger', 'NG': 'Nigeria', 'RW': 'Ruanda',
    'ST': 'São Tomé e Príncipe', 'SN': 'Senegal', 'SC': 'Seychelles', 'SL': 'Sierra Leone',
    'SO': 'Somalia', 'ZA': 'Sudafrica', 'SS': 'Sud Sudan', 'SD': 'Sudan', 'TZ': 'Tanzania',
    'TG': 'Togo', 'TN': 'Tunisia', 'UG': 'Uganda', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
    // Oceania
    'AU': 'Australia', 'NZ': 'Nuova Zelanda', 'FJ': 'Figi', 'PG': 'Papua Nuova Guinea',
    'SB': 'Isole Salomone', 'VU': 'Vanuatu', 'NC': 'Nuova Caledonia', 'PF': 'Polinesia Francese',
    'WS': 'Samoa', 'TO': 'Tonga', 'TV': 'Tuvalu', 'KI': 'Kiribati', 'FM': 'Micronesia',
    'MH': 'Isole Marshall', 'NR': 'Nauru', 'PW': 'Palau',
    // Antartide
    'AQ': 'Antartide'
};


// Configurazione completa dei continenti con codici paese
const CONTINENTS = {
    EUROPE: {
        id: 'europe',
        name: 'Europe',
        emoji: '🇪🇺',
        color: '#6A994E',
        countries: ['AD', 'AL', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA']
    },
    AMERICA: { // Nuovo continente America
        id: 'america',
        name: 'America',
        emoji: '🌎', // Puoi scegliere un'emoji che rappresenti l'intero continente
        color: '#4F6D7A', // Colore per l'America
        countries: [
            // Paesi del Nord America
            'US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU', 'DO', 'HT', 'JM', 'BS', 'BB', 'GD', 'KN', 'LC', 'VC', 'TT',
            // Paesi del Sud America
            'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'
        ]
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
        name: 'Australia',
        emoji: '🇦🇺',
        color: '#5C7C7B',
        countries: ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'TO', 'TV', 'KI', 'FM', 'MH', 'NR', 'PW']
    },
    ANTARCTICA: {
        id: 'antarctica',
        name: 'Antarctica',
        emoji: '🇦🇶',
        color: '#A0A0A0',
        countries: []
    }
};

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null); // ID del continente selezionato
    const [selectedCountry, setSelectedCountry] = useState(null); // Codice del paese selezionato
    const [currentView, setCurrentView] = useState('continents'); // 'continents', 'countries', 'cities'
    const [loggedInUser, setLoggedInUser] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]); // Nuovo stato per i paesi filtrati
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const continentLayers = useRef({}); // Mappa per tenere traccia dei layer Leaflet per ID del continente

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(user);
    }, []);

    // Helper function to get continent ID from GeoJSON continent name
    const getContinentIdFromGeoJSONName = (geoJSONContinentName) => {
        const lowerCaseName = geoJSONContinentName.toLowerCase();
        // Mappa i nomi specifici del GeoJSON ('north america', 'south america', 'america') al nostro ID unificato 'america'
        if (lowerCaseName.includes('america')) { // Più generico per catturare qualsiasi variazione
            return 'america';
        }
        // Per gli altri continenti, trova in base al nome configurato
        const foundContinent = Object.values(CONTINENTS).find(c => c.name.toLowerCase() === lowerCaseName);
        if (!foundContinent) {
            console.warn(`Mismatch: GeoJSON continent name "${geoJSONContinentName}" not found in CONTINENTS config.`);
        }
        return foundContinent ? foundContinent.id : null;
    };

    // Helper function to get continent config from its ID
    const getContinentConfigById = (id) => {
        return Object.values(CONTINENTS).find(c => c.id === id);
    };

    // Effetto per filtrare le liste in base alla vista e al termine di ricerca
    useEffect(() => {
        console.log("Current View:", currentView);
        console.log("Selected Region:", selectedRegion ? getContinentConfigById(selectedRegion)?.name : 'None');
        console.log("Selected Country:", selectedCountry ? COUNTRY_NAMES[selectedCountry] : 'None');
        console.log("Search Term:", searchTerm);

        if (currentView === 'cities' && selectedCountry) {
            const citiesInSelectedCountry = citiesData.filter(city =>
                city.country === selectedCountry
            );
            const newFilteredCities = searchTerm
                ? citiesInSelectedCountry.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
                : citiesInSelectedCountry;
            setFilteredCities(newFilteredCities);
            console.log("Filtered Cities count:", newFilteredCities.length); // Log della variabile locale
        } else if (currentView === 'countries' && selectedRegion) {
            const continentConfig = getContinentConfigById(selectedRegion);
            if (continentConfig) {
                const countriesInContinent = continentConfig.countries.map(code => ({
                    code: code,
                    name: COUNTRY_NAMES[code] || `Paese Sconosciuto (${code})` // Usa la mappatura
                }));
                const newFilteredCountries = searchTerm
                    ? countriesInContinent.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    : countriesInContinent;
                setFilteredCountries(newFilteredCountries);
                console.log("Filtered Countries count:", newFilteredCountries.length); // Log della variabile locale
            } else {
                setFilteredCountries([]);
                console.log("Filtered Countries count: 0 (no continent config)");
            }
        } else {
            // Se non c'è una regione selezionata o siamo nella vista continenti
            setFilteredCities([]);
            setFilteredCountries([]);
            console.log("Filtered Cities count: 0, Filtered Countries count: 0 (initial/continents view)");
        }
    }, [currentView, selectedRegion, selectedCountry, searchTerm]); // Rimosso citiesData come dipendenza

    const handleRegionClick = (regionId) => {
        console.log(`Region clicked: ${regionId}, currentView: ${currentView}`);
        // Ripristina lo stile del continente precedentemente selezionato
        if (selectedRegion && continentLayers.current[selectedRegion]) {
            const prevLayer = continentLayers.current[selectedRegion];
            const prevFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === selectedRegion
            );
            if (prevFeature) {
                prevLayer.setStyle(getFeatureStyle(prevFeature));
            }
        }

        // Logica per cambiare vista o deselezionare
        if (selectedRegion === regionId && currentView === 'countries') {
            // Se clicco sullo stesso continente e sono già nella vista paesi, torno alla vista continenti
            setSelectedRegion(null);
            setSelectedCountry(null);
            setCurrentView('continents');
            setSearchTerm('');
        } else {
            // Se clicco su un nuovo continente o sono nella vista continenti, vado alla vista paesi
            setSelectedRegion(regionId);
            setSelectedCountry(null); // Resetta il paese selezionato
            setCurrentView('countries');
            setSearchTerm(''); // Resetta il termine di ricerca
        }

        // Applica lo stile di selezione al layer appena cliccato (se presente)
        if (regionId && continentLayers.current[regionId]) {
            const currentLayer = continentLayers.current[regionId];
            const currentFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === regionId
            );
            if (currentFeature) {
                currentLayer.setStyle(getFeatureStyle(currentFeature));
                currentLayer.bringToFront(); // Porta in primo piano il continente selezionato
            }
        }
    };

// ... (tutto il codice precedente rimane invariato) ...

    const handleCountryClick = (countryCode) => {
        console.log(`Country clicked: ${countryCode}`);

        // Se il paese cliccato è l'Italia, naviga a una nuova pagina per le città italiane.
        if (countryCode === 'IT') {
            navigate(`/cities/${countryCode}`);
        } else {
            // Altrimenti, continua con la logica esistente di mostrare le città nel pannello laterale
            setSelectedCountry(countryCode);
            setCurrentView('cities');
            setSearchTerm('');
        }
    };

// ... (il resto del tuo componente rimane invariato) ...

    const handleCityClick = (city) => {
        console.log(`City clicked: ${city.name}`);
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
        const continentNameFromGeoJSON = feature.properties.CONTINENT;
        const continentId = getContinentIdFromGeoJSONName(continentNameFromGeoJSON);
        const continentConfig = getContinentConfigById(continentId);

        // Log per debugging del colore
        console.log(`Styling feature for GeoJSON continent "${continentNameFromGeoJSON}" (mapped to ID: "${continentId}") with color: ${continentConfig?.color || '#ccc'}`);


        if (!continentConfig) {
            console.warn(`Nessuna configurazione trovata per il continente: ${continentNameFromGeoJSON}`);
            return {
                fillColor: '#ccc',
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
        console.log("Processing GeoJSON feature:", continentNameFromGeoJSON); // Log del nome continente dal GeoJSON
        const continentId = getContinentIdFromGeoJSONName(continentNameFromGeoJSON);
        const continentConfig = getContinentConfigById(continentId);

        if (!continentId || !continentConfig) {
            console.warn(`Could not find configuration or ID for continent: ${continentNameFromGeoJSON}. Event listeners will not be attached.`);
            return;
        }

        // Memorizza il riferimento al layer Leaflet per poterlo manipolare in seguito
        // Importante: per l'America, tutti i layer (Nord e Sud) devono puntare allo stesso ID 'america'
        continentLayers.current[continentId] = layer;


        layer.on({
            click: () => handleRegionClick(continentId),
            mouseover: (e) => {
                const currentLayer = e.target;
                currentLayer.setStyle({
                    weight: 4, // Bordo ben marcato
                    color: continentConfig.color, // Colore del bordo basato sulla configurazione
                    fillColor: continentConfig.color, // Riempimento con lo stesso colore
                    dashArray: '',
                    fillOpacity: 0.4 // Opacità ridotta per l'hover
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
      { /*              {currentView === 'countries' && `Esplora i paesi in ${getContinentConfigById(selectedRegion)?.name || 'questa regione'}.`}
                    {currentView === 'cities' && `Esplora le città in ${COUNTRY_NAMES[selectedCountry] || 'questo paese'}.`} */}
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
                    {/* Sidebar sempre visibile per i continenti */}
                    {Object.values(CONTINENTS).map(region => (
                        <button
                            key={region.id}
                            className={`region-button ${selectedRegion === region.id && currentView !== 'continents' ? 'active' : ''}`}
                            onClick={() => handleRegionClick(region.id)}
                            style={{ backgroundColor: region.color }}
                        >
                            <span className="region-emoji">{region.emoji}</span>
                            <span className="region-name">{region.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pannello Dettagli Dinamico */}
            {selectedRegion && (
                <div className="region-details">
                    <div className="region-header">
                        {currentView === 'countries' && (
                            <>
                                <h3>Paesi {getContinentConfigById(selectedRegion)?.name || selectedRegion} </h3>
                                <input
                                    type="text"
                                    placeholder="Cerca Paese..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="country-search-input"
                                />
                                {/* Pulsante per Resettare il testo nel form di input*/}
                                <button
                                    className="clear-country-button"
                                    onClick={() => setSearchTerm('')}> 
                                    <strong>Reset Ricerca Paese</strong>
                                </button>

                                <button
                                    className="clear-selection-button"
                                    onClick={() => handleRegionClick(selectedRegion)}> {/* Cliccare sulla X per resettare la selezione del continente*/}
                                    <strong>Reset Continente Selezionato</strong>
                                </button>
                            </>
                        )}
                        {currentView === 'cities' && selectedCountry && (
                            <>
                                <h3>Città in {COUNTRY_NAMES[selectedCountry] || selectedCountry}</h3>
                                <input
                                    type="text"
                                    placeholder="Cerca città..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <button
                                    className="clear-selection-button"
                                    onClick={() => handleCountryClick(selectedCountry)}> {/* Cliccare lo stesso paese per tornare indietro */}
                                    Annulla Selezione Paese
                                </button>
                            </>
                        )}
                    </div>

                    {currentView === 'countries' && filteredCountries.length > 0 ? (
                        <div className="countries-grid"> {/* Nuova griglia per i paesi */}
                            {filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    className="country-card"
                                    onClick={() => handleCountryClick(country.code)}
                                >
                                    <h4>{country.name}</h4>
                                    <span className="country-code">{country.code}</span>
                                </div>
                            ))}
                        </div>
                    ) : currentView === 'countries' && searchTerm && filteredCountries.length === 0 ? (
                        <p className="no-results">Nessun paese trovato per "{searchTerm}"</p>
                    ) : currentView === 'countries' && !searchTerm && filteredCountries.length === 0 ? (
                        <p className="no-results">Nessun paese disponibile per questa regione.</p>
                    ) : null}


                    {currentView === 'cities' && filteredCities.length > 0 ? (
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
                    ) : currentView === 'cities' && searchTerm && filteredCities.length === 0 ? (
                        <p className="no-results">Nessuna città trovata per "{searchTerm}"</p>
                    ) : currentView === 'cities' && !searchTerm && filteredCities.length === 0 ? (
                        <p className="no-results">Nessuna città disponibile per questo paese.</p>
                    ) : null}

                </div>
            )}

        </div>
        
    );
    
}
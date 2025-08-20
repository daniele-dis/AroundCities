import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/MapPage.css';
import '../css/LoginPage.css';
import citiesData from '../data/cities.json';
import worldContinentsGeoJSON from '../data/continents.json'; 

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
        emoji: '🌍', // Europa + Africa
        color: '#6A994E',
        countries: ['AD', 'AL', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA']
    },
    AMERICA: {
        id: 'america',
        name: 'America',
        emoji: '🌎', // Americhe
        color: '#4F6D7A', 
        countries: [
            'US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU', 'DO', 'HT', 'JM', 'BS', 'BB', 'GD', 'KN', 'LC', 'VC', 'TT',
            'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'
        ]
    },
    ASIA: {
        id: 'asia',
        name: 'Asia',
        emoji: '🌏', // Asia
        color: '#8C5252',
        countries: ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE']
    },
    AFRICA: {
        id: 'africa',
        name: 'Africa',
        emoji: '🌍', // Europa + Africa
        color: '#B08E3B',
        countries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW']
    },
    OCEANIA: {
        id: 'oceania',
        name: 'Australia',
        emoji: '🌏', // Asia + Oceania
        color: '#5C7C7B',
        countries: ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'TO', 'TV', 'KI', 'FM', 'MH', 'NR', 'PW']
    },
    ANTARCTICA: {
        id: 'antarctica',
        name: 'Antarctica',
        emoji: '❄️', // meglio fiocco di neve per rappresentare il Polo Sud
        color: '#A0A0A0',
        countries: []
    }

};

export default function MapPage() {
    const [selectedRegion, setSelectedRegion] = useState(null); 
    const [selectedCountry, setSelectedCountry] = useState(null); 
    const [currentView, setCurrentView] = useState('continents'); 
    const [loggedInUser, setLoggedInUser] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const continentLayers = useRef({}); 

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(user);
    }, []);

    // Helper function to get continent ID from GeoJSON continent name
    const getContinentIdFromGeoJSONName = (geoJSONContinentName) => {
        const lowerCaseName = geoJSONContinentName.toLowerCase();
        if (lowerCaseName.includes('america')) { 
            return 'america';
        }
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
            console.log("Filtered Cities count:", newFilteredCities.length); 
        } else if (currentView === 'countries' && selectedRegion) {
            const continentConfig = getContinentConfigById(selectedRegion);
            if (continentConfig) {
                const countriesInContinent = continentConfig.countries.map(code => ({
                    code: code,
                    name: COUNTRY_NAMES[code] || `Paese Sconosciuto (${code})`
                }));
                const newFilteredCountries = searchTerm
                    ? countriesInContinent.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    : countriesInContinent;
                setFilteredCountries(newFilteredCountries);
                console.log("Filtered Countries count:", newFilteredCountries.length); 
            } else {
                setFilteredCountries([]);
                console.log("Filtered Countries count: 0 (no continent config)");
            }
        } else {
            setFilteredCities([]);
            setFilteredCountries([]);
            console.log("Filtered Cities count: 0, Filtered Countries count: 0 (initial/continents view)");
        }
    }, [currentView, selectedRegion, selectedCountry, searchTerm]);

    const handleRegionClick = (regionId) => {
        console.log(`Region clicked: ${regionId}, currentView: ${currentView}`);
        if (selectedRegion && continentLayers.current[selectedRegion]) {
            const prevLayer = continentLayers.current[selectedRegion];
            const prevFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === selectedRegion
            );
            if (prevFeature) {
                prevLayer.setStyle(getFeatureStyle(prevFeature));
            }
        }

        if (selectedRegion === regionId && currentView === 'countries') {
            setSelectedRegion(null);
            setSelectedCountry(null);
            setCurrentView('continents');
            setSearchTerm('');
        } else {
            setSelectedRegion(regionId);
            setSelectedCountry(null); 
            setCurrentView('countries');
            setSearchTerm(''); 
        }

        if (regionId && continentLayers.current[regionId]) {
            const currentLayer = continentLayers.current[regionId];
            const currentFeature = worldContinentsGeoJSON.features.find(
                f => getContinentIdFromGeoJSONName(f.properties.CONTINENT) === regionId
            );
            if (currentFeature) {
                currentLayer.setStyle(getFeatureStyle(currentFeature));
                currentLayer.bringToFront(); 
            }
        }
    };

    const handleCountryClick = (countryCode) => {
        console.log(`Country clicked: ${countryCode}`);
        navigate(`/cities/${countryCode}`);
    };

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
            weight: continentId === selectedRegion ? 3 : 1,  
            opacity: 1,
            color: continentConfig.color, 
            fillOpacity: continentId === selectedRegion ? 0.7 : 0.2  
        };
    };

    const onEachFeature = (feature, layer) => {
        const continentNameFromGeoJSON = feature.properties.CONTINENT;
        console.log("Processing GeoJSON feature:", continentNameFromGeoJSON);  
        const continentId = getContinentIdFromGeoJSONName(continentNameFromGeoJSON);
        const continentConfig = getContinentConfigById(continentId);

        if (!continentId || !continentConfig) {
            console.warn(`Could not find configuration or ID for continent: ${continentNameFromGeoJSON}. Event listeners will not be attached.`);
            return;
        }

        continentLayers.current[continentId] = layer;


        layer.on({
            click: () => handleRegionClick(continentId),
            mouseover: (e) => {
                const currentLayer = e.target;
                currentLayer.setStyle({
                    weight: 4,  
                    color: continentConfig.color, 
                    fillColor: continentConfig.color,  
                    dashArray: '',
                    fillOpacity: 0.4  
                });
                currentLayer.bringToFront();
            },
            mouseout: (e) => {
                const currentLayer = e.target;
                currentLayer.setStyle(getFeatureStyle(feature));  
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

            {/* pulsante profilo */}
            <button
            className="profile-button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
            <svg 
                className="profile-button-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
            </svg>
            </button>
            
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
            
            {profileMenuOpen && (
            <div className="profile-menu">
                <button onClick={() => navigate('/profile')}>Profilo</button>
                <button onClick={() => {
                localStorage.removeItem('loggedInUser');
                navigate('/login');
                }}>Logout</button>
            </div>
            )}

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
                                <button
                                    className="clear-country-button"
                                    onClick={() => setSearchTerm('')}> 
                                    <strong>Reset Ricerca Paese</strong>
                                </button>
                                <button
                                    className="clear-selection-button"
                                    onClick={() => handleRegionClick(selectedRegion)}> 
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
                                    onClick={() => handleCountryClick(selectedCountry)}> 
                                    Annulla Selezione Paese
                                </button>
                            </>
                        )}
                    </div>

                    {currentView === 'countries' && filteredCountries.length > 0 ? (
                        <div className="countries-grid"> 
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
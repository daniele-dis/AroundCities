// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // Useremo questo per la registrazione
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const navigate = useNavigate();

    // URL di base per il tuo backend Flask
    const API_BASE_URL = "http://localhost:5025";

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            if (isRegistering) {
                if (password !== confirmPassword) {
                    setError("Le password non corrispondono.");
                    setLoading(false);
                    return;
                }
                if (!email || !password || !username) { // Aggiunto username come campo obbligatorio per la registrazione
                    setError("Per favore, inserisci email, password e nome utente.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/register`, { // Modificato URL a 5025
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Il backend Flask richiede email, password e name per la registrazione
                    body: JSON.stringify({ email, password, name: username }), 
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccessMessage(data.message || "Registrazione avvenuta con successo! Ora puoi accedere.");
                    setIsRegistering(false); // Torna alla modalità login
                    resetForm(); // Pulisci il form
                } else {
                    setError(data.error || "Errore durante la registrazione. Riprova.");
                }

            } else {
                if (!email || !password) {
                    setError("Per favore, inserisci email e password.");
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(`${API_BASE_URL}/login`, { // Modificato URL a 5025
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Il backend Flask restituisce l'utente in data.user
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userEmail', data.user.email); 
                    localStorage.setItem('loggedInUser', data.user.name);
                    setSuccessMessage(data.message || "Accesso avvenuto con successo!");
                    onLogin(data.user.id, data.user.email); // Passiamo userId e email
                    navigate('/map'); // Reindirizza l'utente alla pagina della mappa
                } else {
                    setError(data.error || "Credenziali non valide. Controlla email e password.");
                }
            }
        } catch (err) {
            console.error("Errore di rete o server non raggiungibile:", err);
            setError("Impossibile connettersi al server. Assicurati che il backend sia attivo.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
                <button
                    className="info-button"
                    onClick={() => setShowInfo(true)}
                >
                    <img
                        src={require('../img/info.png')}
                        alt="Info"
                        style={{ width: '30px', height: '30px', display: 'block' }}
                    />
                </button>
            </div>

            {showInfo && (
                <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
                    <div className="info-modal" onClick={e => e.stopPropagation()}>
                        <h3>Come funziona Around Cities?</h3>
                        <p>
                            Around Cities ti permette di tener traccia delle città che hai visitato e dei loro punti di interesse.<br />
                            Registrati, accedi e inizia a esplorare le mappe, aggiungere i tuoi luoghi preferiti per tenerli sempre con te!
                        </p>
                        <button className="auth-button" onClick={() => setShowInfo(false)}>Chiudi</button>
                    </div>
                </div>
            )}

            <div className="main-content-wrapper">
                <header className="hero-header">
                    <h1 className="city-glow-title">Around Cities</h1>
                    <p className="city-subtitle">Dove le strade si incontrano, le storie iniziano.</p>
                </header>

                <div className="auth-container">
                    <h2>{isRegistering ? "Registrati" : "Accedi"}</h2>
                    <img
                        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmdoZHE2bGUydzFqZWJiaHRoajl0NWgxdGVuc2tkbmdtOGVvbmNzbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BRie5xjBZcHhj06NfL/giphy.gif"
                        alt="Auth Animation"
                        className="auth-gif"
                    />
                    <form onSubmit={handleSubmit} className="auth-form">
                        {isRegistering && (
                            <input
                                type="text"
                                placeholder="Nome Utente"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {isRegistering && (
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Conferma Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        )}

                        <div className="show-password-checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="showPasswordCheckbox"
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                            />
                            <span>Mostra Password</span>
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? (isRegistering ? "Registrando..." : "Accedendo...") : (isRegistering ? "Registrati" : "Accedi")}
                        </button>
                    </form>

                    <div className="toggle-auth-mode">
                        {isRegistering ? (
                            <>
                                Hai già un account?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRegistering(false);
                                        resetForm();
                                    }}
                                    disabled={loading}
                                >
                                    Accedi
                                </button>
                            </>
                        ) : (
                            <>
                                Non hai un account?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRegistering(true);
                                        resetForm();
                                    }}
                                    disabled={loading}
                                >
                                    Registrati
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Around Cities. Tutti i diritti riservati.</p>
                <p>Sviluppato da Daniele Di Sarno & Ciro La Rocca</p>
            </footer>
        </>
    );
}
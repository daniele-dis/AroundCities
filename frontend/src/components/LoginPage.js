// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // Useremo questo solo per la registrazione nel frontend
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // Mantengo gli stati originali
    const navigate = useNavigate();

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
                // Logica di registrazione: ora invia al backend Node.js
                if (password !== confirmPassword) {
                    setError("Le password non corrispondono.");
                    setLoading(false);
                    return;
                }
                // Il tuo backend richiede solo email e password per la registrazione.
                // Il campo username nel form è presente, ma non viene inviato al backend.
                // Se vuoi salvare l'username, devi modificare server.js e la tabella 'users'.
                if (!email || !password) {
                    setError("Per favore, inserisci sia l'email che la password.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }), // Inviamo solo email e password al backend
                });

                const data = await response.json(); // Il backend risponde con JSON

                if (response.ok) {
                    setSuccessMessage(data.message || "Registrazione avvenuta con successo! Ora puoi accedere.");
                    setIsRegistering(false); // Torna alla modalità login
                    resetForm(); // Pulisci il form
                } else {
                    setError(data.message || "Errore durante la registrazione. Riprova.");
                }

            } else {
                // Logica di login: ora invia al backend Node.js
                if (!email || !password) {
                    setError("Per favor, inserisci email e password.");
                    setLoading(false);
                    return;
                }
                
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json(); // Il backend risponde con JSON

                if (response.ok) {
                    // Login avvenuto con successo, salva userId e userEmail nel localStorage
                    // per mantenere lo stato di autenticazione nel frontend.
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('userEmail', data.email); // Assicurati che il backend restituisca l'email nel login
                    
                    setSuccessMessage(data.message || "Accesso avvenuto con successo!");
                    onLogin(data.userId, data.email); // Chiamiamo la prop onLogin per aggiornare lo stato di autenticazione nell'App.js
                    navigate('/map'); // Reindirizza l'utente alla pagina della mappa
                } else {
                    setError(data.message || "Credenziali non valide. Controlla email e password.");
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
                            Around Cities ti permette di scoprire, condividere e vivere le storie delle città.<br />
                            Registrati, accedi e inizia a esplorare le mappe, aggiungere i tuoi luoghi preferiti e interagire con altri utenti!
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
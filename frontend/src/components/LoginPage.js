// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const navigate = useNavigate();

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                // Logica di registrazione
                if (password !== confirmPassword) {
                    setError("Le password non corrispondono.");
                    setLoading(false);
                    return;
                }
                if (!username || !email || !password) { // Aggiungi controlli per tutti i campi
                    setError("Per favore, compila tutti i campi per la registrazione.");
                    setLoading(false);
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 1500)); // Simula ritardo API

                // Recupera gli utenti esistenti dal localStorage o inizializza un array vuoto
                const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

                // Controlla se l'email o l'username sono già registrati
                const emailExists = existingUsers.some(user => user.email === email);
                const usernameExists = existingUsers.some(user => user.username === username);

                if (emailExists) {
                    setError("Questa email è già registrata.");
                    setLoading(false);
                    return;
                }
                if (usernameExists) {
                    setError("Questo nome utente è già in uso.");
                    setLoading(false);
                    return;
                }

                // Simula una registrazione di successo
                const newUser = {
                    id: 'user-' + Date.now(),
                    username: username,
                    email: email,
                    password: password // In un'app reale, useresti hashing della password!
                };

                existingUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(existingUsers)); // Salva gli utenti aggiornati

                setIsRegistering(false); // Torna alla modalità login dopo la registrazione
                resetForm(); // Pulisci il form
                setError("Registrazione avvenuta con successo! Ora puoi accedere."); // Messaggio di successo
            } else {
                // Logica di login (quando isRegistering è false)
                if (!email || !password) {
                    setError("Per favore, inserisci email e password.");
                    setLoading(false);
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 1500)); // Simula ritardo API

                const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

                // Cerca l'utente per email
                const foundUser = existingUsers.find(user => user.email === email);

                if (foundUser && foundUser.password === password) { // Verifica credenziali
                    // Login di successo
                    localStorage.setItem('loggedInUser', foundUser.username); // Salva l'username dell'utente trovato
                    onLogin(foundUser); // Passa l'oggetto utente al prop onLogin se lo usi
                    navigate('/map'); // Reindirizza alla mappa dopo il login
                } else {
                    setError("Credenziali non valide. Controlla email e password.");
                }
            }
        } catch (err) {
            console.error("Errore di rete o API simulata:", err);
            setError("Si è verificato un errore. Riprova più tardi.");
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
                        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmdoZHE2bGUydzFqZWJiaHRoajl0NWgxdGVuc2tkbmdtOGVvbmNzbiZlcD1wMV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BRie5xjBZcHhj06NfL/giphy.gif"
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
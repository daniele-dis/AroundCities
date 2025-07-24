// src/components/LoginPage.jsx
import React, { useState } from "react";
// axios non è più necessario per la simulazione con fetch
// import axios from "axios"; 
import '../css/LoginPage.css'; // Importa il CSS dedicato


export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Nuovo stato per il nome utente
  const [confirmPassword, setConfirmPassword] = useState(""); // Nuovo stato per conferma password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Nuovo stato per il caricamento
  const [isRegistering, setIsRegistering] = useState(false); // Stato per alternare login/registrazione
  const [showPassword, setShowPassword] = useState(false); // Nuovo stato per la visibilità della password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Resetta l'errore ad ogni tentativo
    setLoading(true); // Imposta lo stato di caricamento

    try {
      if (isRegistering) {
        // Logica di registrazione simulata
        if (password !== confirmPassword) {
          setError("Le password non corrispondono.");
          setLoading(false);
          return;
        }
        // Simulazione chiamata API di registrazione
        // In una vera applicazione, useresti fetch o axios per chiamare il tuo backend
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula latenza di rete
        
        // Esempio di risposta simulata
        const simulatedResponse = {
          success: true,
          user: { id: 'user-' + Date.now(), username: username, email: email }
        };

        if (simulatedResponse.success) {
          onLogin(simulatedResponse.user);
        } else {
          setError("Errore durante la registrazione. Riprova o cambia email/username.");
        }
      } else {
        // Logica di login simulata
        // Simulazione chiamata API di login
        // In una vera applicazione, useresti fetch o axios per chiamare il tuo backend
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula latenza di rete

        // Esempio di risposta simulata
        const simulatedResponse = {
          success: true,
          user: { id: 'user-' + Date.now(), username: 'UtenteSimulato', email: email }
        };

        if (simulatedResponse.success) {
          onLogin(simulatedResponse.user);
        } else {
          setError("Credenziali non valide.");
        }
      }
    } catch (err) {
      console.error("Errore di rete o API simulata:", err);
      setError("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setLoading(false); // Disattiva lo stato di caricamento
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
    
  return (
    <>

      <img src={require('../img/map.jpg')} alt="Map Background" className="map-background" />
      {/* 🟡 Inizio del nuovo wrapper per il contenuto principale */}
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

            <div className="show-password-checkbox-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="showPasswordCheckbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
                style={{ marginRight: '5px' }}
              />
              <span>Show Password</span>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (isRegistering ? "Registrando..." : "Accedendo...") : (isRegistering ? "Registrati" : "Accedi")}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className="toggle-auth-mode">
            {isRegistering ? (
              <>
                Hai già un account?{" "}
                <button type="button" onClick={() => setIsRegistering(false)} disabled={loading}>
                  Accedi
                </button>
              </>
            ) : (
              <>
                Non hai un account?{" "}
                <button type="button" onClick={() => setIsRegistering(true)} disabled={loading}>
                  Registrati
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 🟡 Fine del nuovo wrapper per il contenuto principale */}

      {/* ✅ Footer spostato all’esterno del main-content-wrapper ma ancora nel componente */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Around Cities. Tutti i diritti riservati.</p>
        <p>Sviluppato da Daniele Di Sarno & Ciro La Rocca</p>
      </footer>
    </>
  );
}
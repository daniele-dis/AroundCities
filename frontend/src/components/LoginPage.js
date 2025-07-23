// src/components/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import '../css/LoginPage.css'; // Importa il CSS dedicato

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Nuovo stato per il nome utente
  const [confirmPassword, setConfirmPassword] = useState(""); // Nuovo stato per conferma password
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Stato per alternare login/registrazione

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Resetta l'errore ad ogni tentativo

    if (isRegistering) {
      // Logica di registrazione
      if (password !== confirmPassword) {
        setError("Le password non corrispondono.");
        return;
      }
      try {
        const res = await axios.post("http://localhost:5050/register", { username, email, password });
        // Se la registrazione ha successo, puoi decidere di loggare l'utente automaticamente
        // o reindirizzarlo alla schermata di login. Per ora, lo logghiamo.
        onLogin(res.data.user);
      } catch (err) {
        console.error("Errore di registrazione:", err);
        setError("Errore durante la registrazione. Riprova o cambia email/username.");
      }
    } else {
      // Logica di login
      try {
        const res = await axios.post("http://localhost:5050/login", { email, password });
        onLogin(res.data.user);
      } catch (err) {
        console.error("Errore di login:", err);
        setError("Credenziali non valide.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? "Registrati" : "Accedi"}</h2>
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Conferma Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit" className="auth-button">
          {isRegistering ? "Registrati" : "Accedi"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <div className="toggle-auth-mode">
        {isRegistering ? (
          <>
            Hai già un account?{" "}
            <button type="button" onClick={() => setIsRegistering(false)}>
              Accedi
            </button>
          </>
        ) : (
          <>
            Non hai un account?{" "}
            <button type="button" onClick={() => setIsRegistering(true)}>
              Registrati
            </button>
          </>
        )}
      </div>
    </div>
  );
}
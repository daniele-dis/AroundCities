import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MapPage from "./components/MapPage";
import CityPage from "./components/CityPage";
import CityDetailPage from "./components/CityDetailPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        {/* Rotta per il Login (pubblica) */}
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />

        {/* Rotte protette che richiedono l'autenticazione */}
        <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
        <Route path="/cities/:countryCode" element={user ? <CityPage /> : <Navigate to="/login" replace />} />
        
        {/* La rotta per i dettagli della città ora è protetta e usa il percorso originale */}
        <Route path="/city/:cityName" element={user ? <CityDetailPage /> : <Navigate to="/login" replace />} />

        {/* La rotta per il profilo ora è protetta */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />

        {/* Rotta di default: reindirizza alla mappa se loggato, al login altrimenti */}
        <Route path="*" element={<Navigate to={user ? "/map" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
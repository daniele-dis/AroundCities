import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MapPage from "./components/MapPage";
import CityPage from "./components/CityPage";

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
        {/*
          Importante: la rotta per la pagina delle città deve essere definita qui,
          prima della rotta catch-all "*", altrimenti non funzionerà.
        */}
        <Route path="/cities/:countryCode" element={user ? <CityPage /> : <Navigate to="/login" replace />} />
        
        {/*
          Questa rotta generica reindirizza l'utente a "/map" o "/login"
          per qualsiasi altro URL non specificato.
        */}
        <Route path="*" element={<Navigate to={user ? "/map" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

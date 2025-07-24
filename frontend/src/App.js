// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MapPage from "./components/MapPage"; // Importa la MapPage

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={user ? "/map" : "/login"} replace />} /> 
      </Routes> 
    </Router>
  );
}

export default App;
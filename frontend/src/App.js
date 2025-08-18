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
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
        <Route path="/cities/:countryCode" element={user ? <CityPage /> : <Navigate to="/login" replace />} />
        <Route path="/city/:cityName" element={<CityDetailPage />} />
        <Route path="*" element={<Navigate to={user ? "/map" : "/login"} replace />} />
                <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;

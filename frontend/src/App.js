import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
//import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
   {/*   <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        /> */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} /> 
      </Routes> 
    </Router>
  );
}

export default App;

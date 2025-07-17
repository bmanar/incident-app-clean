import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import IncidentForm from "./pages/IncidentForm";
import IncidentsList from "./pages/IncidentsList";
import IncidentEdit from "./pages/IncidentEdit";
import IncidentQualify from "./pages/IncidentQualify";
import SourcesAdmin from "./pages/SourcesAdmin";
import UsersAdmin from "./pages/UsersAdmin";
import EntitiesAdmin from "./pages/EntitiesAdmin";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userName")
  );

  // Fonction appelée lors d'un login réussi
  const handleLogin = (user) => {
    localStorage.setItem("userName", user.nom || user.email || "Utilisateur");
    setIsLoggedIn(true);
    // Redirection automatique
    window.location.href = "/";
  };

  // Fonction appelée lors du logout
  const handleLogout = () => {
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <main
          style={{
            flexGrow: 1,
            padding: "30px",
            minHeight: "100vh",
            background: "#f5f7fa",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/ajouter"
              element={isLoggedIn ? <IncidentForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/liste"
              element={
                isLoggedIn ? <IncidentsList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/incident/:id/qualifier"
              element={
                isLoggedIn ? <IncidentQualify /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/incident/:id"
              element={isLoggedIn ? <IncidentEdit /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin-sources"
              element={isLoggedIn ? <SourcesAdmin /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin-utilisateurs"
              element={isLoggedIn ? <UsersAdmin /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin-entites"
              element={
                isLoggedIn ? <EntitiesAdmin /> : <Navigate to="/login" />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log("✅ App.js – Vérification de la session...");
      try {
        const res = await fetch("http://localhost:8080/api/users/me", {
          credentials: "include",
        });

        console.log("✅ Requête /me envoyée");

        if (res.ok) {
          const user = await res.json();
          console.log("✅ Utilisateur connecté :", user);
          setIsLoggedIn(true);
        } else {
          console.warn("⚠️ Requête /me retournée avec status", res.status);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("❌ Erreur vérification session:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("userName", user.nom || user.email || "Utilisateur");
    localStorage.setItem("userId", user.id);
    localStorage.setItem("entite", user.entite?.libelle || "");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  if (loading) return null; // Tu peux mettre un spinner ici

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <main
          style={{
            flexGrow: 1,
            padding: "30px",
            minHeight: "100vh",
            background: "None",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
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

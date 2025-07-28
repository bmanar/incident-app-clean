// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Sidebar from "./components/Sidebar";

// ✅ TOUTES les pages doivent se trouver dans src/pages/
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import IncidentForm from "./pages/IncidentForm";
import IncidentsList from "./pages/IncidentsList";
import IncidentEdit from "./pages/IncidentEdit";
import IncidentQualify from "./pages/IncidentQualify";
import SourcesAdmin from "./pages/SourcesAdmin";
import UsersAdmin from "./pages/UsersAdmin";
import EntitiesAdmin from "./pages/EntitiesAdmin";

function AppContent() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  // Détermine si l’utilisateur est connecté
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    // Charge UNE SEULE FOIS l’utilisateur connecté
    (async () => {
      try {
        const res = await fetch("/api/utilisateurs/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("userName", `${userData.prenom} ${userData.nom}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    localStorage.clear();
    setUser(null);
  };

  if (loading) return null; // ou un loader si vous préférez

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <main style={{ flexGrow: 1, padding: 30 }}>
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/ajouter"
              element={
                isLoggedIn ? <IncidentForm /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/liste"
              element={
                isLoggedIn ? (
                  <IncidentsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/incident/:id/qualifier"
              element={
                isLoggedIn ? (
                  <IncidentQualify />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/incident/:id"
              element={
                isLoggedIn ? <IncidentEdit /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin-sources"
              element={
                isLoggedIn ? <SourcesAdmin /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin-utilisateurs"
              element={
                isLoggedIn ? <UsersAdmin /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin-entites"
              element={
                isLoggedIn ? (
                  <EntitiesAdmin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

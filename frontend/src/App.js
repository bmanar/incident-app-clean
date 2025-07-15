import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import IncidentForm from "./pages/IncidentForm";
import IncidentsList from "./pages/IncidentsList";
import SourcesAdmin from "./pages/SourcesAdmin";
import UsersAdmin from "./pages/UsersAdmin";
import EntiteAdmin from "./pages/EntiteAdmin";
import Login from "./pages/Login";
import { UserProvider, useUser } from "./UserContext";
import IncidentEdit from "./pages/IncidentEdit";

function AppRoutes() {
  const { user, login, logout } = useUser();

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span>
            Bienvenue,{" "}
            <b>
              {user.prenom} {user.nom}
            </b>
          </span>
          <button style={{ marginLeft: 16 }} onClick={logout}>
            Déconnexion
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/ajouter" />} />
          <Route path="/ajouter" element={<IncidentForm />} />
          <Route path="/liste" element={<IncidentsList />} />
          <Route path="/admin-sources" element={<SourcesAdmin />} />
          <Route path="/admin-users" element={<UsersAdmin />} />
          <Route path="/admin-entites" element={<EntiteAdmin />} />
          <Route path="/incident/:id" element={<IncidentEdit />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

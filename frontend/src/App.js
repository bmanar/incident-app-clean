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

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "30px" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/ajouter" />} />
            <Route path="/ajouter" element={<IncidentForm />} />
            <Route path="/liste" element={<IncidentsList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

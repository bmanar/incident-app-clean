import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

export default function IncidentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [sources, setSources] = useState([]);
  const [statuts] = useState([
    "Nouveau",
    "En cours d’analyse",
    "En cours de traitement",
    "Traité",
    "Abandonné",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/incidents/${id}`, {
        credentials: "include",
      }).then((res) => res.json()),
      fetch(`http://localhost:8080/api/sources-incidents`, {
        credentials: "include",
      }).then((res) => res.json()),
    ])
      .then(([inc, srcs]) => {
        setIncident({
          ...inc,
          sourceIncidentId: inc.sourceIncident?.id || "",
          statutIncident: inc.statutIncident || "Nouveau",
        });

        if (Array.isArray(srcs)) {
          setSources(srcs);
        } else {
          console.error("Sources non conformes :", srcs);
          setSources([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!incident) return <div>Incident introuvable</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncident((inc) => ({ ...inc, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const data = {
      description: incident.description,
      prioriteMetier: incident.prioriteMetier,
      sourceIncidentId: incident.sourceIncidentId,
      dateRemontee: incident.dateRemontee,
      montantPertes: incident.montantPertes,
      nombre: incident.nombre,
      periode: incident.periode,
      statutIncident: incident.statutIncident,
    };

    fetch(`http://localhost:8080/api/incidents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error("Erreur réponse serveur :", errText);
          setError("Erreur lors de la modification");
          return;
        }
        navigate("/liste");
      })
      .catch((err) => {
        console.error("Erreur lors de la requête PUT :", err);
        setError("Erreur réseau.");
      });
  };

  return (
    <Box maxWidth={650} mx="auto" mt={5}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Éditer un incident
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            name="description"
            value={incident.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              name="sourceIncidentId"
              value={incident.sourceIncidentId || ""}
              label="Source"
              onChange={handleChange}
            >
              {Array.isArray(sources) &&
                sources.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nom}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="statut-label">Statut</InputLabel>
            <Select
              labelId="statut-label"
              name="statutIncident"
              value={incident.statutIncident || ""}
              label="Statut"
              onChange={handleChange}
            >
              {statuts.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" mb={1}>
                Priorité
              </Typography>
              <RadioGroup
                row
                name="prioriteMetier"
                value={incident.prioriteMetier || ""}
                onChange={handleChange}
              >
                {["P0", "P1", "P2", "P3"].map((p) => (
                  <FormControlLabel
                    key={p}
                    value={p}
                    control={<Radio />}
                    label={p}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <TextField
            label="Date de remontée"
            name="dateRemontee"
            type="date"
            value={incident.dateRemontee || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Montant des pertes"
            name="montantPertes"
            value={incident.montantPertes || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Nombre d'incidents"
              name="nombre"
              value={incident.nombre || ""}
              onChange={handleChange}
              margin="normal"
              type="number"
              sx={{ flex: 1 }}
            />
            <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
              <InputLabel id="periode-label">Période</InputLabel>
              <Select
                labelId="periode-label"
                name="periode"
                value={incident.periode || ""}
                label="Période"
                onChange={handleChange}
              >
                {["Semaine", "Mois", "Trimestre", "An"].map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {error && (
            <Box color="error.main" mt={2}>
              {error}
            </Box>
          )}
          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" type="submit">
              Enregistrer
            </Button>
            <Button onClick={() => navigate("/liste")}>Annuler</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

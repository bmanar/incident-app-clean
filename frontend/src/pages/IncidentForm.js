import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
} from "@mui/material";

const PRIORITIES = ["P0", "P1", "P2", "P3"];
const PERIODS = ["Semaine", "Mois", "Trimestre", "An"];

export default function IncidentForm() {
  const [form, setForm] = useState({
    description: "",
    prioriteMetier: "P2",
    montantPertes: "",
    nombre: "",
    periode: "Mois",
    sourceIncidentId: "",
    dateRemontee: new Date().toISOString().slice(0, 10),
    pieceJointe: null,
    statutIncident: "Nouveau", // Valeur par défaut invisible
  });
  const [sources, setSources] = useState([]);
  const [alert, setAlert] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/sources-incidents")
      .then((res) => res.json())
      .then((data) => setSources(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, pieceJointe: e.target.files[0] }));
    setUploadFileName(e.target.files[0]?.name || "");
  };

  const handleRemoveFile = () => {
    setForm((f) => ({ ...f, pieceJointe: null }));
    setUploadFileName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", form.description);
    formData.append("prioriteMetier", form.prioriteMetier);
    formData.append("montantPertes", form.montantPertes || 0);
    formData.append("nombre", form.nombre || 0);
    formData.append("periode", form.periode);
    formData.append("sourceIncidentId", form.sourceIncidentId);
    formData.append("dateRemontee", form.dateRemontee);
    formData.append("statutIncident", form.statutIncident); // Invisible, envoyé "Nouveau"
    if (form.pieceJointe) {
      formData.append("pieceJointe", form.pieceJointe);
    }

    fetch("http://localhost:8080/api/incidents", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        setAlert("Incident ajouté !");
        setForm({
          description: "",
          prioriteMetier: "P2",
          montantPertes: "",
          nombre: "",
          periode: "Mois",
          sourceIncidentId: "",
          dateRemontee: new Date().toISOString().slice(0, 10),
          pieceJointe: null,
          statutIncident: "Nouveau",
        });
        setUploadFileName("");
        setTimeout(() => setAlert(""), 1800);
      } else {
        setAlert("Erreur lors de l'ajout de l'incident");
      }
    });
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Remontée d’un incident
        </Typography>

        {alert && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {alert}
          </Alert>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={form.description}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <FormLabel id="priorite-radio-group-label">Priorité</FormLabel>
            <RadioGroup
              row
              aria-labelledby="priorite-radio-group-label"
              name="prioriteMetier"
              value={form.prioriteMetier}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <FormControlLabel
                  key={p}
                  value={p}
                  control={<Radio color="primary" />}
                  label={p}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              name="sourceIncidentId"
              value={form.sourceIncidentId}
              label="Source"
              onChange={handleChange}
              required
            >
              <MenuItem value="">Choisir…</MenuItem>
              {sources.map((src) => (
                <MenuItem key={src.id} value={src.id}>
                  {src.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Montant des pertes"
            name="montantPertes"
            type="number"
            fullWidth
            margin="normal"
            value={form.montantPertes}
            onChange={handleChange}
            InputProps={{ endAdornment: <span>€</span> }}
          />
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Nombre d'incidents"
              name="nombre"
              type="number"
              margin="normal"
              value={form.nombre}
              onChange={handleChange}
              sx={{ width: 120 }}
            />
            <FormControl margin="normal" sx={{ minWidth: 130 }}>
              <InputLabel id="periode-label">Période</InputLabel>
              <Select
                labelId="periode-label"
                name="periode"
                value={form.periode}
                label="Période"
                onChange={handleChange}
              >
                {PERIODS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Date de remontée"
            name="dateRemontee"
            type="date"
            fullWidth
            margin="normal"
            value={form.dateRemontee}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Champ fichier PJ */}
          <Box mt={2} mb={2}>
            <Button variant="outlined" component="label">
              {uploadFileName
                ? "Changer la pièce jointe"
                : "Ajouter une pièce jointe"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
            </Button>
            {uploadFileName && (
              <Box component="span" ml={2}>
                {uploadFileName}{" "}
                <Button color="error" onClick={handleRemoveFile} size="small">
                  Supprimer
                </Button>
              </Box>
            )}
          </Box>

          {/* Champ caché pour le statut */}
          <input type="hidden" name="statutIncident" value="Nouveau" />

          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

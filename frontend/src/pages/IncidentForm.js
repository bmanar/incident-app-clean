import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Alert,
  Grid,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import BugReportIcon from "@mui/icons-material/BugReport";

export default function IncidentForm() {
  const [form, setForm] = useState({
    description: "",
    prioriteMetier: "",
    sourceIncidentId: "",
    dateRemontee: "",
    montantPertes: "",
    nombre: "",
    periode: "",
  });

  const [sources, setSources] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/sources-incidents")
      .then((res) => res.json())
      .then((data) => setSources(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        montantPertes: form.montantPertes ? parseFloat(form.montantPertes) : 0,
        nombre: form.nombre ? parseInt(form.nombre) : 0,
        sourceIncident: { id: form.sourceIncidentId },
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSuccess(true);
        setForm({
          description: "",
          prioriteMetier: "",
          sourceIncidentId: "",
          dateRemontee: "",
          montantPertes: "",
          nombre: "",
          periode: "",
        });
        setTimeout(() => setSuccess(false), 2000);
      });
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: 5,
        maxWidth: 650,
        mx: "auto",
        mt: 5,
        borderRadius: 4,
        background: "linear-gradient(120deg,#e3f2fd 70%,#f6f7fb 100%)",
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
          <BugReportIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={700}>
          Remonter un incident
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Incident ajouté avec succès !
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
          required
        />

        <FormLabel component="legend" sx={{ mt: 2 }}>
          Priorité métier
        </FormLabel>
        <RadioGroup
          row
          name="prioriteMetier"
          value={form.prioriteMetier}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="P0"
            control={<Radio color="error" />}
            label="P0"
          />
          <FormControlLabel
            value="P1"
            control={<Radio color="warning" />}
            label="P1"
          />
          <FormControlLabel
            value="P2"
            control={<Radio color="info" />}
            label="P2"
          />
          <FormControlLabel value="P3" control={<Radio />} label="P3" />
        </RadioGroup>

        <FormControl fullWidth margin="normal">
          <InputLabel id="source-incident-label">
            Source de l'incident
          </InputLabel>
          <Select
            labelId="source-incident-label"
            name="sourceIncidentId"
            value={form.sourceIncidentId}
            label="Source de l'incident"
            onChange={handleChange}
            required
          >
            {sources.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date de remontée"
          name="dateRemontee"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.dateRemontee}
          onChange={handleChange}
        />

        <TextField
          label="Montant des pertes financières"
          name="montantPertes"
          type="number"
          fullWidth
          margin="normal"
          value={form.montantPertes}
          onChange={handleChange}
          InputProps={{
            inputProps: { min: 0, step: "0.01" },
            startAdornment: (
              <InputAdornment position="start">
                <EuroIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Bloc fréquence : Nombre d'incidents + Période */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Nombre d'incidents"
              name="nombre"
              type="number"
              fullWidth
              margin="normal"
              value={form.nombre}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="periode-label">Période</InputLabel>
              <Select
                labelId="periode-label"
                name="periode"
                value={form.periode}
                label="Période"
                onChange={handleChange}
                required
              >
                <MenuItem value="Semaine">Semaine</MenuItem>
                <MenuItem value="Mois">Mois</MenuItem>
                <MenuItem value="Trimestre">Trimestre</MenuItem>
                <MenuItem value="An">An</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box textAlign="right" mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Enregistrer
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

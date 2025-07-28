import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

export default function IncidentQualify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [form, setForm] = useState({
    prioriteIt: "",
    dateProposee: "",
    equipeCharge: "",
    contactPropose: "",
    fichier: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/incidents/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setIncident)
      .catch((err) => console.error("Erreur incident :", err));

    fetch(`http://localhost:8080/api/qualification/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((q) => {
        if (q) setForm((f) => ({ ...f, ...q }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur qualification :", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, fichier: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    data.append("prioriteIt", form.prioriteIt || "");
    data.append("dateProposee", form.dateProposee || "");
    data.append("equipeCharge", form.equipeCharge || "");
    data.append("contactPropose", form.contactPropose || "");
    if (form.fichier) {
      data.append("fichier", form.fichier);
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/qualification-incidents/${id}`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errData = await res.text();
        throw new Error("Erreur lors de l'enregistrement : " + errData);
      }
      navigate("/liste");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue : " + err.message);
    }
  };

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

  if (!incident) return <Typography>Incident introuvable</Typography>;

  return (
    <Box maxWidth={700} mx="auto" mt={5}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Qualification de l’incident
        </Typography>

        {/* Résumé de l'incident */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600}>
            Libellé :
          </Typography>
          <Typography>{incident.libelle}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            Description :
          </Typography>
          <Typography>{incident.description}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            Criticité :
          </Typography>
          <Typography>{incident.prioriteMetier}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            Proposition d’évolution :
          </Typography>
          <Typography>{incident.propositionEvolution || "—"}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            Urgence de mise en œuvre :
          </Typography>
          <Typography>{incident.urgenceMep || "—"}</Typography>
        </Box>

        {/* Formulaire de qualification */}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <FormLabel>Priorité IT</FormLabel>
            <RadioGroup
              name="prioriteIt"
              value={form.prioriteIt}
              onChange={handleChange}
              row
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

          <TextField
            label="Date proposée"
            name="dateProposee"
            type="date"
            value={form.dateProposee || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Équipe en charge"
            name="equipeCharge"
            value={form.equipeCharge || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact proposé"
            name="contactPropose"
            value={form.contactPropose || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <InputLabel>Pièce jointe IT</InputLabel>
            <input type="file" onChange={handleFileChange} />
          </Box>
          {error && (
            <Box mt={2} color="error.main">
              {error}
            </Box>
          )}
          <Box mt={4} display="flex" gap={2}>
            <Button variant="contained" type="submit">
              Enregistrer
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowConfirm(true)}
            >
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Confirmation d’annulation */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment annuler la qualification ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Non</Button>
          <Button
            onClick={() => navigate("/liste")}
            color="error"
            variant="contained"
          >
            Oui, annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

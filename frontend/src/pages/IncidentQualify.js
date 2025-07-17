import React, { useEffect, useState } from "react";
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
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

export default function IncidentQualify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [entites, setEntites] = useState([]);
  const [fields, setFields] = useState({
    prioriteIt: "",
    dateProposee: "",
    equipeEnChargeId: "",
    contactPrincipal: "",
    autrePieceJointe: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/incidents/${id}`).then((res) =>
        res.json()
      ),
      fetch("http://localhost:8080/api/entites").then((res) => res.json()),
    ]).then(([inc, ent]) => {
      setIncident(inc);
      setEntites(ent);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFields((f) => ({ ...f, autrePieceJointe: e.target.files[0] }));
    setFileName(e.target.files[0]?.name || "");
  };

  const removeFile = () => {
    setFields((f) => ({ ...f, autrePieceJointe: null }));
    setFileName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("prioriteIt", fields.prioriteIt);
    formData.append("dateProposee", fields.dateProposee);
    formData.append("equipeEnChargeId", fields.equipeEnChargeId);
    formData.append("contactPrincipal", fields.contactPrincipal);
    if (fields.autrePieceJointe) {
      formData.append("autrePieceJointe", fields.autrePieceJointe);
    }

    fetch(`http://localhost:8080/api/incidents/${id}/qualifier`, {
      method: "PUT",
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        setError("Erreur lors de la qualification");
        return;
      }
      navigate("/liste");
    });
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (!incident) return <div>Incident introuvable</div>;

  return (
    <Box maxWidth={700} mx="auto" mt={5}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Qualification de l’incident
        </Typography>
        <Divider sx={{ mb: 2 }}>Informations remontées</Divider>
        <Box mb={3}>
          <Typography>
            <b>Description :</b> {incident.description}
          </Typography>
          <Typography>
            <b>Source :</b> {incident.sourceIncident?.nom}
          </Typography>
          <Typography>
            <b>Date :</b> {incident.dateRemontee}
          </Typography>
          <Typography>
            <b>Priorité métier :</b> {incident.prioriteMetier}
          </Typography>
          <Typography>
            <b>Montant des pertes :</b> {incident.montantPertes}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}>Qualification</Divider>
        <form onSubmit={handleSubmit}>
          <Box mt={2}>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" mb={1}>
                Priorité MOE
              </Typography>
              <RadioGroup
                row
                name="prioriteIt"
                value={fields.prioriteIt}
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
            label="Date proposée"
            name="dateProposee"
            type="date"
            value={fields.dateProposee}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="equipe-label">Equipe en charge</InputLabel>
            <Select
              labelId="equipe-label"
              name="equipeEnChargeId"
              value={fields.equipeEnChargeId}
              label="Equipe en charge"
              onChange={handleChange}
            >
              {entites.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Personne en charge"
            name="contactPrincipal"
            value={fields.contactPrincipal}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {/* Upload autre pièce jointe */}
          <Box mt={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mr: 2 }}
            >
              Ajouter pièce jointe
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
            </Button>
            {fileName && (
              <span>
                <b>{fileName}</b>
                <IconButton onClick={removeFile} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </span>
            )}
          </Box>
          {error && (
            <Box color="error.main" mt={2}>
              {error}
            </Box>
          )}
          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" type="submit">
              Enregistrer la qualification
            </Button>
            <Button onClick={() => navigate("/liste")}>Annuler</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

// src/pages/IncidentForm.js
import React, { useState, useEffect } from "react";
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
  Grid,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReportIcon from "@mui/icons-material/ReportProblem";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BoltIcon from "@mui/icons-material/Bolt";
import InfoIcon from "@mui/icons-material/Info";
import { useUser } from "../context/UserContext";

const TYPES_RISQUE = [
  "Fraude",
  "Risque opérationnel",
  "Risque stratégique",
  "Autre",
];
const CRITICITES = ["Faible", "Moyenne", "Élevée", "Critique"];
const EVOLUTIONS = ["Process", "Informatique", "Autre"];
const URGENCES = ["Immédiate", "Sous 1 mois", "À planifier"];
const STATUTS = ["Nouveau", "En cours", "Résolu", "Clos"];

export default function IncidentForm() {
  const { user } = useUser();
  const [form, setForm] = useState({
    utilisateurId: "",
    nomDeclarant: "",
    serviceEntite: "",
    dateRemontee: new Date().toISOString().slice(0, 10),
    statutIncident: "Nouveau",
    typeRisque: "",
    description: "",
    origineRisque: "",
    volumeConcerne: "",
    criticite: "",
    consequencesPotentielles: "",
    sourceIncidentId: "",
    referenceAudit: "",
    exigenceReglementaire: "",
    propositionEvolution: "",
    urgenceMiseEnOeuvre: "",
    commentairesComplementaires: "",
  });
  const [sources, setSources] = useState([]);
  const [alert, setAlert] = useState("");

  // Préremplir dès que user est disponible
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        utilisateurId: user.id,
        nomDeclarant: `${user.prenom} ${user.nom}`,
        serviceEntite:
          typeof user.entite === "string"
            ? user.entite
            : user.entite?.nom || "",
      }));
    }
  }, [user]);

  // Charger les sources d'incident
  useEffect(() => {
    fetch("/api/sources-incidents", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSources(data);
        else if (Array.isArray(data.sources)) setSources(data.sources);
        else setSources([]);
      })
      .catch((err) => {
        console.error("Erreur chargement sources :", err);
        setSources([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) {
      setAlert("La description est obligatoire.");
      return;
    }
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourceIncident: form.sourceIncidentId
            ? { id: parseInt(form.sourceIncidentId, 10) }
            : null,
        }),
      });
      if (res.ok) {
        setAlert("Incident enregistré avec succès");
      } else {
        const errorData = await res.json();
        setAlert(`Erreur: ${Object.values(errorData).join(", ")}`);
      }
    } catch (err) {
      console.error(err);
      setAlert("Erreur réseau");
    }
  };

  const fixedSelectStyle = { width: 300 };

  const renderSection = (title, fields, icon) => (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderLeft: "5px solid #1976d2",
        backgroundColor: "#f9f9f9",
      }}
      elevation={2}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        {icon && <Box mr={1}>{icon}</Box>} {title}
      </Typography>
      <Grid container spacing={2}>
        {fields}
      </Grid>
    </Paper>
  );

  return (
    <Box maxWidth="lg" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom fontWeight={600} textAlign="center">
        🛡️ Déclaration d'incident – Programme Securisk
      </Typography>

      {alert && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {alert}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="utilisateurId" value={form.utilisateurId} />

        {renderSection(
          "Informations Générales",
          [
            <Grid item xs={12} sm={4} key="nomDeclarant">
              <TextField
                name="nomDeclarant"
                label="Nom du déclarant"
                fullWidth
                value={form.nomDeclarant}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>,
            <Grid item xs={12} sm={4} key="serviceEntite">
              <TextField
                name="serviceEntite"
                label="Service / Entité"
                fullWidth
                value={form.serviceEntite}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <ApartmentIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>,
            <Grid item xs={12} sm={4} key="dateRemontee">
              <TextField
                type="date"
                name="dateRemontee"
                label="Date de la remontée"
                fullWidth
                value={form.dateRemontee}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>,
            <Grid item xs={12} sm={4} key="statutIncident">
              <FormControl sx={fixedSelectStyle} required>
                <InputLabel>Statut de l'incident</InputLabel>
                <Select
                  name="statutIncident"
                  value={form.statutIncident}
                  onChange={handleChange}
                >
                  {STATUTS.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>,
          ],
          <InfoIcon />
        )}

        {renderSection(
          "Description du Risque",
          [
            <Box
              key="ligne-risque"
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              <FormControl sx={{ width: "200px" }}>
                <InputLabel>Type de risque</InputLabel>
                <Select
                  name="typeRisque"
                  value={form.typeRisque}
                  onChange={handleChange}
                >
                  {TYPES_RISQUE.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                multiline
                rows={3}
                name="description"
                label="Description détaillée du risque"
                value={form.description}
                onChange={handleChange}
                required
                sx={{ flexGrow: 1 }}
              />

              <TextField
                name="origineRisque"
                label="Origine du risque"
                value={form.origineRisque}
                onChange={handleChange}
                sx={{ width: "200px" }}
              />
            </Box>,
          ],
          <ReportIcon />
        )}

        {renderSection(
          "Données d’impact",
          [
            <Grid item xs={12} sm={3} key="volumeConcerne">
              <TextField
                name="volumeConcerne"
                label="Volume concerné"
                fullWidth
                value={form.volumeConcerne}
                onChange={handleChange}
              />
            </Grid>,
            <Grid item xs={12} sm={3} key="criticite">
              <FormControl sx={fixedSelectStyle}>
                <InputLabel>Criticité</InputLabel>
                <Select
                  name="criticite"
                  value={form.criticite}
                  onChange={handleChange}
                >
                  {CRITICITES.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>,
            <Grid item xs={12} sm={6} key="consequencesPotentielles">
              <TextField
                name="consequencesPotentielles"
                label="Conséquences potentielles"
                fullWidth
                multiline
                rows={2}
                value={form.consequencesPotentielles}
                onChange={handleChange}
              />
            </Grid>,
          ],
          <WarningIcon />
        )}

        {renderSection(
          "Éléments de Conformité / Audit",
          [
            <Grid item xs={12} sm={4} key="sourceIncidentId">
              <FormControl sx={fixedSelectStyle}>
                <InputLabel>Source de la détection</InputLabel>
                <Select
                  name="sourceIncidentId"
                  value={form.sourceIncidentId}
                  onChange={handleChange}
                >
                  {sources.map((source) => (
                    <MenuItem key={source.id} value={source.id}>
                      {source.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>,
            <Grid item xs={12} sm={4} key="referenceAudit">
              <TextField
                fullWidth
                name="referenceAudit"
                label="Référence audit"
                value={form.referenceAudit}
                onChange={handleChange}
              />
            </Grid>,
            <Grid item xs={12} sm={4} key="exigenceReglementaire">
              <TextField
                fullWidth
                name="exigenceReglementaire"
                label="Exigence réglementaire"
                value={form.exigenceReglementaire}
                onChange={handleChange}
              />
            </Grid>,
          ],
          <VerifiedUserIcon />
        )}

        {renderSection(
          "Actions recommandées",
          [
            <Grid item xs={12} sm={4} key="propositionEvolution">
              <FormControl sx={fixedSelectStyle}>
                <InputLabel>Proposition d'évolution</InputLabel>
                <Select
                  name="propositionEvolution"
                  value={form.propositionEvolution}
                  onChange={handleChange}
                >
                  {EVOLUTIONS.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>,
            <Grid item xs={12} sm={4} key="urgenceMiseEnOeuvre">
              <FormControl sx={fixedSelectStyle}>
                <InputLabel>Urgence mise en œuvre</InputLabel>
                <Select
                  name="urgenceMiseEnOeuvre"
                  value={form.urgenceMiseEnOeuvre}
                  onChange={handleChange}
                >
                  {URGENCES.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>,
            <Grid item xs={12} sm={4} key="commentairesComplementaires">
              <TextField
                fullWidth
                multiline
                rows={2}
                name="commentairesComplementaires"
                label="Commentaires complémentaires"
                value={form.commentairesComplementaires}
                onChange={handleChange}
              />
            </Grid>,
          ],
          <BoltIcon />
        )}

        <Box textAlign="right" mt={2}>
          <Button type="submit" variant="contained" size="large">
            Soumettre l’incident
          </Button>
        </Box>
      </form>
    </Box>
  );
}

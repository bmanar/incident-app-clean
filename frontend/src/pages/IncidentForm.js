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
import InfoIcon from "@mui/icons-material/Info";
import ReportIcon from "@mui/icons-material/ReportProblem";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BoltIcon from "@mui/icons-material/Bolt";
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
    libelle: "",
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
    exigenceReglementaire: false,
    propositionEvolution: "",
    urgenceMiseEnOeuvre: "",
    commentairesComplementaires: "",
  });
  const [sources, setSources] = useState([]);
  const [alert, setAlert] = useState("");
  const [fichierJoint, setFichierJoint] = useState(null);

  // Préremplir dès que user est disponible
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        utilisateurId: user.id,
        nomDeclarant: `${user.prenom} ${user.nom}`,
        serviceEntite: user.entite?.nom || "",
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setFichierJoint(file);
    // TRACE : vérifie le fichier sélectionné
    console.log("Fichier sélectionné :", file?.name || "Aucun");
  };

  const handleRemoveFile = () => setFichierJoint(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 👇 TRACE ICI
    console.log("Fichier à envoyer :", fichierJoint?.name || "Aucun");

    if (!form.description.trim() || !form.libelle.trim()) {
      setAlert("Le libellé et la description sont obligatoires.");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "boolean" ? String(value) : value
        );
      });
      if (fichierJoint) {
        formData.append("fichierJoint", fichierJoint);
      }
      // TRACE : vérifie ce qui va être envoyé
      console.log("Fichier à envoyer :", fichierJoint?.name || "Aucun");
      for (let [k, v] of formData.entries()) {
        console.log(`FormData ${k}:`, v);
      }

      console.log("Fichier à envoyer :", fichierJoint?.name || "Aucun");

      const res = await fetch("http://localhost:8080/api/incidents", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setAlert("Incident enregistré avec succès");
        setFichierJoint(null);
        setForm((prev) => ({
          ...prev,
          description: "",
          libelle: "",
          typeRisque: "",
          origineRisque: "",
          volumeConcerne: "",
          criticite: "",
          consequencesPotentielles: "",
          sourceIncidentId: "",
          referenceAudit: "",
          exigenceReglementaire: false,
          propositionEvolution: "",
          urgenceMiseEnOeuvre: "",
          commentairesComplementaires: "",
        }));
      } else {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setAlert(`Erreur: ${Object.values(json).join(", ")}`);
        } catch (err) {
          setAlert(`Erreur: ${text}`);
        }
      }
    } catch (err) {
      console.error(err);
      setAlert("Erreur réseau");
    }
  };

  // Section Infos Générales : NE PAS MODIFIER
  const infoGeneralesSection = (
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
        <InfoIcon style={{ marginRight: 8 }} /> Informations Générales
      </Typography>

      {/* LIGNE 1 : Libellé */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="libelle"
            label="Libellé de l'incident"
            value={form.libelle}
            onChange={handleChange}
            required
            sx={{ width: "700px" }}
          />
        </Grid>
      </Grid>

      {/* LIGNE 2 : Autres champs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
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
        </Grid>
        <Grid item xs={12} sm={3}>
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
        </Grid>
        <Grid item xs={12} sm={3}>
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
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth required>
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
        </Grid>
      </Grid>
    </Paper>
  );

  // Rendu
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="utilisateurId" value={form.utilisateurId} />

        {infoGeneralesSection}

        {/* Description du Risque */}
        {renderSection(
          "Description du Risque",
          [
            <Grid item xs={12} sm={2} key="typeRisque">
              <FormControl fullWidth>
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
            </Grid>,
            <Grid item xs={12} sm={7} key="description">
              <TextField
                multiline
                rows={3}
                fullWidth
                name="description"
                label="Description détaillée du risque"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Grid>,
            <Grid item xs={12} sm={3} key="origineRisque">
              <TextField
                fullWidth
                name="origineRisque"
                label="Origine du risque"
                value={form.origineRisque}
                onChange={handleChange}
              />
            </Grid>,
          ],
          <ReportIcon />
        )}

        {/* Données d’impact */}
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
              <FormControl fullWidth>
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

        {/* Éléments de Conformité / Audit */}
        {renderSection(
          "Éléments de Conformité / Audit",
          [
            <Grid item xs={12} sm={4} key="sourceIncidentId">
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel shrink>Exigence réglementaire</InputLabel>
                <Select
                  name="exigenceReglementaire"
                  value={form.exigenceReglementaire ? "true" : "false"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exigenceReglementaire: e.target.value === "true",
                    }))
                  }
                  label="Exigence réglementaire"
                >
                  <MenuItem value="false">Non</MenuItem>
                  <MenuItem value="true">Oui</MenuItem>
                </Select>
              </FormControl>
            </Grid>,
          ],
          <VerifiedUserIcon />
        )}

        {/* Actions recommandées */}
        {renderSection(
          "Actions recommandées",
          [
            <Grid item xs={12} sm={4} key="propositionEvolution">
              <FormControl fullWidth>
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
              <FormControl fullWidth>
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

        {/* --- Champ d'upload de fichier (juste avant bouton) --- */}
        <Box mt={3} mb={2}>
          <Button variant="contained" component="label" sx={{ minWidth: 220 }}>
            Joindre un fichier
            <input
              type="file"
              hidden
              name="fichierJoint"
              accept=".pdf,.doc,.docx,.jpg,.png"
              multiple={false} // ← impose un seul fichier
              onChange={handleFileChange}
            />
          </Button>
          {fichierJoint && (
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">{fichierJoint.name}</Typography>
              <Button size="small" color="error" onClick={handleRemoveFile}>
                Retirer
              </Button>
            </Box>
          )}
        </Box>

        <Box textAlign="right" mt={2}>
          <Button type="submit" variant="contained" size="large">
            Soumettre l’incident
          </Button>
        </Box>
      </form>
    </Box>
  );
}

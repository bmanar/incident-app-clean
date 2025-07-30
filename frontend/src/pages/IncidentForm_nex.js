import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Box,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";

const TYPES_RISQUE = ["Technique", "Organisationnel", "Humain"];

const fixedSelectStyle = {
  width: "100%",
};

const IncidentForm = () => {
  const [form, setForm] = useState({
    typeRisque: "",
    description: "",
    origineRisque: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Ajouter ici l’appel API ou autre logique
  };

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
    <form onSubmit={handleSubmit}>
      {renderSection(
        "Description du Risque",
        [
          <Grid item xs={12} sm={2} key="typeRisque">
            <FormControl sx={fixedSelectStyle}>
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
          <Box
            key="description"
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <TextField
              multiline
              rows={3}
              name="description"
              label="Description détaillée du risque"
              value={form.description}
              onChange={handleChange}
              required
              sx={{ width: "800px" }} // ⇦ Change ici si tu veux plus large ou plus étroit
            />
          </Box>,
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

      <Button type="submit" variant="contained" color="primary">
        Enregistrer
      </Button>
    </form>
  );
};

export default IncidentForm;

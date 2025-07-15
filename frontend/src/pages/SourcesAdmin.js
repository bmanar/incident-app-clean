import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function SourcesAdmin() {
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/sources-incidents")
      .then((res) => res.json())
      .then(setSources);
  }, []);

  const handleAdd = () => {
    if (!newSource.trim()) return;
    fetch("http://localhost:8080/api/sources-incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: newSource.trim() }),
    })
      .then((res) => res.json())
      .then((src) => {
        setSources((prev) => [...prev, src]);
        setNewSource("");
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/sources-incidents/${id}`, {
      method: "DELETE",
    }).then(() => {
      setSources((prev) => prev.filter((s) => s.id !== id));
    });
  };

  return (
    <Paper sx={{ maxWidth: 500, mx: "auto", p: 4, mt: 5, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Paramétrage des sources d’incident
      </Typography>
      <Box display="flex" gap={1} mb={2}>
        <TextField
          label="Nouvelle source"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          size="small"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Ajouter
        </Button>
      </Box>
      <List>
        {sources.map((src) => (
          <ListItem key={src.id} divider>
            <ListItemText primary={src.nom} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDelete(src.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

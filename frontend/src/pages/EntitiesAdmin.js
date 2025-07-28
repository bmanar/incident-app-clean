import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EntiteAdmin() {
  const [entites, setEntites] = useState([]);
  const [nom, setNom] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/entites", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ Entités non conformes :", data);
          return;
        }
        setEntites(data);
      })
      .catch((err) => {
        console.error("❌ Erreur lors du chargement des entités :", err);
      });
  }, []);

  const handleAdd = () => {
    if (!nom.trim()) return;
    fetch("http://localhost:8080/api/entites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nom: nom.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((e) => {
        if (!e || !e.id) {
          console.error("❌ Réponse inattendue après ajout :", e);
          return;
        }
        setEntites((prev) => [...prev, e]);
        setNom("");
      })
      .catch((err) => {
        console.error("❌ Erreur lors de l'ajout de l'entité :", err);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette entité ?")) {
      fetch(`http://localhost:8080/api/entites/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur HTTP " + res.status);
          setEntites((prev) => prev.filter((e) => e.id !== id));
        })
        .catch((err) => {
          console.error("❌ Erreur lors de la suppression :", err);
        });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" mb={2}>
          Paramétrage des entités
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Nom de l'entité"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Ajouter
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(entites) &&
                entites.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nom}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(e.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {(!Array.isArray(entites) || entites.length === 0) && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Aucune entité à afficher.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

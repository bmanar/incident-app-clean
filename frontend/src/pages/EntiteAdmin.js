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
    fetch("http://localhost:8080/api/entites")
      .then((res) => res.json())
      .then(setEntites);
  }, []);

  const handleAdd = () => {
    fetch("http://localhost:8080/api/entites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom }),
    })
      .then((res) => res.json())
      .then((e) => {
        setEntites([...entites, e]);
        setNom("");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette entité ?")) {
      fetch(`http://localhost:8080/api/entites/${id}`, {
        method: "DELETE",
      }).then(() => setEntites(entites.filter((e) => e.id !== id)));
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
              {entites.map((e) => (
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
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

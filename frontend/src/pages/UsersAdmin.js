// src/pages/UsersAdmin.js
import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const allRoles = ["Déclarer", "Qualifier", "Administrateur"];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    mail: "",
    entiteId: "",
    password: "",
    passwordConfirm: "",
    roles: [], // <-- maintenant un tableau de strings
  });
  const [entites, setEntites] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/utilisateurs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else console.error("❌ Utilisateurs non conformes :", data);
      });

    fetch("http://localhost:8080/api/entites", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEntites(data);
        else console.error("❌ Entités non conformes :", data);
      });
  }, [open]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setForm((f) => {
      const already = f.roles.includes(role);
      let updated = already
        ? f.roles.filter((r) => r !== role)
        : [...f.roles, role];
      // exclusion mutuelle
      if (!already && role === "Déclarer") {
        updated = updated.filter((r) => r !== "Qualifier");
      } else if (!already && role === "Qualifier") {
        updated = updated.filter((r) => r !== "Déclarer");
      }
      return { ...f, roles: updated };
    });
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditId(user.id);
      setForm({
        nom: user.nom,
        prenom: user.prenom,
        mail: user.mail,
        entiteId: user.entite?.id || "",
        password: "",
        passwordConfirm: "",
        // on stocke désormais un tableau de noms de rôles
        roles: Array.isArray(user.roles) ? user.roles.map((r) => r.nom) : [],
      });
    } else {
      setEditId(null);
      setForm({
        nom: "",
        prenom: "",
        mail: "",
        entiteId: "",
        password: "",
        passwordConfirm: "",
        roles: [],
      });
    }
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = () => {
    if (form.password !== form.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }
    if (!form.nom || !form.prenom || !form.mail || !form.entiteId) {
      setError("Tous les champs sont obligatoires !");
      return;
    }

    // on retransforme en tableau d'objets { nom }
    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      mail: form.mail,
      entiteId: form.entiteId,
      password: form.password,
      roles: form.roles.map((rolename) => ({ nom: rolename })),
    };

    const url = editId
      ? `http://localhost:8080/api/utilisateurs/${editId}`
      : "http://localhost:8080/api/utilisateurs";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.status === 409) {
          const message = await res.text();
          setError(message);
          return;
        }
        if (!res.ok) {
          setError("Erreur lors de l'enregistrement.");
          return;
        }
        return res.json();
      })
      .then((user) => {
        if (!user) return;
        setOpen(false);
        setForm({
          nom: "",
          prenom: "",
          mail: "",
          entiteId: "",
          password: "",
          passwordConfirm: "",
          roles: [],
        });
        setError("");
        setUsers((prev) =>
          editId
            ? prev.map((u) => (u.id === user.id ? user : u))
            : [...prev, user]
        );
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      fetch(`http://localhost:8080/api/utilisateurs/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => setUsers((prev) => prev.filter((u) => u.id !== id)));
    }
  };

  return (
    <Box maxWidth={900} mx="auto" mt={6}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Utilisateurs</Typography>
          <Button variant="contained" onClick={() => handleOpen()}>
            Ajouter
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Entité</TableCell>
                <TableCell>Rôles</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nom}</TableCell>
                  <TableCell>{u.prenom}</TableCell>
                  <TableCell>{u.mail}</TableCell>
                  <TableCell>{u.entite?.nom || ""}</TableCell>
                  <TableCell>
                    {/* on affiche les noms de rôles */}
                    {Array.isArray(u.roles)
                      ? u.roles.map((r) => r.nom).join(", ")
                      : ""}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(u)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(u.id)}
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

      {/* DIALOGUE D’AJOUT/MODIF */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editId ? "Modifier" : "Ajouter"} un utilisateur
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mail"
            name="mail"
            value={form.mail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="entite-label">Entité</InputLabel>
            <Select
              labelId="entite-label"
              name="entiteId"
              value={form.entiteId}
              label="Entité"
              onChange={handleChange}
              required
            >
              {entites.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup row sx={{ mt: 2 }}>
            {allRoles.map((role) => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    checked={form.roles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                  />
                }
                label={role}
              />
            ))}
          </FormGroup>

          {/* Gestion affichage mot de passe */}
          <TextField
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmer le mot de passe"
            name="passwordConfirm"
            type={showPasswordConf ? "text" : "password"}
            value={form.passwordConfirm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPasswordConf((v) => !v)}
                    edge="end"
                  >
                    {showPasswordConf ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Box color="error.main" mt={1} mb={1}>
              {error}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

export default function LoginPage({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Important : Spring Security attend les champs "username" et "password"
    const formData = new URLSearchParams();
    formData.append("username", mail); // même si tu l’appelles "mail" en base
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString(),
      });

      if (res.ok) {
        // Authentification réussie, on vérifie avec /me
        const userRes = await fetch(
          "http://localhost:8080/api/utilisateurs/me",
          {
            credentials: "include",
          }
        );

        if (userRes.ok) {
          const user = await userRes.json();
          localStorage.setItem("user", JSON.stringify(user));
          if (onLogin) onLogin(user);
        } else {
          setError("Échec récupération utilisateur après login");
        }
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f7f9fb",
      }}
    >
      <Card sx={{ minWidth: 350, p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Connexion
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

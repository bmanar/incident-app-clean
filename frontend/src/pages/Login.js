import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const user = await res.json();
    onLogin(user);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 4, minWidth: 350 }}>
        <Typography variant="h6" mb={3}>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Adresse mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {error && (
            <Box color="error.main" my={2}>
              {error}
            </Box>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

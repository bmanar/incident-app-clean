import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#1976d2",
  "#d32f2f",
  "#f57c00",
  "#388e3c",
  "#6d28d9",
  "#757575",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/stats/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <Typography>Chargement...</Typography>;

  return (
    <Box
      sx={{
        p: 3,
        width: "100vw",
        maxWidth: "none",
        minHeight: "100vh",
        bgcolor: "#ffebee",
        mx: "auto",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        Tableau de bord incidents
      </Typography>

      {/* Affichage temporaire de la structure des 12 colonnes */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        {[...Array(12).keys()].map((i) => (
          <Grid
            item
            xs={1}
            key={i}
            sx={{
              border: "2px solid #ff5252",
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              bgcolor: "#fffbe7",
            }}
          >
            {i + 1}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mb={3}>
        {Object.entries(stats.incidentsParStatut).map(
          ([statut, count], idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={statut}
              sx={{
                minWidth: 0,
                border: "2px dashed #1976d2",
                background: "#e3eafe22",
              }}
            >
              <Card
                sx={{ bgcolor: COLORS[idx % COLORS.length], color: "#fff" }}
              >
                <CardContent>
                  <Typography variant="subtitle2">{statut}</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
            minWidth: 0,
            border: "2px dashed #1976d2",
            background: "#e3eafe22",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Montant total des pertes
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {(stats.montantTotalPertes ?? 0).toLocaleString("fr-FR")} €
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 2 tuiles larges par ligne */}
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            minWidth: 0,
            border: "4px solid #ff3333",
            background: "#fffbe7",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", p: 2 }}>
              <Typography variant="subtitle2" mb={2}>
                TEST largeur maximale
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={stats.incidentsParMois}>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {/* Ligne 1 */}
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            minWidth: 0,
            border: "2px dashed #38b000",
            background: "#eaffeb77",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", p: 2 }}>
              <Typography variant="subtitle2" mb={2}>
                Incidents par mois (12 derniers mois)
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={stats.incidentsParMois}>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            minWidth: 0,
            border: "12px  #38b000",
            background: "red",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", p: 4 }}>
              <Typography variant="subtitle2" mb={2}>
                Répartition par statut
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.incidentsParStatut).map(
                      ([k, v]) => ({ name: k, value: v })
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#1976d2"
                    label
                  >
                    {Object.entries(stats.incidentsParStatut).map(
                      (entry, idx) => (
                        <Cell
                          key={entry[0]}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Ligne 2 */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minWidth: 0,
            border: "2px dashed #38b000",
            background: "#eaffeb77",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", p: 2 }}>
              <Typography variant="subtitle2" mb={2}>
                Répartition par priorité
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.incidentsParPriorite).map(
                      ([k, v]) => ({ name: k, value: v })
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#1976d2"
                    label
                  >
                    {Object.entries(stats.incidentsParPriorite).map(
                      (entry, idx) => (
                        <Cell
                          key={entry[0]}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minWidth: 0,
            border: "2px dashed #38b000",
            background: "#eaffeb77",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ width: "100%", p: 2 }}>
              <Typography variant="subtitle2" mb={2}>
                Incidents par source
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(stats.incidentsParSource).map(
                    ([nom, count]) => ({ nom, count })
                  )}
                >
                  <XAxis dataKey="nom" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f57c00" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

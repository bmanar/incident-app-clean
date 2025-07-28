// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Grid, Typography, Paper } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function StatCard({ title, value }) {
  return (
    <Paper elevation={2} style={{ padding: 16, textAlign: "center" }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </Paper>
  );
}

function ChartCard({ title, children }) {
  return (
    <Paper elevation={2} style={{ padding: 16, height: 300 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        {children}
      </ResponsiveContainer>
    </Paper>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => {
        console.error("Erreur récupération dashboard:", err);
        setData(null);
      });
  }, []);

  if (!data) return null;

  const { stats, statusChart, priorityChart, monthlyChart, sourceChart } = data;

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid xs={12} sm={6} md={2}>
          <StatCard title="Non renseignés" value={stats.nonRenseigne} />
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <StatCard title="Qualifiés" value={stats.qualifie} />
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <StatCard title="Nouveaux" value={stats.nouveau} />
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <StatCard title="Traités" value={stats.traite} />
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <StatCard title="Pertes" value={stats.pertes} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <ChartCard title="Répartition par statut">
            <PieChart>
              <Pie
                data={Array.isArray(statusChart) ? statusChart : []}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {statusChart &&
                  statusChart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>
        </Grid>

        <Grid xs={12} md={6}>
          <ChartCard title="Répartition par priorité">
            <PieChart>
              <Pie
                data={Array.isArray(priorityChart) ? priorityChart : []}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {priorityChart &&
                  priorityChart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>
        </Grid>

        <Grid xs={12} md={6}>
          <ChartCard title="Incidents par mois">
            <BarChart
              data={Array.isArray(monthlyChart) ? monthlyChart : []}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ChartCard>
        </Grid>

        <Grid xs={12} md={6}>
          <ChartCard title="Répartition par source">
            <BarChart
              data={Array.isArray(sourceChart) ? sourceChart : []}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#ff5722" />
            </BarChart>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Grid } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Réponse brute du backend :", res);
        const mappedData = {
          nonRenseignes: res.stats?.nonRenseigne ?? 0,
          qualified: res.stats?.qualifie ?? 0,
          nouveaux: res.stats?.nouveau ?? 0,
          traites: res.stats?.traite ?? 0,
          pertes: res.stats?.pertes ?? 0,
          repartitionParStatut: res.statusChart ?? [],
          repartitionParPriorite: res.priorityChart ?? [],
          repartitionParMois: res.monthlyChart ?? [],
          repartitionParSource: res.sourceChart ?? [],
        };
        setData(mappedData);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement du dashboard :", err)
      );

    fetch("http://localhost:8080/api/utilisateurs/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => setUser(res))
      .catch((err) => console.error("Erreur utilisateur :", err));
  }, []);

  if (
    !data ||
    !Array.isArray(data.repartitionParStatut) ||
    !Array.isArray(data.repartitionParPriorite) ||
    !Array.isArray(data.repartitionParMois) ||
    !Array.isArray(data.repartitionParSource)
  ) {
    return <div>Données du dashboard incomplètes ou non valides.</div>;
  }

  const rolesString = Array.isArray(user?.roles)
    ? user.roles.map((r) => r.nom).join(", ")
    : "";

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{ textAlign: "right", marginBottom: "10px", fontWeight: "bold" }}
      >
        {user
          ? `${user.prenom} ${user.nom} (${rolesString})`
          : "Chargement utilisateur..."}
      </div>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item>
          <Card>
            <CardContent>
              <h4>Non renseignés</h4>
              <p>{data.nonRenseignes}</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h4>Qualifiés</h4>
              <p>{data.qualified}</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h4>Nouveaux</h4>
              <p>{data.nouveaux}</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h4>Traités</h4>
              <p>{data.traites}</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h4>Pertes</h4>
              <p>{data.pertes}</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h4>Répartition par statut</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.repartitionParStatut}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {data.repartitionParStatut.map((entry, index) => (
                      <Cell
                        key={`statut-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h4>Répartition par priorité</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.repartitionParPriorite}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {data.repartitionParPriorite.map((entry, index) => (
                      <Cell
                        key={`priorite-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h4>Incidents par mois</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.repartitionParMois}>
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h4>Répartition par source</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.repartitionParSource}>
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF5722" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

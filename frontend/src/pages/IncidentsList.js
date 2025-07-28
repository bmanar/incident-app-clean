import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EuroIcon from "@mui/icons-material/Euro";
import BugReportIcon from "@mui/icons-material/BugReport";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useNavigate } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  if (!Array.isArray(array)) return [];
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const STATUTS = ["Nouveau", "En Cours", "Qualifié", "Traité", "Abandonné"];
const PRIORITES = ["Haute", "Moyenne", "Basse"];

export default function IncidentsList() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterPriorite, setFilterPriorite] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dateRemontee");
  const [isDeclarerOnly, setIsDeclarerOnly] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/utilisateurs/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.roles && Array.isArray(data.roles)) {
          const roleNames = data.roles.map((r) => r.nom);
          setIsDeclarerOnly(
            roleNames.length === 1 && roleNames.includes("Declarer")
          );
        }
      })
      .catch((err) =>
        console.error("Erreur chargement rôle utilisateur :", err)
      );

    fetch("http://localhost:8080/api/incidents", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur incidents : " + res.status);
        return res.json();
      })
      .then((data) => {
        setIncidents(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Erreur chargement incidents :", err));

    fetch("http://localhost:8080/api/sources-incidents", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSources(data))
      .catch((err) => console.error("Erreur chargement sources :", err));
  }, []);

  useEffect(() => {
    let data = incidents;

    if (search.trim() !== "") {
      data = data.filter((i) =>
        (i.description ?? "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterSource !== "") {
      data = data.filter(
        (i) => i.sourceIncident && i.sourceIncident.id === filterSource
      );
    }
    if (filterPriorite !== "") {
      data = data.filter((i) => i.prioriteMetier === filterPriorite);
    }
    if (filterStatut !== "") {
      data = data.filter((i) => i.statutIncident === filterStatut);
    }
    setFiltered(data);
  }, [search, filterSource, filterPriorite, filterStatut, incidents]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet incident ?")) return;
    await fetch(`http://localhost:8080/api/incidents/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setIncidents(incidents.filter((i) => i.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 1400, width: "98vw", mx: "auto", mt: 5, p: 3 }}>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
            <BugReportIcon />
          </Avatar>
          <Typography variant="h4" fontWeight={700}>
            Liste des incidents
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
          {filtered.length} incident{filtered.length > 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Filtres */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Recherche"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl>
          <InputLabel>Source</InputLabel>
          <Select
            value={filterSource}
            label="Source"
            onChange={(e) => setFilterSource(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {sources.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Priorité</InputLabel>
          <Select
            value={filterPriorite}
            label="Priorité"
            onChange={(e) => setFilterPriorite(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {PRIORITES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filterStatut}
            label="Statut"
            onChange={(e) => setFilterStatut(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {STATUTS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#e8edfa" }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dateRemontee"}
                  direction={order}
                  onClick={() => handleRequestSort("dateRemontee")}
                >
                  <b>Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <b>Priorité</b>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>Statut</b>
              </TableCell>
              <TableCell align="right">
                <b>Montant des pertes</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filtered, getComparator(order, orderBy)).map(
              (incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{incident.dateRemontee}</TableCell>
                  <TableCell>{incident.prioriteMetier}</TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>{incident.sourceIncident?.nom}</TableCell>
                  <TableCell>{incident.statutIncident}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <EuroIcon sx={{ fontSize: 15, mr: 0.5 }} />
                      {incident.montantPertes
                        ? incident.montantPertes.toLocaleString("fr-FR")
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="success"
                      onClick={() =>
                        navigate(`/incident/${incident.id}/qualifier`)
                      }
                      title={
                        incident.statutIncident === "Nouveau"
                          ? "Qualifier cet incident"
                          : "La qualification n'est possible que sur un incident Nouveau"
                      }
                      disabled={
                        incident.statutIncident !== "Nouveau" || isDeclarerOnly
                      }
                    >
                      <AssignmentTurnedInIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/incident/${incident.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(incident.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun incident à afficher.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

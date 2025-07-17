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
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const STATUTS = ["Nouveau", "En Cours", "Qualifié", "Traité", "Abandonné"];

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

  useEffect(() => {
    fetch("http://localhost:8080/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setFiltered(data);
      });
    fetch("http://localhost:8080/api/sources-incidents")
      .then((res) => res.json())
      .then((data) => setSources(data));
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
    });
    setIncidents(incidents.filter((i) => i.id !== id));
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        width: "98vw",
        mx: "auto",
        mt: 5,
        p: 3,
        background: "linear-gradient(120deg,#f6f7fb 60%,#e8edfa 100%)",
        borderRadius: 4,
        boxShadow: 3,
        overflowX: "auto",
      }}
    >
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
          {filtered.length} incident{filtered.length > 1 ? "s" : ""} affiché
          {filtered.length > 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Filtres */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Recherche (description)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 220, minWidth: 180 }}
        />

        <FormControl sx={{ width: 180, minWidth: 150 }}>
          <InputLabel id="source-filter-label">Source</InputLabel>
          <Select
            labelId="source-filter-label"
            value={filterSource}
            label="Source"
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            {sources.map((src) => (
              <MenuItem key={src.id} value={src.id}>
                {src.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 110, minWidth: 90 }}>
          <InputLabel id="priorite-filter-label">Priorité</InputLabel>
          <Select
            labelId="priorite-filter-label"
            value={filterPriorite}
            label="Priorité"
            onChange={(e) => setFilterPriorite(e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            {["P0", "P1", "P2", "P3"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 150, minWidth: 120 }}>
          <InputLabel id="statut-filter-label">Statut</InputLabel>
          <Select
            labelId="statut-filter-label"
            value={filterStatut}
            label="Statut"
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {STATUTS.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3, minWidth: 900 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#e8edfa" }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dateRemontee"}
                  direction={orderBy === "dateRemontee" ? order : "asc"}
                  onClick={() => handleRequestSort("dateRemontee")}
                >
                  <b>Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 80, minWidth: 60, maxWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === "prioriteMetier"}
                  direction={orderBy === "prioriteMetier" ? order : "asc"}
                  onClick={() => handleRequestSort("prioriteMetier")}
                >
                  <b>Priorité</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "sourceIncident"}
                  direction={orderBy === "sourceIncident" ? order : "asc"}
                  onClick={() => handleRequestSort("sourceIncident")}
                >
                  <b>Source</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "statutIncident"}
                  direction={orderBy === "statutIncident" ? order : "asc"}
                  onClick={() => handleRequestSort("statutIncident")}
                >
                  <b>Statut</b>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "montantPertes"}
                  direction={orderBy === "montantPertes" ? order : "asc"}
                  onClick={() => handleRequestSort("montantPertes")}
                >
                  <b>Montant des pertes</b>
                </TableSortLabel>
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
                  <TableCell sx={{ width: 80, minWidth: 60, maxWidth: 100 }}>
                    <Chip
                      label={incident.prioriteMetier}
                      size="small"
                      sx={{
                        minWidth: 38,
                        px: 0.5,
                        fontSize: 12,
                        height: 24,
                        bgcolor:
                          incident.prioriteMetier === "P0"
                            ? "#d32f2f"
                            : incident.prioriteMetier === "P1"
                            ? "#f57c00"
                            : incident.prioriteMetier === "P2"
                            ? "#1976d2"
                            : "#757575",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>{incident.sourceIncident?.nom}</TableCell>
                  <TableCell>
                    <Chip
                      label={incident.statutIncident}
                      size="small"
                      sx={{
                        minWidth: 78,
                        px: 1,
                        fontSize: 12,
                        height: 24,
                        bgcolor:
                          incident.statutIncident === "Traité"
                            ? "#388e3c"
                            : incident.statutIncident === "En Cours"
                            ? "#ffa000"
                            : incident.statutIncident === "Nouveau"
                            ? "#1976d2"
                            : incident.statutIncident === "Qualifié"
                            ? "#6d28d9"
                            : incident.statutIncident === "Abandonné"
                            ? "#757575"
                            : "#bdbdbd",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
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
                      disabled={incident.statutIncident !== "Nouveau"}
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

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
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import BugReportIcon from "@mui/icons-material/BugReport";
import SearchIcon from "@mui/icons-material/Search";

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

export default function IncidentsList() {
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterPriorite, setFilterPriorite] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

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
    setFiltered(data);
  }, [search, filterSource, filterPriorite, incidents]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Pour affichage Source lisible
  const getSourceLabel = (incident) => {
    if (!incident.sourceIncident) return "";
    const src = sources.find((s) => s.id === incident.sourceIncident.id);
    return src ? src.nom : "";
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 5,
        p: 3,
        background: "linear-gradient(120deg,#f6f7fb 60%,#e8edfa 100%)",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
          <BugReportIcon />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Liste des incidents
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

        <FormControl sx={{ width: 150, minWidth: 120 }}>
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
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#e8edfa" }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                >
                  <b>ID</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dateRemontee"}
                  direction={orderBy === "dateRemontee" ? order : "asc"}
                  onClick={() => handleRequestSort("dateRemontee")}
                >
                  <b>Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "prioriteMetier"}
                  direction={orderBy === "prioriteMetier" ? order : "asc"}
                  onClick={() => handleRequestSort("prioriteMetier")}
                >
                  <b>Priorité</b>
                </TableSortLabel>
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
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "montantPertes"}
                  direction={orderBy === "montantPertes" ? order : "asc"}
                  onClick={() => handleRequestSort("montantPertes")}
                >
                  <b>Montant des pertes</b>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filtered, getComparator(order, orderBy)).map(
              (incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{incident.id}</TableCell>
                  <TableCell>{incident.dateRemontee}</TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>
                    <b>{incident.prioriteMetier}</b>
                  </TableCell>
                  <TableCell>{getSourceLabel(incident)}</TableCell>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <EuroIcon sx={{ fontSize: 18, mr: 1 }} />
                      <Typography>{incident.montantPertes}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

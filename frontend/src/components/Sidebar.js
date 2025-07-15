import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import BugReportIcon from "@mui/icons-material/BugReport";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SourceIcon from "@mui/icons-material/Source";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "../UserContext";
import { useState } from "react";

const drawerWidth = 250;

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useUser();

  // Pour le menu "Paramètres"
  const [openParams, setOpenParams] = useState(true);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#f6f7fb",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Titre et nom utilisateur */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: "#e8edfa",
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 36, color: "#1976d2" }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#888" }}>
              Connecté
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {user ? `${user.prenom} ${user.nom}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Menu principal */}
        <List sx={{ flexGrow: 1 }}>
          <ListItem
            button
            component={Link}
            to="/ajouter"
            selected={location.pathname === "/ajouter"}
          >
            <ListItemIcon>
              <AddCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Nouvel incident" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/liste"
            selected={location.pathname === "/liste"}
          >
            <ListItemIcon>
              <ListAltIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Liste des incidents" />
          </ListItem>
          <Divider sx={{ my: 1 }} />

          {/* Menu Paramètres */}
          <ListItem button onClick={() => setOpenParams((o) => !o)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Paramètres" />
            {openParams ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openParams} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/admin-sources"
                selected={location.pathname === "/admin-sources"}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <SourceIcon />
                </ListItemIcon>
                <ListItemText primary="Sources d'incident" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/admin-entites"
                selected={location.pathname === "/admin-entites"}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Entités" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/admin-users"
                selected={location.pathname === "/admin-users"}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItem>
            </List>
          </Collapse>
        </List>

        {/* Bouton Déconnexion tout en bas */}
        <Box sx={{ p: 2, mt: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={logout}
            startIcon={<AccountCircleIcon />}
          >
            Déconnexion
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

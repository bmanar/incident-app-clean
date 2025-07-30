// src/components/Sidebar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SourceIcon from "@mui/icons-material/Source";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../context/UserContext";

const drawerWidth = 240;

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // on ne travaille que sur les noms de rôles
  const roleNames = Array.isArray(user?.roles)
    ? user.roles.map((r) => r.nom)
    : [];
  const [openSettings, setOpenSettings] = useState(false);

  const isDeclarer = roleNames.includes("Declarer");
  const isQualifier = roleNames.includes("Qualifier");
  const isAdmin = roleNames.includes("Administrateur");

  const handleSettingsClick = () => setOpenSettings(!openSettings);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "#e8edfa",
        }}
      >
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            Gestion Incidents
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Bonjour, {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={
                location.pathname === "/" || location.pathname === "/dashboard"
              }
              onClick={() => navigate("/")}
            >
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItemButton>
          </ListItem>

          {/* Remontée */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/ajouter"}
              onClick={() => navigate("/ajouter")}
              disabled={isQualifier && !isAdmin}
            >
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Remontée" />
            </ListItemButton>
          </ListItem>

          {/* Liste */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/liste"}
              onClick={() => navigate("/liste")}
            >
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Liste" />
            </ListItemButton>
          </ListItem>

          {/* Paramètres */}
          {(isAdmin || isQualifier) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Paramètres" />
                  {openSettings ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openSettings} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={location.pathname === "/admin-sources"}
                    onClick={() => navigate("/admin-sources")}
                  >
                    <ListItemIcon>
                      <SourceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sources d'incident" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={location.pathname === "/admin-utilisateurs"}
                    onClick={() => navigate("/admin-utilisateurs")}
                  >
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Utilisateurs" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    selected={location.pathname === "/admin-entites"}
                    onClick={() => navigate("/admin-entites")}
                  >
                    <ListItemIcon>
                      <ApartmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Entités" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}

          {/* Logout */}
          <Box sx={{ flexGrow: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

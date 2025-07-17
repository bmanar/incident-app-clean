import React, { useContext } from "react";
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
import { useState } from "react";

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSettings, setOpenSettings] = useState(false);

  // Exemple d'affichage du nom utilisateur connecté (si stocké en localStorage)
  const userName = localStorage.getItem("userName") || "Utilisateur";

  const handleSettingsClick = () => {
    setOpenSettings(!openSettings);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
            Bonjour, {userName}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <List>
          {/* Accueil */}
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

          {/* Saisie d'incident */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/ajouter"}
              onClick={() => navigate("/ajouter")}
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

          {/* Paramètres avec sous-menu */}
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

          {/* Logout en bas */}
          <Box sx={{ flexGrow: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
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

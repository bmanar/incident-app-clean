import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    text: "Remonter un incident",
    icon: <AddCircleOutlineIcon />,
    path: "/ajouter",
  },
  { text: "Liste des incidents", icon: <ListAltIcon />, path: "/liste" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          background: "linear-gradient(135deg,#1976d2 80%,#90caf9 100%)",
          color: "#fff",
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" py={3}>
        <Avatar
          sx={{ bgcolor: "#fff", color: "#1976d2", width: 56, height: 56 }}
        >
          <BugReportIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
          IncidentsApp
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: "#fff", opacity: 0.2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 1,
              bgcolor: location.pathname === item.path ? "#1565c0" : "inherit",
              "&:hover": { bgcolor: "#1976d2", color: "#fff" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

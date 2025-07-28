// src/main/java/com/example/backend/controller/IncidentController.java
package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.model.Utilisateur;
import com.example.backend.repository.IncidentRepository;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.service.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        Long currentUserId = currentUserService.getCurrentUserId();
        Utilisateur utilisateur = utilisateurRepository
            .findById(currentUserId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        // On renseigne automatiquement l'utilisateur, son nom et son service/entité
        incident.setUtilisateur(utilisateur);
        incident.setNomDeclarant(utilisateur.getPrenom() + " " + utilisateur.getNom());
        if (utilisateur.getEntite() != null) {
            // on prend le libellé de l'entité pour le champ serviceEntite
            incident.setServiceEntite(utilisateur.getEntite().getNom());
        }

        incident.setDateDeclaration(LocalDate.now());
        return incidentRepository.save(incident);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @RequestBody Incident updatedIncident) {
        // On réaffecte l'id pour un save() en mode update
        updatedIncident.setId(id);
        return incidentRepository.save(updatedIncident);
    }

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentRepository.findById(id).orElse(null);
    }
}
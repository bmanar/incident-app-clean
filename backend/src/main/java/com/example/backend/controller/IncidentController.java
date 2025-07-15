package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.model.SourceIncident;
import com.example.backend.repository.IncidentRepository;
import com.example.backend.repository.SourceIncidentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private SourceIncidentRepository sourceRepo;

    // --- AJOUT d'un incident ---
    @PostMapping(consumes = {"multipart/form-data"})
    public Incident createIncident(
        @RequestParam("description") String description,
        @RequestParam("prioriteMetier") String prioriteMetier,
        @RequestParam("sourceIncidentId") Long sourceIncidentId,
        @RequestParam("dateRemontee") String dateRemontee,
        @RequestParam("statutIncident") String statutIncident,
        @RequestParam(value = "montantPertes", required = false) Double montantPertes,
        @RequestParam(value = "nombre", required = false) Integer nombre,
        @RequestParam(value = "periode", required = false) String periode,
        @RequestPart(value = "pieceJointe", required = false) MultipartFile pieceJointe
    ) throws Exception {
        Incident incident = new Incident();
        incident.setDescription(description);
        incident.setPrioriteMetier(prioriteMetier);
        incident.setDateRemontee(LocalDate.parse(dateRemontee));
        incident.setStatutIncident(statutIncident);

        incident.setMontantPertes(montantPertes);
        incident.setNombre(nombre);
        incident.setPeriode(periode);

        // Source
        SourceIncident src = sourceRepo.findById(sourceIncidentId)
            .orElseThrow(() -> new IllegalArgumentException("Source non trouvée id=" + sourceIncidentId));
        incident.setSourceIncident(src);

        // Gestion du fichier
        if (pieceJointe != null && !pieceJointe.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + pieceJointe.getOriginalFilename();
            Path target = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(target.getParent());
            pieceJointe.transferTo(target.toFile());
            incident.setPieceJointe(fileName);
        }

        return incidentRepository.save(incident);
    }

    // --- Liste tous les incidents ---
    @GetMapping
    public List<Incident> getAll() {
        return incidentRepository.findAll();
    }

    // --- Récupère un incident par ID ---
    @GetMapping("/{id}")
    public Incident getIncident(@PathVariable Long id) {
        return incidentRepository.findById(id).orElseThrow(() -> new RuntimeException("Incident non trouvé"));
    }

    // --- MODIFICATION d'un incident ---
    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @RequestBody Incident updated) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Incident non trouvé"));

        incident.setDescription(updated.getDescription());
        incident.setPrioriteMetier(updated.getPrioriteMetier());
        incident.setMontantPertes(updated.getMontantPertes());
        incident.setNombre(updated.getNombre());
        incident.setPeriode(updated.getPeriode());
        incident.setStatutIncident(updated.getStatutIncident());
        // ...ajoute d'autres champs si besoin

        return incidentRepository.save(incident);
    }

    // --- SUPPRESSION d'un incident ---
    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentRepository.deleteById(id);
    }

    // --- Téléchargement PJ ---
    @GetMapping("/piece-jointe/{filename:.+}")
    public ResponseEntity<Resource> download(@PathVariable String filename) throws Exception {
        Path file = Paths.get("uploads").resolve(filename);
        Resource res = new UrlResource(file.toUri());
        if (!res.exists()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getFilename() + "\"")
            .body(res);
    }

    @GetMapping("/{id}")
public ResponseEntity<Incident> getById(@PathVariable Long id) {
    return incidentRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}
}
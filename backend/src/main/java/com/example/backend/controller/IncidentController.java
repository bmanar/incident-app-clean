package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.model.SourceIncident;
import com.example.backend.model.EquipeEnCharge;
import com.example.backend.repository.IncidentRepository;
import com.example.backend.repository.SourceIncidentRepository;
import com.example.backend.repository.EquipeEnChargeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;
    @Autowired
    private SourceIncidentRepository sourceRepo;
    @Autowired
    private EquipeEnChargeRepository equipeRepo;

    

    // Liste incidents
    @GetMapping
    public List<Incident> getAll() {
        return incidentRepository.findAll();
    }

    // Récupérer par ID (pour édition/qualification)
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getById(@PathVariable Long id) {
        return incidentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Création d’incident (remontée)
    @PostMapping(consumes = {"multipart/form-data"})
    public Incident createIncident(
            @RequestParam("description") String description,
            @RequestParam("prioriteMetier") String prioriteMetier,
            @RequestParam("sourceIncidentId") Long sourceIncidentId,
            @RequestParam("dateRemontee") String dateRemontee,
            @RequestParam("montantPertes") Double montantPertes,
            @RequestParam("nombre") Integer nombre,
            @RequestParam("periode") String periode,
            @RequestPart(value = "pieceJointe", required = false) MultipartFile pieceJointe
    ) throws Exception {
        Incident incident = new Incident();
        incident.setDescription(description);
        incident.setPrioriteMetier(prioriteMetier);
        incident.setDateRemontee(LocalDate.parse(dateRemontee));
        incident.setMontantPertes(montantPertes);
        incident.setNombre(nombre);
        incident.setPeriode(periode);
        incident.setStatutIncident("Nouveau"); // Par défaut

        // Source de l’incident
        SourceIncident src = sourceRepo.findById(sourceIncidentId)
                .orElseThrow(() -> new IllegalArgumentException("Source non trouvée id=" + sourceIncidentId));
        incident.setSourceIncident(src);

        // Gestion du fichier (PJ remontée)
        if (pieceJointe != null && !pieceJointe.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + pieceJointe.getOriginalFilename();
            Path target = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(target.getParent());
            pieceJointe.transferTo(target.toFile());
            incident.setPieceJointe(fileName);
        }

        return incidentRepository.save(incident);
    }

    // Télécharger une pièce jointe
    @GetMapping("/piece-jointe/{filename:.+}")
    public ResponseEntity<Resource> download(@PathVariable String filename) throws Exception {
        Path file = Paths.get("uploads").resolve(filename);
        Resource res = new UrlResource(file.toUri());
        if (!res.exists()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(res);
    }

    // Supprimer un incident
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncident(@PathVariable Long id) {
        if (!incidentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        incidentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Édition d’un incident (MAJ principale)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncident(
            @PathVariable Long id,
            @RequestBody Incident incidentUpdate
    ) {
        return incidentRepository.findById(id).map(incident -> {
            incident.setDescription(incidentUpdate.getDescription());
            incident.setPrioriteMetier(incidentUpdate.getPrioriteMetier());
            incident.setDateRemontee(incidentUpdate.getDateRemontee());
            incident.setMontantPertes(incidentUpdate.getMontantPertes());
            incident.setNombre(incidentUpdate.getNombre());
            incident.setPeriode(incidentUpdate.getPeriode());
            incident.setStatutIncident(incidentUpdate.getStatutIncident());

            // Source de l’incident (si modifiée)
            if (incidentUpdate.getSourceIncident() != null) {
                Long srcId = incidentUpdate.getSourceIncident().getId();
                SourceIncident src = sourceRepo.findById(srcId)
                        .orElseThrow(() -> new IllegalArgumentException("Source non trouvée id=" + srcId));
                incident.setSourceIncident(src);
            }

            incidentRepository.save(incident);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Qualification de l’incident (PUT multipart)
    @PutMapping(value = "/{id}/qualifier", consumes = {"multipart/form-data"})
    public ResponseEntity<?> qualifierIncident(
            @PathVariable Long id,
            @RequestParam("prioriteIt") String prioriteIt,
            @RequestParam("dateProposee") String dateProposee,
            @RequestParam("equipeEnChargeId") Long equipeEnChargeId,
            @RequestParam("contactPrincipal") String contactPrincipal,
            @RequestPart(value = "autrePieceJointe", required = false) MultipartFile autrePieceJointe
    ) throws Exception {
        var incidentOpt = incidentRepository.findById(id);
        if (incidentOpt.isEmpty()) return ResponseEntity.notFound().build();

        Incident incident = incidentOpt.get();
        incident.setPrioriteIt(prioriteIt);
        incident.setDateProposee(LocalDate.parse(dateProposee));
        incident.setContactPrincipal(contactPrincipal);

        // Récupération et MAJ équipe
        equipeRepo.findById(equipeEnChargeId)
            .ifPresent(incident::setEquipeEnCharge);

        // Gérer l’upload de pièce jointe de qualification
        if (autrePieceJointe != null && !autrePieceJointe.isEmpty()) {
            String fileName = "qualif_" + System.currentTimeMillis() + "_" + autrePieceJointe.getOriginalFilename();
            Path target = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(target.getParent());
            autrePieceJointe.transferTo(target.toFile());
            incident.setPieceJointeQualification(fileName); // --> Ajoute ce champ dans Incident.java
        }
    // 👇 Change le statut
    incident.setStatutIncident("Qualifié");
        incidentRepository.save(incident);
        return ResponseEntity.ok().build();
    }

}
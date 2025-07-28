package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.model.QualificationIncident;
import com.example.backend.repository.IncidentRepository;
import com.example.backend.repository.QualificationIncidentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/qualification-incidents")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class QualificationIncidentController {

    @Autowired
    private QualificationIncidentRepository qualificationIncidentRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @PostMapping("/{incidentId}")
    public QualificationIncident qualifyIncident(
            @PathVariable Long incidentId,
            @RequestParam("prioriteIt") String prioriteIt,
            @RequestParam("dateProposee") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateProposee,
            @RequestParam("equipeCharge") String equipeCharge,
            @RequestParam("contactPropose") String contactPropose,
            @RequestParam(value = "fichier", required = false) MultipartFile fichier
    ) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident non trouvé avec l'ID : " + incidentId));

        QualificationIncident qualification = new QualificationIncident();
        qualification.setIncident(incident);
        qualification.setPrioriteIt(prioriteIt);
        qualification.setDateProposee(dateProposee);
        qualification.setEquipeEnCharge(equipeCharge);
        qualification.setContactPropose(contactPropose);

        if (fichier != null && !fichier.isEmpty()) {
            qualification.setFichierJoint(fichier.getOriginalFilename());
            // Vous pouvez ajouter ici une logique pour sauvegarder le fichier si nécessaire
        }

        // Mise à jour du lien Incident → Qualification
        incident.setQualification(qualification);
        incident.setStatutIncident("Qualifié");

        incidentRepository.save(incident);
        return qualification;
    }

    @GetMapping
    public List<QualificationIncident> getAllQualifications() {
        return qualificationIncidentRepository.findAll();
    }

    @GetMapping("/{id}")
    public QualificationIncident getQualificationById(@PathVariable Long id) {
        return qualificationIncidentRepository.findById(id).orElse(null);
    }
}
package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.model.PieceJointe;
import com.example.backend.model.Utilisateur;
import com.example.backend.repository.IncidentRepository;
import com.example.backend.repository.PieceJointeRepository;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private PieceJointeRepository pieceJointeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @PostMapping(consumes = {"multipart/form-data"})
    public Incident createIncident(
            @RequestPart("libelle") String libelle,
            @RequestPart("description") String description,
            @RequestPart("nomDeclarant") String nomDeclarant,
            @RequestPart("serviceEntite") String serviceEntite,
            @RequestPart("dateRemontee") String dateRemontee,
            @RequestPart("statutIncident") String statutIncident,
            @RequestPart("typeRisque") String typeRisque,
            @RequestPart(value = "origineRisque", required = false) String origineRisque,
            @RequestPart(value = "volumeConcerne", required = false) String volumeConcerne,
            @RequestPart(value = "criticite", required = false) String criticite,
            @RequestPart(value = "consequencesPotentielles", required = false) String consequencesPotentielles,
            @RequestPart(value = "sourceIncidentId", required = false) String sourceIncidentId,
            @RequestPart(value = "referenceAudit", required = false) String referenceAudit,
            @RequestPart(value = "exigenceReglementaire", required = false) String exigenceReglementaire,
            @RequestPart(value = "propositionEvolution", required = false) String propositionEvolution,
            @RequestPart(value = "urgenceMiseEnOeuvre", required = false) String urgenceMiseEnOeuvre,
            @RequestPart(value = "commentairesComplementaires", required = false) String commentairesComplementaires,
            @RequestPart(value = "fichierJoint", required = false) MultipartFile fichierJoint,
            HttpServletRequest request
    ) {
            // 👇 Cette ligne affiche dans la console que le contrôleur est bien déclenché
            System.out.println(">>> Contrôleur createIncident() chargé !");
        logger.info(">>> Réception de la requête POST /api/incidents");
        if (fichierJoint != null) {
            logger.info("Fichier reçu Manar : {}", fichierJoint.getOriginalFilename());
        } else {
            logger.info("Aucun fichier joint Manar.");
        }
        logger.info("Libellé: {}", libelle);
        logger.info("Description: {}", description);
        logger.info("Nom déclarant: {}", nomDeclarant);
        logger.info("Service/Entité: {}", serviceEntite);   
        logger.info("Date de remontée: {}", dateRemontee);
        logger.info("Statut incident: {}", statutIncident);
        logger.info("Type de risque: {}", typeRisque);
        logger.info("Origine du risque: {}", origineRisque);
        logger.info("Volume concerné: {}", volumeConcerne);
        logger.info("Criticité: {}", criticite);
        logger.info("Conséquences potentielles: {}", consequencesPotentielles);
        logger.info("Source incident ID: {}", sourceIncidentId);
        logger.info("Référence audit: {}", referenceAudit);
        logger.info("Exigence réglementaire: {}", exigenceReglementaire);
        logger.info("Proposition d’évolution: {}", propositionEvolution);
        logger.info("Urgence mise en œuvre: {}", urgenceMiseEnOeuvre);
        logger.info("Commentaires complémentaires: {}", commentairesComplementaires);

        Incident incident = new Incident();
        incident.setLibelle(libelle);
        incident.setDescription(description);
        incident.setNomDeclarant(nomDeclarant);
        incident.setServiceEntite(serviceEntite);
        incident.setStatutIncident(statutIncident);
        incident.setTypeRisque(typeRisque);
        incident.setOrigineRisque(origineRisque);
        incident.setVolumeConcerne(volumeConcerne);
        incident.setCriticite(criticite);
        incident.setConsequencesPotentielles(consequencesPotentielles);
        incident.setReferenceAudit(referenceAudit);
        incident.setPropositionEvolution(propositionEvolution);
        incident.setUrgenceMiseEnOeuvre(urgenceMiseEnOeuvre);
        incident.setCommentairesComplementaires(commentairesComplementaires);

        incident.setExigenceReglementaire(
                exigenceReglementaire != null && exigenceReglementaire.equals("true")
        );

        Long userId = currentUserService.getCurrentUserId();
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        incident.setUtilisateur(utilisateur);
        incident.setDateDeclaration(LocalDate.now());

        Incident saved = incidentRepository.save(incident);

        if (fichierJoint != null) {
            logger.info(">>> fichierJoint reçu : nom = {}, taille = {} octets",
                    fichierJoint.getOriginalFilename(),
                    fichierJoint.getSize());
        
            if (!fichierJoint.isEmpty()) {
                String uploadDir = "uploads";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();
        
                String filename = System.currentTimeMillis() + "_" + fichierJoint.getOriginalFilename();
                File dest = new File(dir, filename);
        
                try {
                    fichierJoint.transferTo(dest);
                    PieceJointe pj = new PieceJointe();
                    pj.setIncident(saved);
                    pj.setNomFichier(filename);
                    pj.setUrlOuPath(dest.getAbsolutePath());
                    pieceJointeRepository.save(pj);
                    logger.info(">>> Fichier joint enregistré avec succès à : {}", dest.getAbsolutePath());
                } catch (IOException e) {
                    logger.error(">>> Erreur lors du transfert du fichier joint", e);
                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Erreur lors de l’enregistrement du fichier joint",
                            e
                    );
                }
            } else {
                logger.warn(">>> fichierJoint est vide.");
            }
        } else {
            logger.info(">>> Aucun fichier joint fourni dans la requête.");
        }

        return saved;
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @RequestBody Incident updatedIncident) {
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
    @GetMapping
    public List<Incident> getAllIncidents() {
        logger.info(">>> GET /api/incidents déclenché : récupération de tous les incidents.");
        try {
            return incidentRepository.findAll();
        } catch (Exception e) {
            logger.error(">>> Erreur lors de la récupération des incidents :", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors du chargement des incidents");
        }
    }
    
}
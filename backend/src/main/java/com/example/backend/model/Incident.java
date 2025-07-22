package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Utilisateur utilisateur;

    @ManyToOne
    private EquipeEnCharge equipeEnCharge;

    @ManyToMany
    @JoinTable(
        name = "incident_risque",
        joinColumns = @JoinColumn(name = "incident_id"),
        inverseJoinColumns = @JoinColumn(name = "risque_id"))
    private Set<Risque> risques;

    @NotNull
    private LocalDate dateRemontee;

    @ManyToOne
    private SourceIncident sourceIncident;

    private String statutIncident;

    @NotBlank
    private String description;

    private String prioriteMetier;
    private Double montantPertes;
    private Integer nombre;
    private String periode;
    private String prioriteIt;
    private LocalDate dateProposee;
    private String contactPrincipal;

    // — Champs ajoutés et validés —
    @NotBlank @Size(max = 255)
    private String nomDeclarant;

    @NotBlank @Size(max = 255)
    private String serviceEntite;

    @NotBlank @Size(max = 255)
    private String typeRisque;

    @Size(max = 255)
    private String origineRisque;

    @Size(max = 255)
    private String volumeConcerne;

    @NotBlank @Size(max = 255)
    private String criticite;

    @Size(max = 1000)
    private String consequencesPotentielles;

    @Size(max = 255)
    private String referenceAudit;

    @Size(max = 255)
    private String exigenceReglementaire;

    @NotBlank @Size(max = 255)
    private String propositionEvolution;

    @NotBlank @Size(max = 255)
    private String urgenceMiseEnOeuvre;

    @Size(max = 2000)
    private String commentairesComplementaires;

    // — Getters & Setters —

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public EquipeEnCharge getEquipeEnCharge() {
        return equipeEnCharge;
    }
    public void setEquipeEnCharge(EquipeEnCharge equipeEnCharge) {
        this.equipeEnCharge = equipeEnCharge;
    }

    public Set<Risque> getRisques() {
        return risques;
    }
    public void setRisques(Set<Risque> risques) {
        this.risques = risques;
    }

    public LocalDate getDateRemontee() {
        return dateRemontee;
    }
    public void setDateRemontee(LocalDate dateRemontee) {
        this.dateRemontee = dateRemontee;
    }

    public SourceIncident getSourceIncident() {
        return sourceIncident;
    }
    public void setSourceIncident(SourceIncident sourceIncident) {
        this.sourceIncident = sourceIncident;
    }

    public String getStatutIncident() {
        return statutIncident;
    }
    public void setStatutIncident(String statutIncident) {
        this.statutIncident = statutIncident;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    // … continue à coller tous les getters et setters pour les champs ajoutés …
    
    public String getNomDeclarant() { return nomDeclarant; }
    public void setNomDeclarant(String nomDeclarant) { this.nomDeclarant = nomDeclarant; }
    public String getServiceEntite() { return serviceEntite; }
    public void setServiceEntite(String serviceEntite) { this.serviceEntite = serviceEntite; }
    public String getTypeRisque() { return typeRisque; }
    public void setTypeRisque(String typeRisque) { this.typeRisque = typeRisque; }
    public String getOrigineRisque() { return origineRisque; }
    public void setOrigineRisque(String origineRisque) { this.origineRisque = origineRisque; }
    public String getVolumeConcerne() { return volumeConcerne; }
    public void setVolumeConcerne(String volumeConcerne) { this.volumeConcerne = volumeConcerne; }
    public String getCriticite() { return criticite; }
    public void setCriticite(String criticite) { this.criticite = criticite; }
    public String getConsequencesPotentielles() { return consequencesPotentielles; }
    public void setConsequencesPotentielles(String consequencesPotentielles) { this.consequencesPotentielles = consequencesPotentielles; }
    public String getReferenceAudit() { return referenceAudit; }
    public void setReferenceAudit(String referenceAudit) { this.referenceAudit = referenceAudit; }
    public String getExigenceReglementaire() { return exigenceReglementaire; }
    public void setExigenceReglementaire(String exigenceReglementaire) { this.exigenceReglementaire = exigenceReglementaire; }
    public String getPropositionEvolution() { return propositionEvolution; }
    public void setPropositionEvolution(String propositionEvolution) { this.propositionEvolution = propositionEvolution; }
    public String getUrgenceMiseEnOeuvre() { return urgenceMiseEnOeuvre; }
    public void setUrgenceMiseEnOeuvre(String urgenceMiseEnOeuvre) { this.urgenceMiseEnOeuvre = urgenceMiseEnOeuvre; }
    public String getCommentairesComplementaires() { return commentairesComplementaires; }
    public void setCommentairesComplementaires(String commentairesComplementaires) { this.commentairesComplementaires = commentairesComplementaires; }

    // … complète avec le reste de tes getters & setters existants …
}
// src/main/java/com/example/backend/model/Incident.java
package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomDeclarant;
    private String serviceEntite;
    private String libelle;
    private String description;
    private String criticite;
    private String propositionEvolution;
    private String urgenceMiseEnOeuvre;
    private String statutIncident;
    private String prioriteMetier;
    private String sourceIncident;
    @Column(name = "exigence_reglementaire")
    private Boolean exigenceReglementaire;
    private String typeRisque;
private String origineRisque;
private String volumeConcerne;
private String consequencesPotentielles;
private String referenceAudit;
private String commentairesComplementaires;


    // on n’a pas besoin de sérialiser l’utilisateur à chaque fois
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    // côté « parent » de la relation ManyToMany on veut voir la liste de risques
    @JsonManagedReference
    @ManyToMany
    @JoinTable(
      name = "incident_risque",
      joinColumns = @JoinColumn(name = "incident_id"),
      inverseJoinColumns = @JoinColumn(name = "risque_id")
    )
    private List<Risque> risques = new ArrayList<>();

    // pas d’infini sur la qualification non plus
    @JsonIgnore
    @OneToOne(mappedBy = "incident", cascade = CascadeType.ALL)
    private QualificationIncident qualification;

    private LocalDate dateDeclaration;


    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNomDeclarant() {
        return nomDeclarant;
    }
    public void setNomDeclarant(String nomDeclarant) {
        this.nomDeclarant = nomDeclarant;
    }

    public String getServiceEntite() {
        return serviceEntite;
    }
    public void setServiceEntite(String serviceEntite) {
        this.serviceEntite = serviceEntite;
    }

    public String getLibelle() {
        return libelle;
    }
    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getCriticite() {
        return criticite;
    }
    public void setCriticite(String criticite) {
        this.criticite = criticite;
    }

    public String getPropositionEvolution() {
        return propositionEvolution;
    }
    public void setPropositionEvolution(String propositionEvolution) {
        this.propositionEvolution = propositionEvolution;
    }

    public String getUrgenceMiseEnOeuvre() {
        return urgenceMiseEnOeuvre;
    }
    public void setUrgenceMiseEnOeuvre(String urgenceMiseEnOeuvre) {
        this.urgenceMiseEnOeuvre = urgenceMiseEnOeuvre;
    }

    public String getStatutIncident() {
        return statutIncident;
    }
    public void setStatutIncident(String statutIncident) {
        this.statutIncident = statutIncident;
    }

    public String getPrioriteMetier() {
        return prioriteMetier;
    }
    public void setPrioriteMetier(String prioriteMetier) {
        this.prioriteMetier = prioriteMetier;
    }

    public String getSourceIncident() {
        return sourceIncident;
    }
    public void setSourceIncident(String sourceIncident) {
        this.sourceIncident = sourceIncident;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public List<Risque> getRisques() {
        return risques;
    }
    public void setRisques(List<Risque> risques) {
        this.risques = risques;
    }

    public QualificationIncident getQualification() {
        return qualification;
    }
    public void setQualification(QualificationIncident qualification) {
        this.qualification = qualification;
    }

    public LocalDate getDateDeclaration() {
        return dateDeclaration;
    }
    public void setDateDeclaration(LocalDate dateDeclaration) {
        this.dateDeclaration = dateDeclaration;
    }

    public String getTypeRisque() {
        return typeRisque;
    }
    public void setTypeRisque(String typeRisque) {
        this.typeRisque = typeRisque;
    }
    
    public String getOrigineRisque() {
        return origineRisque;
    }
    public void setOrigineRisque(String origineRisque) {
        this.origineRisque = origineRisque;
    }
    
    public String getVolumeConcerne() {
        return volumeConcerne;
    }
    public void setVolumeConcerne(String volumeConcerne) {
        this.volumeConcerne = volumeConcerne;
    }
    
    public String getConsequencesPotentielles() {
        return consequencesPotentielles;
    }
    public void setConsequencesPotentielles(String consequencesPotentielles) {
        this.consequencesPotentielles = consequencesPotentielles;
    }
    
    public String getReferenceAudit() {
        return referenceAudit;
    }
    public void setReferenceAudit(String referenceAudit) {
        this.referenceAudit = referenceAudit;
    }
    
    public String getCommentairesComplementaires() {
        return commentairesComplementaires;
    }
    public void setCommentairesComplementaires(String commentairesComplementaires) {
        this.commentairesComplementaires = commentairesComplementaires;
    }

    public Boolean getExigenceReglementaire() { return exigenceReglementaire; }
    public void setExigenceReglementaire(Boolean exigenceReglementaire) { this.exigenceReglementaire = exigenceReglementaire; }   
}
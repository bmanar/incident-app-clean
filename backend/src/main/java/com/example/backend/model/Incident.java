package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Utilisateur (optionnel)
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

    private LocalDate dateRemontee;

    @ManyToOne
    private SourceIncident sourceIncident;

    private String statutIncident;
    private String description;
    private String prioriteMetier;
    private Double montantPertes;
    private Integer nombre;
    private String periode;

    private String prioriteIt; // Qualification
    private LocalDate dateProposee;
    private String contactPrincipal;

    // Pièces jointes
    private String pieceJointe; // Pour la remontée
    private String pieceJointeQualification; // Pour la qualification

    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public EquipeEnCharge getEquipeEnCharge() { return equipeEnCharge; }
    public void setEquipeEnCharge(EquipeEnCharge equipeEnCharge) { this.equipeEnCharge = equipeEnCharge; }

    public Set<Risque> getRisques() { return risques; }
    public void setRisques(Set<Risque> risques) { this.risques = risques; }

    public LocalDate getDateRemontee() { return dateRemontee; }
    public void setDateRemontee(LocalDate dateRemontee) { this.dateRemontee = dateRemontee; }

    public SourceIncident getSourceIncident() { return sourceIncident; }
    public void setSourceIncident(SourceIncident sourceIncident) { this.sourceIncident = sourceIncident; }

    public String getStatutIncident() { return statutIncident; }
    public void setStatutIncident(String statutIncident) { this.statutIncident = statutIncident; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrioriteMetier() { return prioriteMetier; }
    public void setPrioriteMetier(String prioriteMetier) { this.prioriteMetier = prioriteMetier; }

    public Double getMontantPertes() { return montantPertes; }
    public void setMontantPertes(Double montantPertes) { this.montantPertes = montantPertes; }

    public Integer getNombre() { return nombre; }
    public void setNombre(Integer nombre) { this.nombre = nombre; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getPrioriteIt() { return prioriteIt; }
    public void setPrioriteIt(String prioriteIt) { this.prioriteIt = prioriteIt; }

    public LocalDate getDateProposee() { return dateProposee; }
    public void setDateProposee(LocalDate dateProposee) { this.dateProposee = dateProposee; }

    public String getContactPrincipal() { return contactPrincipal; }
    public void setContactPrincipal(String contactPrincipal) { this.contactPrincipal = contactPrincipal; }

    public String getPieceJointe() { return pieceJointe; }
    public void setPieceJointe(String pieceJointe) { this.pieceJointe = pieceJointe; }

    public String getPieceJointeQualification() { return pieceJointeQualification; }
    public void setPieceJointeQualification(String pieceJointeQualification) { this.pieceJointeQualification = pieceJointeQualification; }
}
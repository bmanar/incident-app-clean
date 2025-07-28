package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
public class QualificationIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @NotBlank
    private String prioriteIt;

    private LocalDate dateProposee;

    private String contactPropose;

    private String equipeEnCharge;

    private String fichierJoint;

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Incident getIncident() {
        return incident;
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public String getPrioriteIt() {
        return prioriteIt;
    }

    public void setPrioriteIt(String prioriteIt) {
        this.prioriteIt = prioriteIt;
    }

    public LocalDate getDateProposee() {
        return dateProposee;
    }

    public void setDateProposee(LocalDate dateProposee) {
        this.dateProposee = dateProposee;
    }

    public String getContactPropose() {
        return contactPropose;
    }

    public void setContactPropose(String contactPropose) {
        this.contactPropose = contactPropose;
    }

    public String getEquipeEnCharge() {
        return equipeEnCharge;
    }

    public void setEquipeEnCharge(String equipeEnCharge) {
        this.equipeEnCharge = equipeEnCharge;
    }

    public String getFichierJoint() {
        return fichierJoint;
    }

    public void setFichierJoint(String fichierJoint) {
        this.fichierJoint = fichierJoint;
    }
}
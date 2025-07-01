package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class PieceJointe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomFichier;
    private String urlOuPath;

    @ManyToOne
    private Incident incident;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }
    public String getUrlOuPath() { return urlOuPath; }
    public void setUrlOuPath(String urlOuPath) { this.urlOuPath = urlOuPath; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
}

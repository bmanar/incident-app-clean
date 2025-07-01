package com.example.backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Risque {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String libelle;

    @ManyToMany(mappedBy = "risques")
    private Set<Incident> incidents;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public Set<Incident> getIncidents() { return incidents; }
    public void setIncidents(Set<Incident> incidents) { this.incidents = incidents; }
}

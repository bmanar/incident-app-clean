// src/main/java/com/example/backend/model/Risque.java
package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Risque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;

    // côté « enfant » de la relation on ne ré-écrit pas l’incident
    @JsonBackReference
    @ManyToMany(mappedBy = "risques")
    private List<Incident> incidents = new ArrayList<>();

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<Incident> getIncidents() {
        return incidents;
    }
    public void setIncidents(List<Incident> incidents) {
        this.incidents = incidents;
    }
}
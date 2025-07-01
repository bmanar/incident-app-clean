#!/bin/bash

# Nom du package de base
BASEPKG="com/example/backend"
mkdir -p backend/src/main/java/$BASEPKG/model
mkdir -p backend/src/main/java/$BASEPKG/repository
mkdir -p backend/src/main/java/$BASEPKG/controller
mkdir -p backend/src/main/resources

# application.properties
cat > backend/src/main/resources/application.properties <<EOF
spring.datasource.url=jdbc:postgresql://localhost:5432/incidentdb
spring.datasource.username=postgres
spring.datasource.password=ton_mot_de_passe
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
EOF

# BackendApplication.java
cat > backend/src/main/java/$BASEPKG/BackendApplication.java <<EOF
package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
EOF

# Incident.java
cat > backend/src/main/java/$BASEPKG/model/Incident.java <<EOF
package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Incident {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private LocalDate dateRemontee;
    private String sourceIncident;
    private String statutIncident;
    private String description;
    private String prioriteMetier;
    private Double montantPertes;
    private String frequence;
    private Integer nombre;
    private String periode;
    private String prioriteIt;
    private LocalDate dateProposee;
    private String contactPrincipal;

    // Getters & Setters
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
    public String getSourceIncident() { return sourceIncident; }
    public void setSourceIncident(String sourceIncident) { this.sourceIncident = sourceIncident; }
    public String getStatutIncident() { return statutIncident; }
    public void setStatutIncident(String statutIncident) { this.statutIncident = statutIncident; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPrioriteMetier() { return prioriteMetier; }
    public void setPrioriteMetier(String prioriteMetier) { this.prioriteMetier = prioriteMetier; }
    public Double getMontantPertes() { return montantPertes; }
    public void setMontantPertes(Double montantPertes) { this.montantPertes = montantPertes; }
    public String getFrequence() { return frequence; }
    public void setFrequence(String frequence) { this.frequence = frequence; }
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
}
EOF

# Risque.java
cat > backend/src/main/java/$BASEPKG/model/Risque.java <<EOF
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
EOF

# Utilisateur.java
cat > backend/src/main/java/$BASEPKG/model/Utilisateur.java <<EOF
package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class Utilisateur {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String role;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
EOF

# EquipeEnCharge.java
cat > backend/src/main/java/$BASEPKG/model/EquipeEnCharge.java <<EOF
package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class EquipeEnCharge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
}
EOF

# PieceJointe.java
cat > backend/src/main/java/$BASEPKG/model/PieceJointe.java <<EOF
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
EOF

# Repositories
for entity in Incident Risque Utilisateur EquipeEnCharge PieceJointe; do
cat > backend/src/main/java/$BASEPKG/repository/${entity}Repository.java <<EOF
package com.example.backend.repository;

import com.example.backend.model.$entity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ${entity}Repository extends JpaRepository<$entity, Long> {}
EOF
done

# Controllers (exemple Incident, tu pourras faire pareil pour les autres)
cat > backend/src/main/java/$BASEPKG/controller/IncidentController.java <<EOF
package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.repository.IncidentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentRepository repo;
    public IncidentController(IncidentRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Incident> getAll() { return repo.findAll(); }

    @PostMapping
    public Incident create(@RequestBody Incident incident) { return repo.save(incident); }
}
EOF

echo "✅ Backend Spring Boot généré !"
echo "Ouvre le dossier backend/ dans Visual Studio Code et ajoute le pom.xml généré par Spring Initializr."


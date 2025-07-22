package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.repository.IncidentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @PostMapping
    public Incident createIncident(@Valid @RequestBody Incident incident) {
        return incidentRepository.save(incident);
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @Valid @RequestBody Incident updatedIncident) {
        return incidentRepository.findById(id)
                .map(existing -> {
                    updatedIncident.setId(existing.getId());
                    return incidentRepository.save(updatedIncident);
                })
                .orElse(null);
    }
}
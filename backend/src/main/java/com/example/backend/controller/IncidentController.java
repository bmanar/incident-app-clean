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

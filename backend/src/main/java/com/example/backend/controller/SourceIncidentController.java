package com.example.backend.controller;

import com.example.backend.model.SourceIncident;
import com.example.backend.repository.SourceIncidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sources-incidents")
public class SourceIncidentController {
    private final SourceIncidentRepository repo;

    public SourceIncidentController(SourceIncidentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<SourceIncident> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public SourceIncident create(@RequestBody SourceIncident source) {
        return repo.save(source);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
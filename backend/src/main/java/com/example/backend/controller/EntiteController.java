package com.example.backend.controller;

import com.example.backend.model.Entite;
import com.example.backend.repository.EntiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entites")
@CrossOrigin(origins = "*")
public class EntiteController {
    @Autowired
    private EntiteRepository entiteRepository;

    @GetMapping
    public List<Entite> getAll() {
        return entiteRepository.findAll();
    }

    @PostMapping
    public Entite create(@RequestBody Entite entite) {
        return entiteRepository.save(entite);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        entiteRepository.deleteById(id);
    }
}
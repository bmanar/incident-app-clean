// src/main/java/com/example/backend/controller/UtilisateurController.java
package com.example.backend.controller;

import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;
    private final CurrentUserService currentUserService;

    @Autowired
    public UtilisateurController(UtilisateurRepository utilisateurRepository,
                                 CurrentUserService currentUserService) {
        this.utilisateurRepository = utilisateurRepository;
        this.currentUserService = currentUserService;
    }

    /**
     * Récupère la liste de tous les utilisateurs.
     */
    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    /**
     * Récupère l'utilisateur actuellement authentifié.
     */
    @GetMapping("/me")
    public Utilisateur getCurrentUser() {
        Long currentUserId = currentUserService.getCurrentUserId();
        return utilisateurRepository.findById(currentUserId).orElse(null);
    }

    /**
     * Crée un nouvel utilisateur.
     */
    @PostMapping
    public Utilisateur createUtilisateur(@Valid @RequestBody Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    /**
     * Met à jour un utilisateur existant.
     */
    @PutMapping("/{id}")
    public Utilisateur updateUtilisateur(@PathVariable Long id,
                                         @Valid @RequestBody Utilisateur updatedUtilisateur) {
        return utilisateurRepository.findById(id)
            .map(existing -> {
                updatedUtilisateur.setId(existing.getId());
                return utilisateurRepository.save(updatedUtilisateur);
            })
            .orElse(null);
    }

    /**
     * Récupère un utilisateur par son ID.
     */
    @GetMapping("/{id}")
    public Utilisateur getUtilisateurById(@PathVariable Long id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    /**
     * Supprime un utilisateur par son ID.
     */
    @DeleteMapping("/{id}")
    public void deleteUtilisateur(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }
}
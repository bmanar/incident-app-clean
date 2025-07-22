package com.example.backend.controller;

import com.example.backend.model.Utilisateur;
import com.example.backend.model.Entite;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.repository.EntiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EntiteRepository entiteRepository;

    @GetMapping
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> req) {
        try {
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setNom((String) req.get("nom"));
            utilisateur.setPrenom((String) req.get("prenom"));
            utilisateur.setMail((String) req.get("mail"));
            utilisateur.setPassword((String) req.get("password"));

            if (req.get("entiteId") != null) {
                Long entiteId = Long.valueOf(req.get("entiteId").toString());
                Entite entite = entiteRepository.findById(entiteId).orElse(null);
                utilisateur.setEntite(entite);
            }
            Utilisateur saved = utilisateurRepository.save(utilisateur);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity
                .status(409)
                .body("L'adresse email existe déjà.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        try {
            Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            u.setNom((String) req.get("nom"));
            u.setPrenom((String) req.get("prenom"));
            u.setMail((String) req.get("mail"));
            u.setPassword((String) req.get("password"));

            if (req.get("entiteId") != null) {
                Long entiteId = Long.valueOf(req.get("entiteId").toString());
                Entite entite = entiteRepository.findById(entiteId).orElse(null);
                u.setEntite(entite);
            }
            Utilisateur saved = utilisateurRepository.save(u);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity
                .status(409)
                .body("L'adresse email existe déjà.");
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }
}
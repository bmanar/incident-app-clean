package com.example.backend.controller;

import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String mail = req.get("mail");
        String password = req.get("password");

        Utilisateur utilisateur = utilisateurRepository.findByMail(mail);
        if (utilisateur == null) {
            return ResponseEntity.status(401).body("Utilisateur inconnu.");
        }
        if (!utilisateur.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Mot de passe incorrect.");
        }

        // ⚠️ Pour un vrai projet : jamais retourner le password ici. Ici c'est pour l'exemple !
        utilisateur.setPassword(""); // Masquer le password dans la réponse
        return ResponseEntity.ok(utilisateur);
    }
}
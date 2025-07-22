package com.example.backend.controller;

import com.example.backend.model.Utilisateur;
import com.example.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
        }

        Utilisateur utilisateur = utilisateurService.findByMail(userDetails.getUsername());

        if (utilisateur == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable");
        }

        System.out.println("Utilisateur connecté : " + userDetails.getUsername());

        return ResponseEntity.ok(utilisateur);
    }
}
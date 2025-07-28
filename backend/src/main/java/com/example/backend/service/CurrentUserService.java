package com.example.backend.service;

import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service pour récupérer l'utilisateur actuellement authentifié.
 */
@Service
public class CurrentUserService {

    private final UtilisateurRepository utilisateurRepository;

    public CurrentUserService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Récupère l'identifiant (ID) de l'utilisateur authentifié.
     * 
     * @return l'ID de l'utilisateur courant
     * @throws IllegalStateException si aucun utilisateur authentifié ou introuvable
     */
    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new IllegalStateException("Aucun utilisateur authentifié");
        }
        String mail = auth.getName();  // on suppose que le principal est l'email
        Utilisateur user = utilisateurRepository
            .findByMail(mail)
            .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable pour mail : " + mail));
        return user.getId();
    }

    /**
     * (Optionnel) Récupère l'email de l'utilisateur courant.
     */
    public String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Aucun utilisateur authentifié");
        }
        return auth.getName();
    }
}
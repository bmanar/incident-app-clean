package com.example.backend.service;

import com.example.backend.model.Utilisateur;

/**
 * Service pour l'entité Utilisateur.
 */
public interface UtilisateurService {

    /**
     * Charge l'utilisateur identifié par son email,
     * ou lève une exception si introuvable.
     */
    Utilisateur findByMail(String mail);

}
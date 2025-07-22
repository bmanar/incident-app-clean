package com.example.backend.repository;

import com.example.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository pour l'entité Utilisateur.
 * On ne recherche plus par username, mais uniquement par mail.
 */
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    /**
     * Recherche un utilisateur par son adresse email.
     */
    Optional<Utilisateur> findByMail(String mail);

}
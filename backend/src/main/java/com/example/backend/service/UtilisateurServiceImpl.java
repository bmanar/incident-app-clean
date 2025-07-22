package com.example.backend.service;

import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public Utilisateur findByMail(String mail) {
        return utilisateurRepository.findByMail(mail).orElse(null);
    }
}
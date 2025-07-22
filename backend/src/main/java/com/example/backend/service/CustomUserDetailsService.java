package com.example.backend.service;

import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {
        Utilisateur u = utilisateurRepository.findByMail(mail)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        return User.builder()
                .username(u.getMail())
                .password(u.getPassword())
                .roles("USER")
                .build();
    }
}
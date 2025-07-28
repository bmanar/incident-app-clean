package com.example.backend.service;

import com.example.backend.model.Role;
import com.example.backend.model.Utilisateur;
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

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

        // Transformation des rôles en autorités Spring
        Set<GrantedAuthority> authorities = u.getRoles().stream()
                .map(Role::getNom)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        return new User(u.getMail(), u.getPassword(), authorities);
    }
}
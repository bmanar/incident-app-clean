package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.*;

@Configuration
public class SecurityBeansConfig {

    // 🔓 Password encoder qui n'encode rien (à utiliser seulement en développement)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
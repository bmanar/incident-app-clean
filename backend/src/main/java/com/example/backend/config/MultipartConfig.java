package com.example.backend.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class MultipartConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();

        // Taille maximale autorisée pour un fichier
        factory.setMaxFileSize(DataSize.ofMegabytes(10));

        // Taille maximale autorisée pour toute la requête
        factory.setMaxRequestSize(DataSize.ofMegabytes(10));

        // ✅ Limite explicite du nombre de fichiers (équivaut à 1 fichier max)
        factory.setFileSizeThreshold(DataSize.ofBytes(0)); // pour forcer le stockage disque direct

        return factory.createMultipartConfig();
    }
}
package com.example.backend.repository;

import com.example.backend.model.Entite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntiteRepository extends JpaRepository<Entite, Long> {}
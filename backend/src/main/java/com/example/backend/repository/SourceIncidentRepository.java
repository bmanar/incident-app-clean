package com.example.backend.repository;

import com.example.backend.model.SourceIncident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SourceIncidentRepository extends JpaRepository<SourceIncident, Long> {}
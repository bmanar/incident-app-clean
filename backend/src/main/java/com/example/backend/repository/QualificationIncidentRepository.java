// backend/src/main/java/com/example/backend/repository/QualificationIncidentRepository.java
package com.example.backend.repository;

import com.example.backend.model.QualificationIncident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QualificationIncidentRepository extends JpaRepository<QualificationIncident, Long> {
    QualificationIncident findByIncidentId(Long incidentId);
}
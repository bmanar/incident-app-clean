package com.example.backend.repository;

import com.example.backend.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // Nombre d'incidents par statut
    @Query("SELECT i.statutIncident, COUNT(i) FROM Incident i GROUP BY i.statutIncident")
    List<Object[]> countByStatutIncident();

    // Nombre d'incidents par mois (YYYY-MM)
    @Query("SELECT FUNCTION('to_char', i.dateRemontee, 'YYYY-MM') AS mois, COUNT(i) FROM Incident i GROUP BY mois ORDER BY mois")
    List<Object[]> countByMois();

    // Montant total des pertes
    @Query("SELECT SUM(i.montantPertes) FROM Incident i")
    Long montantTotalPertes();

    // Nombre d'incidents par source
    @Query("SELECT i.sourceIncident.nom, COUNT(i) FROM Incident i GROUP BY i.sourceIncident.nom")
    List<Object[]> countBySource();

    // Nombre d'incidents par priorité
    @Query("SELECT i.prioriteMetier, COUNT(i) FROM Incident i GROUP BY i.prioriteMetier")
    List<Object[]> countByPriorite();
}
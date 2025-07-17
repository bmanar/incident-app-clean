package com.example.backend.controller;

import com.example.backend.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private IncidentRepository incidentRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> res = new LinkedHashMap<>();

// Nombre d'incidents par statut
List<Object[]> statuts = incidentRepository.countByStatutIncident();
Map<String, Long> incidentsParStatut = new LinkedHashMap<>();
for (Object[] row : statuts) {
    String statut = (String) row[0];
    if (statut == null) statut = "Non renseigné";
    incidentsParStatut.put(statut, (Long) row[1]);
}
res.put("incidentsParStatut", incidentsParStatut);

// Nombre d'incidents par source
List<Object[]> parSource = incidentRepository.countBySource();
Map<String, Long> incidentsParSource = new LinkedHashMap<>();
for (Object[] row : parSource) {
    String source = (String) row[0];
    if (source == null) source = "Non renseigné";
    incidentsParSource.put(source, (Long) row[1]);
}
res.put("incidentsParSource", incidentsParSource);

// Nombre d'incidents par priorité
List<Object[]> parPriorite = incidentRepository.countByPriorite();
Map<String, Long> incidentsParPriorite = new LinkedHashMap<>();
for (Object[] row : parPriorite) {
    String priorite = (String) row[0];
    if (priorite == null) priorite = "Non renseigné";
    incidentsParPriorite.put(priorite, (Long) row[1]);
}
res.put("incidentsParPriorite", incidentsParPriorite);

        return res;
    }
}
package com.example.backend.controller;

import com.example.backend.model.Incident;
import com.example.backend.repository.IncidentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.*;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final IncidentRepository repo;

    public DashboardController(IncidentRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        List<Incident> all = repo.findAll();

        // 1. Statistiques clés
        long nonRenseigne = all.stream()
            .filter(i -> i.getStatutIncident() == null || i.getStatutIncident().isEmpty())
            .count();
        Map<String, Long> statusCounts = all.stream()
            .filter(i -> i.getStatutIncident() != null)
            .collect(Collectors.groupingBy(Incident::getStatutIncident, Collectors.counting()));
        long qualifie = statusCounts.getOrDefault("Qualifié", 0L);
        long nouveau  = statusCounts.getOrDefault("Nouveau",  0L);
        long traite   = statusCounts.getOrDefault("Traité",   0L);

        StatsDTO stats = new StatsDTO(nonRenseigne, qualifie, nouveau, traite, 0);

        // 2. Répartition par statut
        List<NameValue> statusChart = statusCounts.entrySet().stream()
            .map(e -> new NameValue(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // 3. Répartition par priorité
        Map<String, Long> priCounts = all.stream()
            .filter(i -> i.getPrioriteMetier() != null)
            .collect(Collectors.groupingBy(Incident::getPrioriteMetier, Collectors.counting()));
        List<NameValue> priorityChart = priCounts.entrySet().stream()
            .map(e -> new NameValue(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // 4. Incidents par mois (12 derniers mois)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth now = YearMonth.now();
        Map<String, Long> monthMap = IntStream.rangeClosed(0, 11)
            .mapToObj(i -> now.minusMonths(i).format(fmt))
            .collect(Collectors.toMap(m -> m, m -> 0L, (a, b) -> a, LinkedHashMap::new));

        all.stream()
        .filter(i -> i.getDateDeclaration() != null) // ✅ filtre incidents sans date
            .map(i -> YearMonth.from(i.getDateDeclaration()).format(fmt))
            .filter(monthMap::containsKey)
            .forEach(m -> monthMap.put(m, monthMap.get(m) + 1));

        List<NameValue> monthlyChart = monthMap.entrySet().stream()
            .map(e -> new NameValue(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // 5. Incidents par source
        Map<String, Long> srcCounts = all.stream()
            .filter(i -> i.getSourceIncident() != null)
            .map(i -> i.getSourceIncident())
            .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
        List<NameValue> sourceChart = srcCounts.entrySet().stream()
            .map(e -> new NameValue(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        return new DashboardResponse(stats, statusChart, priorityChart, monthlyChart, sourceChart);
    }

    // --- DTO classes ---

    public static record DashboardResponse(
        StatsDTO stats,
        List<NameValue> statusChart,
        List<NameValue> priorityChart,
        List<NameValue> monthlyChart,
        List<NameValue> sourceChart
    ) {}

    public static record StatsDTO(
        long nonRenseigne,
        long qualifie,
        long nouveau,
        long traite,
        long pertes
    ) {}

    public static record NameValue(
        String name,
        long value
    ) {}
}
package com.hero.leadnurturing.service;

import com.hero.leadnurturing.dto.DashboardStatsDTO;
import com.hero.leadnurturing.entity.LeadStatus;
import com.hero.leadnurturing.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;

    public DashboardStatsDTO getDashboardStats(
            LocalDateTime from,
            LocalDateTime to
    ) {

        // ===== Default: Current Month =====
        if (from == null || to == null) {
            from = LocalDateTime.now()
                    .withDayOfMonth(1)
                    .withHour(0).withMinute(0).withSecond(0);

            to = LocalDateTime.now()
                    .withDayOfMonth(
                            LocalDateTime.now()
                                    .toLocalDate()
                                    .lengthOfMonth()
                    )
                    .withHour(23).withMinute(59).withSecond(59);
        }

        long total = leadRepository.countByCreatedAtBetween(from, to);

        long qualified = leadRepository.countByStatusAndCreatedAtBetween(
                LeadStatus.QUALIFIED, from, to
        );

        long unqualified = leadRepository.countByStatusAndCreatedAtBetween(
                LeadStatus.UNQUALIFIED, from, to
        );

        long lost = leadRepository.countByStatusAndCreatedAtBetween(
                LeadStatus.LOST, from, to
        );

        long pending = total - (qualified + unqualified + lost);

        double conversion =
                total == 0 ? 0 :
                        ((double) qualified / total) * 100;

        return DashboardStatsDTO.builder()
                .totalLeads(total)
                .qualifiedLeads(qualified)
                .unqualifiedLeads(unqualified)
                .lostLeads(lost)
                .pendingLeads(pending)
                .conversionRate(conversion)
                .sourceDistribution(getLeadsBySource())
                .build();
    }

    // ===== Source Distribution =====
    private Map<String, Long> getLeadsBySource() {

        List<Object[]> results = leadRepository.countLeadsGroupedBySource();

        Map<String, Long> response = new HashMap<>();

        for (Object[] row : results) {
            String source = (String) row[0];
            Long count = (Long) row[1];
            if (source != null) {
                response.put(source, count);
            }
        }

        return response;
    }
}

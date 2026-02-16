package com.hero.leadnurturing.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {

    private long totalLeads;
    private long qualifiedLeads;
    private long unqualifiedLeads;
    private long lostLeads;
    private long pendingLeads;

    private double conversionRate;

    private Map<String, Long> sourceDistribution;
}

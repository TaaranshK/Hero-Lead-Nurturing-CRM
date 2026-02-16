package com.hero.leadnurturing.service;

import com.hero.leadnurturing.entity.*;
import com.hero.leadnurturing.repository.LeadModificationRepository;
import com.hero.leadnurturing.repository.LeadRepository;
import com.hero.leadnurturing.dto.DashboardStatsDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadModificationRepository leadModificationRepository;

    // ================= CREATE LEAD =================

    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }

    // ================= GET ALL LEADS =================

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    // ================= GET LEAD BY ID =================

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with ID: " + id));
    }

    // ================= GET LEADS BY STATUS =================

    public List<Lead> getLeadsByStatus(String status) {
        try {
            LeadStatus leadStatus = LeadStatus.valueOf(status.toUpperCase());
            return leadRepository.findByStatus(leadStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid lead status: " + status);
        }
    }

    // ================= GET LEADS BY CITY =================

    public List<Lead> getLeadsByCity(String city) {
        return leadRepository.findByCity(city);
    }

    // ================= GET LEADS BY DATE =================

    public List<Lead> getLeadsBetweenDates(LocalDateTime from, LocalDateTime to) {
        return leadRepository.findByCreatedAtBetween(from, to);
    }

    // ================= UPDATE LEAD WITH AUDIT =================

    public Lead updateLead(Long id, Lead updatedLead, String username) {

        Lead existing = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        // Track field changes
        checkAndSaveModification(existing, "city",
                existing.getCity(), updatedLead.getCity(), username);

        checkAndSaveModification(existing, "status",
                existing.getStatus() != null ? existing.getStatus().name() : null,
                updatedLead.getStatus() != null ? updatedLead.getStatus().name() : null,
                username);

        checkAndSaveModification(existing, "modelName",
                existing.getModelName(), updatedLead.getModelName(), username);

        checkAndSaveModification(existing, "followUpDate",
                existing.getFollowUpDate() != null ? existing.getFollowUpDate().toString() : null,
                updatedLead.getFollowUpDate() != null ? updatedLead.getFollowUpDate().toString() : null,
                username);

        // Apply updates
        existing.setCity(updatedLead.getCity());
        existing.setStatus(updatedLead.getStatus());
        existing.setModelName(updatedLead.getModelName());
        existing.setFollowUpDate(updatedLead.getFollowUpDate());

        return leadRepository.save(existing);
    }

    // ================= DELETE LEAD =================

    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        leadRepository.delete(lead);
    }

    // ================= HELPER METHOD FOR AUDIT =================

    private void checkAndSaveModification(
            Lead lead,
            String field,
            String oldValue,
            String newValue,
            String username
    ) {

        if (oldValue == null && newValue == null) return;

        if (oldValue == null || !oldValue.equals(newValue)) {

            LeadModification modification = LeadModification.builder()
                    .lead(lead)
                    .modifiedField(field)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .modifiedBy(username)
                    .build();

            leadModificationRepository.save(modification);
        }
    }

    // ================= GET MODIFICATION HISTORY =================

    public List<LeadModification> getModificationHistory(Long leadId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        return leadModificationRepository.findByLeadOrderByModifiedAtDesc(lead);
    }

    // ================= DASHBOARD STATS =================

    public DashboardStatsDTO getDashboardStats(LocalDateTime from, LocalDateTime to) {

        // If no dates provided → use current month
        if (from == null || to == null) {
            from = LocalDateTime.now()
                    .withDayOfMonth(1)
                    .withHour(0).withMinute(0).withSecond(0);

            to = LocalDateTime.now()
                    .withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
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

    // ================= GROUP BY LEAD SOURCE =================

    public Map<String, Long> getLeadsBySource() {

        List<Object[]> results = leadRepository.countLeadsGroupedBySource();

        Map<String, Long> response = new HashMap<>();

        for (Object[] row : results) {
            String source = (String) row[0];
            Long count = (Long) row[1];
            response.put(source, count);
        }

        return response;
    }
}


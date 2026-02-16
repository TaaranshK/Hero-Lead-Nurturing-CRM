package com.hero.leadnurturing.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hero.leadnurturing.dto.ApiResponse;
import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadModification;
import com.hero.leadnurturing.entity.LeadStatus;
import com.hero.leadnurturing.repository.LeadModificationRepository;
import com.hero.leadnurturing.repository.LeadRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadRepository leadRepository;
    private final LeadModificationRepository leadModificationRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> createLead(@RequestBody Lead lead, Authentication authentication) {
        lead.setCreatedAt(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());
        Lead savedLead = leadRepository.save(lead);

        // Log modification
        LeadModification modification = LeadModification.builder()
                .lead(savedLead)
                .modifiedBy(authentication.getName())
                .modifiedField("CREATED")
                .oldValue(null)
                .newValue("Lead created")
                .build();
        leadModificationRepository.save(modification);

        return ResponseEntity.ok(ApiResponse.<Lead>builder()
                .success(true)
                .message("Lead created successfully")
                .data(savedLead)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Lead>>> getAllLeads() {
        List<Lead> leads = leadRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<Lead>>builder()
                .success(true)
                .message("Leads retrieved successfully")
                .data(leads)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getLeadById(@PathVariable Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return ResponseEntity.ok(ApiResponse.<Lead>builder()
                .success(true)
                .message("Lead retrieved successfully")
                .data(lead)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails, Authentication authentication) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        // Update fields
        lead.setFirstName(leadDetails.getFirstName());
        lead.setLastName(leadDetails.getLastName());
        lead.setEmail(leadDetails.getEmail());
        lead.setContactNumber(leadDetails.getContactNumber());
        lead.setCity(leadDetails.getCity());
        lead.setAddress(leadDetails.getAddress());
        lead.setModelName(leadDetails.getModelName());
        lead.setLeadSource(leadDetails.getLeadSource());
        lead.setLeadMode(leadDetails.getLeadMode());
        lead.setStatus(leadDetails.getStatus());
        lead.setFollowUpDate(leadDetails.getFollowUpDate());
        lead.setGovernmentId(leadDetails.getGovernmentId());
        lead.setUpdatedAt(LocalDateTime.now());

        Lead updatedLead = leadRepository.save(lead);

        // Log modification
        LeadModification modification = LeadModification.builder()
                .lead(updatedLead)
                .modifiedBy(authentication.getName())
                .modifiedField("UPDATED")
                .oldValue("Lead updated")
                .newValue("Fields modified")
                .build();
        leadModificationRepository.save(modification);

        return ResponseEntity.ok(ApiResponse.<Lead>builder()
                .success(true)
                .message("Lead updated successfully")
                .data(updatedLead)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLead(@PathVariable Long id, Authentication authentication) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        // Use a reference to the persisted Lead when creating the modification so
        // Hibernate does not treat it as a transient object outside of a transaction.
        Lead leadRef = leadRepository.getReferenceById(lead.getId());

        // Log modification
        LeadModification modification = LeadModification.builder()
                .lead(leadRef)
                .modifiedBy(authentication.getName())
                .modifiedField("DELETED")
                .oldValue("Lead deleted")
                .newValue(null)
                .build();
        leadModificationRepository.save(modification);

        leadRepository.delete(lead);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Lead deleted successfully")
                .data("Lead deleted")
                .build());
    }

    @GetMapping("/filter/status")
    public ResponseEntity<ApiResponse<List<Lead>>> filterByStatus(@RequestParam String status) {
        LeadStatus leadStatus = LeadStatus.valueOf(status.toUpperCase());
        List<Lead> leads = leadRepository.findByStatus(leadStatus);
        return ResponseEntity.ok(ApiResponse.<List<Lead>>builder()
                .success(true)
                .message("Leads filtered by status")
                .data(leads)
                .build());
    }

    @GetMapping("/filter/city")
    public ResponseEntity<ApiResponse<List<Lead>>> filterByCity(@RequestParam String city) {
        List<Lead> leads = leadRepository.findByCity(city);
        return ResponseEntity.ok(ApiResponse.<List<Lead>>builder()
                .success(true)
                .message("Leads filtered by city")
                .data(leads)
                .build());
    }

    @GetMapping("/filter/date")
    public ResponseEntity<ApiResponse<List<Lead>>> filterByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        List<Lead> leads = leadRepository.findByCreatedAtBetween(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.<List<Lead>>builder()
                .success(true)
                .message("Leads filtered by date")
                .data(leads)
                .build());
    }

    @GetMapping("/{id}/modifications")
    public ResponseEntity<ApiResponse<List<LeadModification>>> getModificationHistory(@PathVariable Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        List<LeadModification> modifications = leadModificationRepository.findByLeadOrderByModifiedAtDesc(lead);
        return ResponseEntity.ok(ApiResponse.<List<LeadModification>>builder()
                .success(true)
                .message("Modification history retrieved")
                .data(modifications)
                .build());
    }
}
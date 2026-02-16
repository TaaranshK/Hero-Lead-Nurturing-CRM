package com.hero.leadnurturing.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadStatus;

/**
 * Repository for Lead entity
 */
public interface LeadRepository extends JpaRepository<Lead, Long> {
    
    // Basic filters
    List<Lead> findByStatus(LeadStatus status);
    List<Lead> findByCity(String city);
    List<Lead> findByContactNumber(String contactNumber);

    // Date range filters
    List<Lead> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByStatusAndCreatedAtBetween(LeadStatus status, LocalDateTime start, LocalDateTime end);

    // Dashboard counts
    long countByStatus(LeadStatus status);

    // Group by lead source for dashboard
    @Query("SELECT l.leadSource, COUNT(l) FROM Lead l GROUP BY l.leadSource")
    List<Object[]> countLeadsGroupedBySource();
}
package com.hero.leadnurturing.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    //Basic Search
    List<Lead> findByStatus(LeadStatus status);

    List<Lead> findByCity(String city);

    List<Lead> findByContactNumber(String contactNumber);

    //Date Filter

     List<Lead> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusAndCreatedAtBetween(
            LeadStatus status,
            LocalDateTime start,
            LocalDateTime end

    );

    //Dashboard Counts
    long countByStatus(LeadStatus status);

    // Group By Lead Source
    @Query("SELECT l.leadSource, COUNT(l) FROM Lead l GROUP BY l.leadSource")
    List<Object[]> countLeadsGroupedBySource();
}

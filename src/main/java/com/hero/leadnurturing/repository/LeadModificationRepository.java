package com.hero.leadnurturing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadModification;

/**
 * Repository for Lead Modification entity
 */
public interface LeadModificationRepository extends JpaRepository<LeadModification, Long> {

    // Get modification history for a lead (newest first)
    List<LeadModification> findByLeadOrderByModifiedAtDesc(Lead lead);
}
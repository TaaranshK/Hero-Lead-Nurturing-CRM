package com.hero.leadnurturing.repository;

import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadModification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadModificationRepository
        extends JpaRepository<LeadModification, Long> {

    List<LeadModification> findByLeadOrderByModifiedAtDesc(Lead lead);
}

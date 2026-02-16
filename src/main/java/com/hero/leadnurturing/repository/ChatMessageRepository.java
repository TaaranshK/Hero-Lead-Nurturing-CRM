package com.hero.leadnurturing.repository;

import com.hero.leadnurturing.entity.ChatMessage;
import com.hero.leadnurturing.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByLeadOrderByTimestampAsc(Lead lead);
}

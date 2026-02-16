package com.hero.leadnurturing.service;

import com.hero.leadnurturing.entity.ChatMessage;
import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.repository.ChatMessageRepository;
import com.hero.leadnurturing.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatRepository;
    private final LeadRepository leadRepository;

    public ChatMessage sendMessage(Long leadId, String sender, String message) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        ChatMessage chat = ChatMessage.builder()
                .lead(lead)
                .sender(sender)
                .message(message)
                .build();

        return chatRepository.save(chat);
    }

    public List<ChatMessage> getChatHistory(Long leadId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        return chatRepository.findByLeadOrderByTimestampAsc(lead);
    }
}

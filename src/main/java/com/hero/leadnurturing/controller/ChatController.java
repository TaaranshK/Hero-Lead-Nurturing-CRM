package com.hero.leadnurturing.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hero.leadnurturing.dto.ApiResponse;
import com.hero.leadnurturing.dto.ChatMessageRequest;
import com.hero.leadnurturing.entity.ChatMessage;
import com.hero.leadnurturing.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Send message
    @PostMapping("/{leadId}")
    public ApiResponse<ChatMessage> sendMessage(
            @PathVariable Long leadId,
            @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {

        String username = authentication.getName();

        ChatMessage chatMessage = chatService.sendMessage(leadId, username, request.getMessage());
        
        return ApiResponse.<ChatMessage>builder()
                .success(true)
                .message("Message sent successfully")
                .data(chatMessage)
                .build();
    }

    // Get chat history
    @GetMapping("/{leadId}")
    public ApiResponse<List<ChatMessage>> getChatHistory(@PathVariable Long leadId) {
        List<ChatMessage> history = chatService.getChatHistory(leadId);
        return ApiResponse.<List<ChatMessage>>builder()
                .success(true)
                .message("Chat history retrieved successfully")
                .data(history)
                .build();
    }
}

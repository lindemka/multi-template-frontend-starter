package com.example.demo.controller;

import com.example.demo.dto.ChatDtos;
import com.example.demo.entity.AuthUser;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthUserRepository authUserRepository;

    @GetMapping("/conversations")
    public List<ChatDtos.ChatConversationDto> getConversations(Principal principal) {
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        return chatService.listConversations(me.getId()).stream().map(c -> {
            ChatDtos.ChatConversationDto dto = new ChatDtos.ChatConversationDto();
            dto.id = c.getId();
            String other = c.getUser1().getId().equals(me.getId()) ? c.getUser2().getUsername() : c.getUser1().getUsername();
            dto.otherUsername = other;
            dto.updatedAt = c.getUpdatedAt();
            var last = chatService.getLastMessage(c.getId());
            if (last != null) {
                dto.lastMessage = last.getContent();
                dto.lastMessageAt = last.getCreatedAt();
            }
            dto.unreadCount = (int) chatService.countUnread(c.getId(), me.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/messages/{username}")
    public List<ChatDtos.ChatMessageDto> getMessages(@PathVariable("username") String otherUsername, Principal principal) {
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        AuthUser other = authUserRepository.findByUsername(otherUsername).orElseThrow();
        return chatService.listMessages(me.getId(), other.getId()).stream().map(m -> {
            ChatDtos.ChatMessageDto dto = new ChatDtos.ChatMessageDto();
            dto.id = m.getId();
            dto.content = m.getContent();
            dto.createdAt = m.getCreatedAt();
            ChatDtos.SimpleUser s = new ChatDtos.SimpleUser();
            s.username = m.getSender().getUsername();
            ChatDtos.SimpleUser r = new ChatDtos.SimpleUser();
            r.username = m.getRecipient().getUsername();
            dto.sender = s;
            dto.recipient = r;
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping("/send")
    public ChatDtos.ChatMessageDto sendViaRest(@RequestBody Map<String, String> body, Principal principal) {
        String toUsername = body.get("to");
        String content = body.get("content");
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        AuthUser other = authUserRepository.findByUsername(toUsername).orElseThrow();
        ChatMessage saved = chatService.sendMessage(me.getId(), other.getId(), content);
        ChatDtos.ChatMessageDto dto = new ChatDtos.ChatMessageDto();
        dto.id = saved.getId();
        dto.content = saved.getContent();
        dto.createdAt = saved.getCreatedAt();
        ChatDtos.SimpleUser s = new ChatDtos.SimpleUser();
        s.username = saved.getSender().getUsername();
        ChatDtos.SimpleUser r = new ChatDtos.SimpleUser();
        r.username = saved.getRecipient().getUsername();
        dto.sender = s;
        dto.recipient = r;
        return dto;
    }

    @PostMapping("/conversations/{username}/mark-read")
    public ResponseEntity<Void> markRead(@PathVariable("username") String otherUsername, Principal principal) {
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        AuthUser other = authUserRepository.findByUsername(otherUsername).orElseThrow();
        Long conversationId = chatService.getOrCreateConversation(me.getId(), other.getId()).getId();
        chatService.markConversationRead(conversationId, me.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/search")
    public List<Map<String, String>> searchUsers(@RequestParam("q") String query, Principal principal) {
        if (query == null || query.trim().isEmpty()) return List.of();
        String q = query.toLowerCase();
        return authUserRepository.findAll(PageRequest.of(0, 20)).stream()
                .filter(u -> !u.getUsername().equals(principal.getName()))
                .filter(u -> Boolean.TRUE.equals(u.getEnabled()))
                .filter(u -> u.getUsername().toLowerCase().contains(q) || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)))
                .map(u -> Map.of("username", u.getUsername(), "name", (u.getFirstName() + " " + u.getLastName()).trim()))
                .toList();
    }

    @PostMapping("/conversations/{username}/ensure")
    public ChatDtos.ChatConversationDto ensureConversation(@PathVariable("username") String otherUsername, Principal principal) {
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        AuthUser other = authUserRepository.findByUsername(otherUsername).orElseThrow();
        var conv = chatService.getOrCreateConversation(me.getId(), other.getId());
        ChatDtos.ChatConversationDto dto = new ChatDtos.ChatConversationDto();
        dto.id = conv.getId();
        dto.otherUsername = other.getUsername();
        dto.updatedAt = conv.getUpdatedAt();
        return dto;
    }
}



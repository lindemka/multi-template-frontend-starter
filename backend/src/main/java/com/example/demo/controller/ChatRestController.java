package com.example.demo.controller;

import com.example.demo.dto.ChatDtos;
import com.example.demo.entity.AuthUser;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.repository.ChatConversationRepository;
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
    
    @Autowired
    private ChatConversationRepository conversationRepository;

    @GetMapping("/conversations")
    public List<ChatDtos.ChatConversationDto> getConversations(Principal principal) {
        System.out.println("[DEBUG] Getting conversations for principal: " + principal.getName());
        AuthUser me = authUserRepository.findByUsername(principal.getName()).orElseThrow();
        System.out.println("[DEBUG] Found user: " + me.getUsername() + " with ID: " + me.getId());
        List<com.example.demo.entity.ChatConversation> conversations = chatService.listConversations(me.getId());
        System.out.println("[DEBUG] Found " + conversations.size() + " conversations");
        return conversations.stream().map(c -> {
            ChatDtos.ChatConversationDto dto = new ChatDtos.ChatConversationDto();
            dto.id = c.getId();
            boolean meIsUser1 = c.getUser1().getId().equals(me.getId());
            AuthUser otherUser = meIsUser1 ? c.getUser2() : c.getUser1();
            dto.otherUsername = otherUser.getUsername();
            if (otherUser.getUserProfile() != null) {
                dto.otherAvatar = otherUser.getUserProfile().getAvatar();
            }
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
            if (m.getSender().getUserProfile() != null) s.avatar = m.getSender().getUserProfile().getAvatar();
            ChatDtos.SimpleUser r = new ChatDtos.SimpleUser();
            r.username = m.getRecipient().getUsername();
            if (m.getRecipient().getUserProfile() != null) r.avatar = m.getRecipient().getUserProfile().getAvatar();
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
        if (saved.getSender().getUserProfile() != null) s.avatar = saved.getSender().getUserProfile().getAvatar();
        ChatDtos.SimpleUser r = new ChatDtos.SimpleUser();
        r.username = saved.getRecipient().getUsername();
        if (saved.getRecipient().getUserProfile() != null) r.avatar = saved.getRecipient().getUserProfile().getAvatar();
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

    @Autowired
    private javax.sql.DataSource dataSource;
    
    @GetMapping("/debug/db")
    public Map<String, Object> debugDatabase(Principal principal) {
        System.out.println("[DEBUG] Checking database connection");
        Long userCount = authUserRepository.count();
        Long conversationCount = conversationRepository.count();
        
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("jpaUsers", userCount);
        result.put("jpaConversations", conversationCount);
        
        // Direct JDBC query
        try (var conn = dataSource.getConnection();
             var stmt = conn.createStatement()) {
            
            // Count users with direct SQL
            var rs = stmt.executeQuery("SELECT COUNT(*) FROM users");
            if (rs.next()) {
                result.put("jdbcUsers", rs.getLong(1));
            }
            rs.close();
            
            // Count conversations with direct SQL
            rs = stmt.executeQuery("SELECT COUNT(*) FROM chat_conversations");
            if (rs.next()) {
                result.put("jdbcConversations", rs.getLong(1));
            }
            rs.close();
            
            // Get database metadata
            var dbMeta = conn.getMetaData();
            result.put("dbUrl", dbMeta.getURL());
            result.put("dbUser", dbMeta.getUserName());
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    @GetMapping("/users/search")
    public List<Map<String, String>> searchUsers(@RequestParam("q") String query, Principal principal) {
        if (query == null || query.trim().isEmpty()) return List.of();
        String q = query.toLowerCase();
        return authUserRepository.findAll(PageRequest.of(0, 20)).stream()
                .filter(u -> !u.getUsername().equals(principal.getName()))
                .filter(u -> Boolean.TRUE.equals(u.getEnabled()))
                .filter(u -> u.getUsername().toLowerCase().contains(q) || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)))
                .map(u -> Map.of(
                        "username", u.getUsername(),
                        "name", (u.getFirstName() + " " + u.getLastName()).trim(),
                        "avatar", u.getUserProfile() != null ? String.valueOf(u.getUserProfile().getAvatar()) : ""
                ))
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



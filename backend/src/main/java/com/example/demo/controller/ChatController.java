package com.example.demo.controller;

import com.example.demo.entity.AuthUser;
import com.example.demo.entity.ChatConversation;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthUserRepository authUserRepository;

    // no REST mappings here; REST lives in ChatRestController

    // STOMP: /app/chat.send/{username}
    @MessageMapping("/chat.send/{username}")
    @SendToUser("/queue/ack")
    public ChatMessage sendMessage(@DestinationVariable("username") String toUsername,
                                   @Payload Map<String, String> payload,
                                   SimpMessageHeaderAccessor headers,
                                   @AuthenticationPrincipal User springUser) {
        String content = payload.get("content");
        AuthUser me = authUserRepository.findByUsername(springUser.getUsername()).orElseThrow();
        AuthUser other = authUserRepository.findByUsername(toUsername).orElseThrow();
        // Persist message and notify recipient
        ChatMessage saved = chatService.sendMessage(me.getId(), other.getId(), content);
        return saved;
    }
}



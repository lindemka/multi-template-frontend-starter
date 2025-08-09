package com.example.demo.dto;

import java.time.LocalDateTime;

public class ChatDtos {
    public static class UserSummaryDto {
        public Long id;
        public String username;
        public String name;
        public String avatar;
    }

    public static class ChatConversationDto {
        public Long id;
        public String otherUsername;
        public LocalDateTime updatedAt;
        public String lastMessage;
        public LocalDateTime lastMessageAt;
        public Integer unreadCount;
    }

    public static class ChatMessageDto {
        public Long id;
        public String content;
        public LocalDateTime createdAt;
        public SimpleUser sender;
        public SimpleUser recipient;
    }

    public static class SimpleUser {
        public String username;
    }
}



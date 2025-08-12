package com.example.demo.service;

import com.example.demo.entity.AuthUser;
import com.example.demo.entity.ChatConversation;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.repository.ChatConversationRepository;
import com.example.demo.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    public ChatConversationRepository conversationRepository;
    @Autowired
    private ChatMessageRepository messageRepository;
    @Autowired
    private AuthUserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatConversation getOrCreateConversation(Long userAId, Long userBId) {
        return conversationRepository.findBetweenUsers(userAId, userBId)
                .orElseGet(() -> {
                    ChatConversation c = new ChatConversation();
                    // Ensure user1_id < user2_id due to database constraint
                    Long user1Id = Math.min(userAId, userBId);
                    Long user2Id = Math.max(userAId, userBId);
                    
                    AuthUser u1 = userRepository.findById(user1Id).orElseThrow();
                    AuthUser u2 = userRepository.findById(user2Id).orElseThrow();
                    c.setUser1(u1);
                    c.setUser2(u2);
                    return conversationRepository.save(c);
                });
    }

    public List<ChatConversation> listConversations(Long userId) {
        System.out.println("[DEBUG] ChatService.listConversations called with userId: " + userId);
        List<ChatConversation> result = conversationRepository.findAllForUser(userId);
        System.out.println("[DEBUG] Repository returned " + result.size() + " conversations");
        return result;
    }

    public List<ChatMessage> listMessages(Long userAId, Long userBId) {
        return messageRepository.findBetweenUsers(userAId, userBId);
    }

    @Transactional
    public ChatMessage sendMessage(Long senderId, Long recipientId, String content) {
        ChatConversation conversation = getOrCreateConversation(senderId, recipientId);
        AuthUser sender = userRepository.findById(senderId).orElseThrow();
        AuthUser recipient = userRepository.findById(recipientId).orElseThrow();
        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        ChatMessage saved = messageRepository.save(message);
        // bump conversation updatedAt similar to LinkedIn recent sorting
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
        // Notify recipient via user destination
        messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/messages", saved);
        return saved;
    }

    @Transactional
    public void markConversationRead(Long conversationId, Long readerId) {
        List<ChatMessage> messages = messageRepository.findByConversation(conversationId);
        for (ChatMessage m : messages) {
            if (m.getRecipient().getId().equals(readerId) && m.getReadAt() == null) {
                m.setReadAt(LocalDateTime.now());
            }
        }
        messageRepository.saveAll(messages);
    }

    public long countUnread(Long conversationId, Long recipientId) {
        return messageRepository.countByConversation_IdAndRecipient_IdAndReadAtIsNull(conversationId, recipientId);
    }

    public ChatMessage getLastMessage(Long conversationId) {
        return messageRepository.findTopByConversation_IdOrderByCreatedAtDesc(conversationId);
    }
}



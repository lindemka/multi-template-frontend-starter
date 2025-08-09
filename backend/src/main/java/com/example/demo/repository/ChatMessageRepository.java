package com.example.demo.repository;

import com.example.demo.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt ASC")
    List<ChatMessage> findByConversation(@Param("conversationId") Long conversationId);

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender.id = :u1 AND m.recipient.id = :u2) OR (m.sender.id = :u2 AND m.recipient.id = :u1) ORDER BY m.createdAt ASC")
    List<ChatMessage> findBetweenUsers(@Param("u1") Long user1Id, @Param("u2") Long user2Id);

    long countByConversation_IdAndRecipient_IdAndReadAtIsNull(Long conversationId, Long recipientId);

    ChatMessage findTopByConversation_IdOrderByCreatedAtDesc(Long conversationId);
}



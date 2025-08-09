package com.example.demo.repository;

import com.example.demo.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    @Query("SELECT c FROM ChatConversation c WHERE (c.user1.id = :u1 AND c.user2.id = :u2) OR (c.user1.id = :u2 AND c.user2.id = :u1)")
    Optional<ChatConversation> findBetweenUsers(@Param("u1") Long user1Id, @Param("u2") Long user2Id);

    @Query("SELECT c FROM ChatConversation c WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.updatedAt DESC")
    List<ChatConversation> findAllForUser(@Param("userId") Long userId);
}



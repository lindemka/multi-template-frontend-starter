package com.example.demo.repository;

import com.example.demo.entity.FeedLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedLikeRepository extends JpaRepository<FeedLike, Long> {
    
    /**
     * Find like by user and post
     */
    Optional<FeedLike> findByUserIdAndPostId(Long userId, Long postId);
    
    /**
     * Check if user has liked a post
     */
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    
    /**
     * Count likes for a post
     */
    long countByPostId(Long postId);
    
    /**
     * Find all likes for a post
     */
    List<FeedLike> findByPostId(Long postId);
    
    /**
     * Find all likes by a user
     */
    @Query("SELECT fl FROM FeedLike fl WHERE fl.user.id = :userId ORDER BY fl.createdAt DESC")
    List<FeedLike> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * Delete like by user and post
     */
    void deleteByUserIdAndPostId(Long userId, Long postId);
}

package com.example.demo.repository;

import com.example.demo.entity.FeedComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedCommentRepository extends JpaRepository<FeedComment, Long> {
    
    /**
     * Find comments for a post ordered by creation date (newest first)
     */
    Page<FeedComment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);
    
    /**
     * Find top-level comments for a post (no parent comment)
     */
    @Query("SELECT fc FROM FeedComment fc WHERE fc.post.id = :postId AND fc.parentComment IS NULL ORDER BY fc.createdAt DESC")
    Page<FeedComment> findTopLevelCommentsByPostIdOrderByCreatedAtDesc(@Param("postId") Long postId, Pageable pageable);
    
    /**
     * Find replies to a specific comment
     */
    List<FeedComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
    
    /**
     * Count comments for a post
     */
    long countByPostId(Long postId);
    
    /**
     * Find comments by user
     */
    @Query("SELECT fc FROM FeedComment fc WHERE fc.user.id = :userId ORDER BY fc.createdAt DESC")
    Page<FeedComment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * Find comments by user for a specific post
     */
    List<FeedComment> findByUserIdAndPostIdOrderByCreatedAtDesc(Long userId, Long postId);
}

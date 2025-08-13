package com.example.demo.repository;

import com.example.demo.entity.FeedShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedShareRepository extends JpaRepository<FeedShare, Long> {
    
    /**
     * Count shares for a post
     */
    long countByPostId(Long postId);
    
    /**
     * Find all shares for a post
     */
    List<FeedShare> findByPostId(Long postId);
    
    /**
     * Find all shares by a user
     */
    @Query("SELECT fs FROM FeedShare fs WHERE fs.user.id = :userId ORDER BY fs.createdAt DESC")
    List<FeedShare> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * Find shares by platform
     */
    List<FeedShare> findBySharePlatform(String sharePlatform);
}

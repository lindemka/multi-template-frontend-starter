package com.example.demo.repository;

import com.example.demo.entity.FeedPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedPostRepository extends JpaRepository<FeedPost, Long> {
    
    /**
     * Find all published posts ordered by creation date (newest first)
     */
    Page<FeedPost> findByIsPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * Find posts by author ordered by creation date (newest first)
     */
    Page<FeedPost> findByAuthorIdAndIsPublishedTrueOrderByCreatedAtDesc(Long authorId, Pageable pageable);
    
    /**
     * Find posts by author username ordered by creation date (newest first)
     */
    @Query("SELECT fp FROM FeedPost fp WHERE fp.author.username = :username AND fp.isPublished = true ORDER BY fp.createdAt DESC")
    Page<FeedPost> findByAuthorUsernameAndIsPublishedTrueOrderByCreatedAtDesc(@Param("username") String username, Pageable pageable);
    
    /**
     * Find posts containing specific text in content
     */
    @Query("SELECT fp FROM FeedPost fp WHERE fp.isPublished = true AND LOWER(fp.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY fp.createdAt DESC")
    Page<FeedPost> findByContentContainingIgnoreCaseAndIsPublishedTrueOrderByCreatedAtDesc(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find posts by multiple authors (for following feed)
     */
    @Query("SELECT fp FROM FeedPost fp WHERE fp.author.id IN :authorIds AND fp.isPublished = true ORDER BY fp.createdAt DESC")
    Page<FeedPost> findByAuthorIdInAndIsPublishedTrueOrderByCreatedAtDesc(@Param("authorIds") List<Long> authorIds, Pageable pageable);
    
    /**
     * Count posts by author
     */
    long countByAuthorIdAndIsPublishedTrue(Long authorId);
    
    /**
     * Find post by ID with author details
     */
    @Query("SELECT fp FROM FeedPost fp LEFT JOIN FETCH fp.author WHERE fp.id = :id AND fp.isPublished = true")
    Optional<FeedPost> findByIdAndIsPublishedTrueWithAuthor(@Param("id") Long id);
    
    /**
     * Find recent posts for trending/hot feed
     */
    @Query("SELECT fp FROM FeedPost fp WHERE fp.isPublished = true AND fp.createdAt >= :since ORDER BY SIZE(fp.likes) DESC, SIZE(fp.comments) DESC, fp.createdAt DESC")
    Page<FeedPost> findTrendingPostsSince(@Param("since") java.time.LocalDateTime since, Pageable pageable);
}

package com.example.demo.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "feed_shares")
@EntityListeners(AuditingEntityListener.class)
public class FeedShare {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AuthUser user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private FeedPost post;
    
    @Column(name = "share_platform")
    private String sharePlatform; // e.g., "internal", "twitter", "linkedin"
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public FeedShare() {}
    
    public FeedShare(AuthUser user, FeedPost post) {
        this.user = user;
        this.post = post;
    }
    
    public FeedShare(AuthUser user, FeedPost post, String sharePlatform) {
        this.user = user;
        this.post = post;
        this.sharePlatform = sharePlatform;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public AuthUser getUser() {
        return user;
    }
    
    public void setUser(AuthUser user) {
        this.user = user;
    }
    
    public FeedPost getPost() {
        return post;
    }
    
    public void setPost(FeedPost post) {
        this.post = post;
    }
    
    public String getSharePlatform() {
        return sharePlatform;
    }
    
    public void setSharePlatform(String sharePlatform) {
        this.sharePlatform = sharePlatform;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

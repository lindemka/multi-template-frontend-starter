package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "feed_posts")
@EntityListeners(AuditingEntityListener.class)
public class FeedPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content must not exceed 5000 characters")
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private AuthUser author;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedLike> likes = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedShare> shares = new ArrayList<>();
    
    @Column(name = "is_published", nullable = false)
    private boolean isPublished = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public FeedPost() {}
    
    public FeedPost(String content, AuthUser author) {
        this.content = content;
        this.author = author;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public AuthUser getAuthor() {
        return author;
    }
    
    public void setAuthor(AuthUser author) {
        this.author = author;
    }
    
    public List<FeedLike> getLikes() {
        return likes;
    }
    
    public void setLikes(List<FeedLike> likes) {
        this.likes = likes;
    }
    
    public List<FeedComment> getComments() {
        return comments;
    }
    
    public void setComments(List<FeedComment> comments) {
        this.comments = comments;
    }
    
    public List<FeedShare> getShares() {
        return shares;
    }
    
    public void setShares(List<FeedShare> shares) {
        this.shares = shares;
    }
    
    public boolean isPublished() {
        return isPublished;
    }
    
    public void setPublished(boolean published) {
        isPublished = published;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public int getLikeCount() {
        return likes.size();
    }
    
    public int getCommentCount() {
        return comments.size();
    }
    
    public int getShareCount() {
        return shares.size();
    }
    
    public boolean isLikedBy(AuthUser user) {
        return likes.stream().anyMatch(like -> like.getUser().equals(user));
    }
    
    public boolean isSavedBy(AuthUser user) {
        // This would need a separate FeedSave entity for full implementation
        return false;
    }
}

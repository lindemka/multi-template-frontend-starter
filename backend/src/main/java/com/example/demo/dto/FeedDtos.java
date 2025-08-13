package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class FeedDtos {
    
    // Request DTOs
    public static class CreatePostRequest {
        @NotBlank(message = "Content is required")
        @Size(max = 5000, message = "Content must not exceed 5000 characters")
        private String content;
        
        private String imageUrl;
        
        // Getters and Setters
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
    }
    
    public static class UpdatePostRequest {
        @NotBlank(message = "Content is required")
        @Size(max = 5000, message = "Content must not exceed 5000 characters")
        private String content;
        
        private String imageUrl;
        
        // Getters and Setters
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
    }
    
    public static class CreateCommentRequest {
        @NotBlank(message = "Comment content is required")
        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        private String content;
        
        private Long parentCommentId;
        
        // Getters and Setters
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
        
        public Long getParentCommentId() {
            return parentCommentId;
        }
        
        public void setParentCommentId(Long parentCommentId) {
            this.parentCommentId = parentCommentId;
        }
    }
    
    public static class SharePostRequest {
        private String sharePlatform;
        
        // Getters and Setters
        public String getSharePlatform() {
            return sharePlatform;
        }
        
        public void setSharePlatform(String sharePlatform) {
            this.sharePlatform = sharePlatform;
        }
    }
    
    // Response DTOs
    public static class UserSummary {
        private Long id;
        private String username;
        private String email;
        private String displayName;
        private String avatarUrl;
        private String title;
        private String company;
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
        
        public String getAvatarUrl() {
            return avatarUrl;
        }
        
        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getCompany() {
            return company;
        }
        
        public void setCompany(String company) {
            this.company = company;
        }
    }
    
    public static class CommentResponse {
        private Long id;
        private String content;
        private UserSummary user;
        private Long parentCommentId;
        private boolean isEdited;
        private int replyCount;
        private boolean isLiked;
        private int likeCount;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime createdAt;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime updatedAt;
        
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
        
        public UserSummary getUser() {
            return user;
        }
        
        public void setUser(UserSummary user) {
            this.user = user;
        }
        
        public Long getParentCommentId() {
            return parentCommentId;
        }
        
        public void setParentCommentId(Long parentCommentId) {
            this.parentCommentId = parentCommentId;
        }
        
        public boolean isEdited() {
            return isEdited;
        }
        
        public void setEdited(boolean edited) {
            isEdited = edited;
        }
        
        public int getReplyCount() {
            return replyCount;
        }
        
        public void setReplyCount(int replyCount) {
            this.replyCount = replyCount;
        }
        
        public boolean isLiked() {
            return isLiked;
        }
        
        public void setLiked(boolean liked) {
            isLiked = liked;
        }
        
        public int getLikeCount() {
            return likeCount;
        }
        
        public void setLikeCount(int likeCount) {
            this.likeCount = likeCount;
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
    }
    
    public static class PostResponse {
        private Long id;
        private String content;
        private String imageUrl;
        private UserSummary author;
        private int likeCount;
        private int commentCount;
        private int shareCount;
        private boolean isLiked;
        private boolean isSaved;
        private List<CommentResponse> comments;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime createdAt;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime updatedAt;
        
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
        
        public UserSummary getAuthor() {
            return author;
        }
        
        public void setAuthor(UserSummary author) {
            this.author = author;
        }
        
        public int getLikeCount() {
            return likeCount;
        }
        
        public void setLikeCount(int likeCount) {
            this.likeCount = likeCount;
        }
        
        public int getCommentCount() {
            return commentCount;
        }
        
        public void setCommentCount(int commentCount) {
            this.commentCount = commentCount;
        }
        
        public int getShareCount() {
            return shareCount;
        }
        
        public void setShareCount(int shareCount) {
            this.shareCount = shareCount;
        }
        
        public boolean isLiked() {
            return isLiked;
        }
        
        public void setLiked(boolean liked) {
            isLiked = liked;
        }
        
        public boolean isSaved() {
            return isSaved;
        }
        
        public void setSaved(boolean saved) {
            isSaved = saved;
        }
        
        public List<CommentResponse> getComments() {
            return comments;
        }
        
        public void setComments(List<CommentResponse> comments) {
            this.comments = comments;
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
    }
    
    public static class FeedPageResponse {
        private List<PostResponse> posts;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private boolean hasNext;
        private boolean hasPrevious;
        
        // Getters and Setters
        public List<PostResponse> getPosts() {
            return posts;
        }
        
        public void setPosts(List<PostResponse> posts) {
            this.posts = posts;
        }
        
        public int getCurrentPage() {
            return currentPage;
        }
        
        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }
        
        public int getTotalPages() {
            return totalPages;
        }
        
        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }
        
        public long getTotalElements() {
            return totalElements;
        }
        
        public void setTotalElements(long totalElements) {
            this.totalElements = totalElements;
        }
        
        public boolean isHasNext() {
            return hasNext;
        }
        
        public void setHasNext(boolean hasNext) {
            this.hasNext = hasNext;
        }
        
        public boolean isHasPrevious() {
            return hasPrevious;
        }
        
        public void setHasPrevious(boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
        }
    }
    
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        
        public ApiResponse() {}
        
        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
        
        public static <T> ApiResponse<T> success(T data) {
            return new ApiResponse<>(true, "Success", data);
        }
        
        public static <T> ApiResponse<T> success(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }
        
        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null);
        }
        
        // Getters and Setters
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public T getData() {
            return data;
        }
        
        public void setData(T data) {
            this.data = data;
        }
    }
}

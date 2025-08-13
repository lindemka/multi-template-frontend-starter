package com.example.demo.service;

import com.example.demo.dto.FeedDtos;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedService {
    
    @Autowired
    private FeedPostRepository feedPostRepository;
    
    @Autowired
    private FeedLikeRepository feedLikeRepository;
    
    @Autowired
    private FeedCommentRepository feedCommentRepository;
    
    @Autowired
    private FeedShareRepository feedShareRepository;
    
    @Autowired
    private AuthUserRepository authUserRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    // Post operations
    public FeedDtos.PostResponse createPost(FeedDtos.CreatePostRequest request, AuthUser currentUser) {
        FeedPost post = new FeedPost(request.getContent(), currentUser);
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            post.setImageUrl(request.getImageUrl());
        }
        
        FeedPost savedPost = feedPostRepository.save(post);
        return convertToPostResponse(savedPost, currentUser);
    }
    
    public FeedDtos.PostResponse updatePost(Long postId, FeedDtos.UpdatePostRequest request, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findById(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        FeedPost post = postOpt.get();
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to update this post");
        }
        
        post.setContent(request.getContent());
        if (request.getImageUrl() != null) {
            post.setImageUrl(request.getImageUrl());
        }
        
        FeedPost updatedPost = feedPostRepository.save(post);
        return convertToPostResponse(updatedPost, currentUser);
    }
    
    public void deletePost(Long postId, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findById(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        FeedPost post = postOpt.get();
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        
        feedPostRepository.delete(post);
    }
    
    public FeedDtos.FeedPageResponse getFeed(int page, int size, AuthUser currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedPost> postsPage = feedPostRepository.findByIsPublishedTrueOrderByCreatedAtDesc(pageable);
        
        List<FeedDtos.PostResponse> posts = postsPage.getContent().stream()
                .map(post -> convertToPostResponse(post, currentUser))
                .collect(Collectors.toList());
        
        return createFeedPageResponse(posts, postsPage);
    }
    
    public FeedDtos.FeedPageResponse getFeedByUser(String username, int page, int size, AuthUser currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedPost> postsPage = feedPostRepository.findByAuthorUsernameAndIsPublishedTrueOrderByCreatedAtDesc(username, pageable);
        
        List<FeedDtos.PostResponse> posts = postsPage.getContent().stream()
                .map(post -> convertToPostResponse(post, currentUser))
                .collect(Collectors.toList());
        
        return createFeedPageResponse(posts, postsPage);
    }
    
    public FeedDtos.PostResponse getPostById(Long postId, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findByIdAndIsPublishedTrueWithAuthor(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        return convertToPostResponse(postOpt.get(), currentUser);
    }
    
    // Like operations
    public void toggleLike(Long postId, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findById(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        FeedPost post = postOpt.get();
        Optional<FeedLike> existingLike = feedLikeRepository.findByUserIdAndPostId(currentUser.getId(), postId);
        
        if (existingLike.isPresent()) {
            feedLikeRepository.delete(existingLike.get());
        } else {
            FeedLike like = new FeedLike(currentUser, post);
            feedLikeRepository.save(like);
        }
    }
    
    public boolean isLikedByUser(Long postId, AuthUser currentUser) {
        return feedLikeRepository.existsByUserIdAndPostId(currentUser.getId(), postId);
    }
    
    // Comment operations
    public FeedDtos.CommentResponse createComment(Long postId, FeedDtos.CreateCommentRequest request, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findById(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        FeedPost post = postOpt.get();
        FeedComment comment = new FeedComment(request.getContent(), currentUser, post);
        
        if (request.getParentCommentId() != null) {
            Optional<FeedComment> parentComment = feedCommentRepository.findById(request.getParentCommentId());
            if (parentComment.isPresent()) {
                comment.setParentComment(parentComment.get());
            }
        }
        
        FeedComment savedComment = feedCommentRepository.save(comment);
        return convertToCommentResponse(savedComment, currentUser);
    }
    
    public FeedDtos.CommentResponse updateComment(Long commentId, String content, AuthUser currentUser) {
        Optional<FeedComment> commentOpt = feedCommentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }
        
        FeedComment comment = commentOpt.get();
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to update this comment");
        }
        
        comment.setContent(content);
        comment.setEdited(true);
        
        FeedComment updatedComment = feedCommentRepository.save(comment);
        return convertToCommentResponse(updatedComment, currentUser);
    }
    
    public void deleteComment(Long commentId, AuthUser currentUser) {
        Optional<FeedComment> commentOpt = feedCommentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }
        
        FeedComment comment = commentOpt.get();
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to delete this comment");
        }
        
        feedCommentRepository.delete(comment);
    }
    
    public List<FeedDtos.CommentResponse> getCommentsForPost(Long postId, int page, int size, AuthUser currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedComment> commentsPage = feedCommentRepository.findTopLevelCommentsByPostIdOrderByCreatedAtDesc(postId, pageable);
        
        return commentsPage.getContent().stream()
                .map(comment -> convertToCommentResponse(comment, currentUser))
                .collect(Collectors.toList());
    }
    
    // Share operations
    public void sharePost(Long postId, FeedDtos.SharePostRequest request, AuthUser currentUser) {
        Optional<FeedPost> postOpt = feedPostRepository.findById(postId);
        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        
        FeedPost post = postOpt.get();
        FeedShare share = new FeedShare(currentUser, post, request.getSharePlatform());
        feedShareRepository.save(share);
    }
    
    // Helper methods
    private FeedDtos.PostResponse convertToPostResponse(FeedPost post, AuthUser currentUser) {
        FeedDtos.PostResponse response = new FeedDtos.PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setImageUrl(post.getImageUrl());
        response.setAuthor(convertToUserSummary(post.getAuthor()));
        response.setLikeCount(post.getLikeCount());
        response.setCommentCount(post.getCommentCount());
        response.setShareCount(post.getShareCount());
        response.setLiked(post.isLikedBy(currentUser));
        response.setSaved(post.isSavedBy(currentUser));
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        
        // Load comments for the post
        List<FeedDtos.CommentResponse> comments = getCommentsForPost(post.getId(), 0, 5, currentUser);
        response.setComments(comments);
        
        return response;
    }
    
    private FeedDtos.CommentResponse convertToCommentResponse(FeedComment comment, AuthUser currentUser) {
        FeedDtos.CommentResponse response = new FeedDtos.CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUser(convertToUserSummary(comment.getUser()));
        response.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        response.setEdited(comment.isEdited());
        response.setReplyCount(feedCommentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId()).size());
        response.setLiked(false); // TODO: Implement comment likes
        response.setLikeCount(0); // TODO: Implement comment likes
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        
        return response;
    }
    
    private FeedDtos.UserSummary convertToUserSummary(AuthUser user) {
        FeedDtos.UserSummary summary = new FeedDtos.UserSummary();
        summary.setId(user.getId());
        summary.setUsername(user.getUsername());
        summary.setEmail(user.getEmail());
        summary.setDisplayName(user.getFullName());
        
        // ALWAYS use avatar from database - single source of truth
        // Explicitly load the user profile to ensure avatar is available
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            UserProfile profile = profileOpt.get();
            summary.setAvatarUrl(profile.getAvatar());
            summary.setTitle(profile.getTagline());
            summary.setCompany(profile.getLocation());
        } else {
            // This should never happen if database integrity is maintained
            summary.setAvatarUrl(null);
            summary.setTitle(null);
            summary.setCompany(null);
        }
        
        return summary;
    }
    
    private FeedDtos.FeedPageResponse createFeedPageResponse(List<FeedDtos.PostResponse> posts, Page<FeedPost> postsPage) {
        FeedDtos.FeedPageResponse response = new FeedDtos.FeedPageResponse();
        response.setPosts(posts);
        response.setCurrentPage(postsPage.getNumber());
        response.setTotalPages(postsPage.getTotalPages());
        response.setTotalElements(postsPage.getTotalElements());
        response.setHasNext(postsPage.hasNext());
        response.setHasPrevious(postsPage.hasPrevious());
        
        return response;
    }
}

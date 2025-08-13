package com.example.demo.controller;

import com.example.demo.dto.FeedDtos;
import com.example.demo.entity.AuthUser;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.service.FeedService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class FeedController {
    
    @Autowired
    private FeedService feedService;
    
    @Autowired
    private AuthUserRepository authUserRepository;
    
    private AuthUser getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        return authUserRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }
    
    // Post endpoints
    @PostMapping("/posts")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.PostResponse>> createPost(
            @Valid @RequestBody FeedDtos.CreatePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.PostResponse post = feedService.createPost(request, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Post created successfully", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/posts/{postId}")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.PostResponse>> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody FeedDtos.UpdatePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.PostResponse post = feedService.updatePost(postId, request, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Post updated successfully", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<FeedDtos.ApiResponse<Void>> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            feedService.deletePost(postId, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Post deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.FeedPageResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = null;
            try {
                currentUser = getCurrentUser(userDetails);
            } catch (Exception e) {
                // For testing, allow unauthenticated access
                System.out.println("No authenticated user, proceeding without user context");
            }
            FeedDtos.FeedPageResponse feed = feedService.getFeed(page, size, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success(feed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts/user/{username}")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.FeedPageResponse>> getFeedByUser(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.FeedPageResponse feed = feedService.getFeedByUser(username, page, size, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success(feed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts/{postId}")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.PostResponse>> getPostById(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.PostResponse post = feedService.getPostById(postId, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success(post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    // Like endpoints
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<FeedDtos.ApiResponse<Void>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            feedService.toggleLike(postId, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Like toggled successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts/{postId}/liked")
    public ResponseEntity<FeedDtos.ApiResponse<Boolean>> isLikedByUser(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            boolean isLiked = feedService.isLikedByUser(postId, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success(isLiked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    // Comment endpoints
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.CommentResponse>> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody FeedDtos.CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.CommentResponse comment = feedService.createComment(postId, request, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Comment created successfully", comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<FeedDtos.ApiResponse<FeedDtos.CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @RequestParam String content,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            FeedDtos.CommentResponse comment = feedService.updateComment(commentId, content, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Comment updated successfully", comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<FeedDtos.ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            feedService.deleteComment(commentId, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Comment deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<FeedDtos.ApiResponse<List<FeedDtos.CommentResponse>>> getCommentsForPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            List<FeedDtos.CommentResponse> comments = feedService.getCommentsForPost(postId, page, size, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success(comments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
    
    // Share endpoints
    @PostMapping("/posts/{postId}/share")
    public ResponseEntity<FeedDtos.ApiResponse<Void>> sharePost(
            @PathVariable Long postId,
            @RequestBody FeedDtos.SharePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            AuthUser currentUser = getCurrentUser(userDetails);
            feedService.sharePost(postId, request, currentUser);
            return ResponseEntity.ok(FeedDtos.ApiResponse.success("Post shared successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(FeedDtos.ApiResponse.error(e.getMessage()));
        }
    }
}

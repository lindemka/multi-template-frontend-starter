package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AuthUser user;

    @Column(name = "token_id", nullable = false, unique = true, length = 64)
    private String tokenId;

    @Column(name = "replaced_by_token_id")
    private String replacedByTokenId;

    @Column(nullable = false)
    private boolean revoked = false;

    private String ipAddress;
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public Long getId() { return id; }
    public AuthUser getUser() { return user; }
    public void setUser(AuthUser user) { this.user = user; }
    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }
    public String getReplacedByTokenId() { return replacedByTokenId; }
    public void setReplacedByTokenId(String replacedByTokenId) { this.replacedByTokenId = replacedByTokenId; }
    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}



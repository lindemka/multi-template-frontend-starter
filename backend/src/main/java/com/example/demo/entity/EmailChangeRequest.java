package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_change_requests")
public class EmailChangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AuthUser user;

    @Column(name = "new_email", nullable = false)
    private String newEmail;

    @Column(nullable = false, unique = true, length = 128)
    private String token;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public Long getId() { return id; }
    public AuthUser getUser() { return user; }
    public void setUser(AuthUser user) { this.user = user; }
    public String getNewEmail() { return newEmail; }
    public void setNewEmail(String newEmail) { this.newEmail = newEmail; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}



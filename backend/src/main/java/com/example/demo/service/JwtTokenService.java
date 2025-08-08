package com.example.demo.service;

import com.example.demo.entity.AuthUser;
import com.example.demo.entity.RefreshToken;
import com.example.demo.repository.RefreshTokenRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtTokenService {
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${spring.security.jwt.refresh-expiration:2592000000}")
    private long refreshMs;

    public JwtTokenService(JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Map<String, String> generateTokensForUser(AuthUser user, String ip, String userAgent) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        String access = jwtUtil.generateToken(user.getUsername(), claims);

        String refreshTokenId = generateTokenId();
        RefreshToken refresh = new RefreshToken();
        refresh.setUser(user);
        refresh.setTokenId(refreshTokenId);
        refresh.setIpAddress(ip);
        refresh.setUserAgent(userAgent);
        refresh.setExpiresAt(LocalDateTime.now().plusSeconds(refreshMs / 1000));
        refreshTokenRepository.save(refresh);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access", access);
        tokens.put("refresh", refreshTokenId);
        return tokens;
    }

    public RefreshToken rotateRefreshToken(String currentTokenId, AuthUser user, String ip, String userAgent) {
        RefreshToken current = refreshTokenRepository.findByTokenId(currentTokenId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (current.isRevoked() || current.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked");
        }
        current.setRevoked(true);
        String newId = generateTokenId();
        current.setReplacedByTokenId(newId);
        refreshTokenRepository.save(current);

        RefreshToken next = new RefreshToken();
        next.setUser(user);
        next.setTokenId(newId);
        next.setIpAddress(ip);
        next.setUserAgent(userAgent);
        next.setExpiresAt(LocalDateTime.now().plusSeconds(refreshMs / 1000));
        return refreshTokenRepository.save(next);
    }

    public void revokeAllUserTokens(AuthUser user) {
        // Simple approach: mark all as revoked
        refreshTokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(user.getId()) && !t.isRevoked())
                .forEach(t -> { t.setRevoked(true); refreshTokenRepository.save(t); });
    }

    private String generateTokenId() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}



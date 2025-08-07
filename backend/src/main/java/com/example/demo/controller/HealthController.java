package com.example.demo.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {
    
    // No root endpoint - port 8080 is for API only in development
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString(),
            "service", "Backend API",
            "endpoints", Map.of(
                "members", "/api/members",
                "auth", "/api/auth/*",
                "profile", "/api/profile/*"
            )
        ));
    }
}
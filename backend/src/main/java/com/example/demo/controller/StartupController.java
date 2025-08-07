package com.example.demo.controller;

import com.example.demo.entity.Startup;
import com.example.demo.entity.StartupMember;
import com.example.demo.service.StartupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/startups")
@CrossOrigin(originPatterns = "*")
public class StartupController {

    @Autowired
    private StartupService startupService;

    @GetMapping
    public ResponseEntity<Page<Startup>> getAllStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Startup> startups;
        
        if (search != null && !search.isEmpty()) {
            startups = startupService.searchStartups(search, pageable);
        } else {
            startups = startupService.getAllStartups(pageable);
        }
        
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Startup> getStartupById(@PathVariable Long id) {
        Optional<Startup> startup = startupService.getStartupById(id);
        return startup.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Startup>> getUserStartups(@PathVariable Long userId) {
        List<Startup> startups = startupService.getUserStartups(userId);
        return ResponseEntity.ok(startups);
    }
    
    @GetMapping("/my-startups")
    public ResponseEntity<List<Startup>> getMyStartups(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Extract user ID from authentication
        Map<String, Object> claims = (Map<String, Object>) authentication.getCredentials();
        Long userId = ((Number) claims.get("userId")).longValue();
        
        List<Startup> startups = startupService.getUserStartups(userId);
        return ResponseEntity.ok(startups);
    }

    @PostMapping
    public ResponseEntity<?> createStartup(@RequestBody Startup startup, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Extract user ID from authentication
            Map<String, Object> claims = (Map<String, Object>) authentication.getCredentials();
            Long userId = ((Number) claims.get("userId")).longValue();
            
            Startup savedStartup = startupService.createStartup(startup, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedStartup);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create startup: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStartup(@PathVariable Long id, @RequestBody Startup startup) {
        try {
            Startup updatedStartup = startupService.updateStartup(id, startup);
            return ResponseEntity.ok(updatedStartup);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStartup(@PathVariable Long id) {
        if (!startupService.getStartupById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        startupService.deleteStartup(id);
        return ResponseEntity.noContent().build();
    }
    
    // Member management endpoints
    @GetMapping("/{id}/members")
    public ResponseEntity<List<StartupMember>> getStartupMembers(@PathVariable Long id) {
        List<StartupMember> members = startupService.getStartupMembers(id);
        return ResponseEntity.ok(members);
    }
    
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long userId = ((Number) request.get("userId")).longValue();
            String role = (String) request.get("role");
            BigDecimal equity = request.containsKey("equity") ? 
                new BigDecimal(request.get("equity").toString()) : BigDecimal.ZERO;
            
            StartupMember member = startupService.addMember(id, userId, role, equity);
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{startupId}/members/{memberId}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long startupId,
            @PathVariable Long memberId,
            @RequestBody Map<String, Object> request) {
        try {
            String role = (String) request.get("role");
            BigDecimal equity = request.containsKey("equity") ? 
                new BigDecimal(request.get("equity").toString()) : null;
            
            StartupMember member = startupService.updateMember(memberId, role, equity);
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @DeleteMapping("/{startupId}/members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long startupId,
            @PathVariable Long userId) {
        try {
            startupService.removeMember(startupId, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    // Special filters
    @GetMapping("/hiring")
    public ResponseEntity<Page<Startup>> getHiringStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Startup> startups = startupService.getHiringStartups(pageable);
        return ResponseEntity.ok(startups);
    }
    
    @GetMapping("/fundraising")
    public ResponseEntity<Page<Startup>> getFundraisingStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Startup> startups = startupService.getFundraisingStartups(pageable);
        return ResponseEntity.ok(startups);
    }
}
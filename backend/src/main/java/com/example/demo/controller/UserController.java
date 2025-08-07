package com.example.demo.controller;

import com.example.demo.entity.AuthUser;
import com.example.demo.repository.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(originPatterns = "*")
public class UserController {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<AuthUser> userOpt = authUserRepository.findById(id);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            AuthUser user = userOpt.get();
            
            // Check if user is accessing their own data or is an admin
            String currentUsername = authentication != null ? authentication.getName() : null;
            AuthUser currentUser = authUserRepository.findByUsername(currentUsername).orElse(null);
            
            if (currentUser == null || 
                (!currentUser.getId().equals(id) && !"ADMIN".equals(currentUser.getRole()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Return user data without password
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("role", user.getRole());
            userData.put("enabled", user.getEnabled());
            userData.put("createdAt", user.getCreatedAt());
            
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates,
            Authentication authentication) {
        try {
            Optional<AuthUser> userOpt = authUserRepository.findById(id);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            AuthUser user = userOpt.get();
            
            // Check if user is updating their own data or is an admin
            String currentUsername = authentication != null ? authentication.getName() : null;
            AuthUser currentUser = authUserRepository.findByUsername(currentUsername).orElse(null);
            
            if (currentUser == null || 
                (!currentUser.getId().equals(id) && !"ADMIN".equals(currentUser.getRole()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update allowed fields
            if (updates.containsKey("firstName")) {
                user.setFirstName(updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName(updates.get("lastName"));
            }
            if (updates.containsKey("email")) {
                // Check if email is already taken
                String newEmail = updates.get("email");
                if (!newEmail.equals(user.getEmail()) && 
                    authUserRepository.existsByEmail(newEmail)) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Email already in use");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }
                user.setEmail(newEmail);
            }
            
            // Save updated user
            user = authUserRepository.save(user);
            
            // Return updated user data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("role", user.getRole());
            
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordData,
            Authentication authentication) {
        try {
            Optional<AuthUser> userOpt = authUserRepository.findById(id);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            AuthUser user = userOpt.get();
            
            // Check if user is changing their own password
            String currentUsername = authentication != null ? authentication.getName() : null;
            AuthUser currentUser = authUserRepository.findByUsername(currentUsername).orElse(null);
            
            if (currentUser == null || !currentUser.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Current password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            authUserRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to change password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
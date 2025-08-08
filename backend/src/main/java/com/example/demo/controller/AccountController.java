package com.example.demo.controller;

import com.example.demo.dto.AuthDtos.*;
import com.example.demo.entity.AuthUser;
import com.example.demo.entity.EmailChangeRequest;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.repository.EmailChangeRequestRepository;
import com.example.demo.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailChangeRequestRepository emailChangeRequestRepository;

    public AccountController(AuthUserRepository authUserRepository,
                             PasswordEncoder passwordEncoder,
                             EmailService emailService,
                             EmailChangeRequestRepository emailChangeRequestRepository) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.emailChangeRequestRepository = emailChangeRequestRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        AuthUser user = authUserRepository.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "emailVerified", user.getEmailVerified()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Map<String, String> req) {
        AuthUser user = authUserRepository.findByUsername(auth.getName()).orElseThrow();
        if (req.containsKey("firstName")) user.setFirstName(req.get("firstName"));
        if (req.containsKey("lastName")) user.setLastName(req.get("lastName"));
        authUserRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication auth, @Valid @RequestBody ChangePasswordRequest req) {
        AuthUser user = authUserRepository.findByUsername(auth.getName()).orElseThrow();
        if (!passwordEncoder.matches(req.currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Current password incorrect"));
        }
        user.setPassword(passwordEncoder.encode(req.newPassword));
        authUserRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(Authentication auth, @Valid @RequestBody ChangeEmailRequest req) {
        AuthUser user = authUserRepository.findByUsername(auth.getName()).orElseThrow();
        if (authUserRepository.existsByEmail(req.newEmail)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email already in use"));
        }
        EmailChangeRequest ecr = new EmailChangeRequest();
        ecr.setUser(user);
        ecr.setNewEmail(req.newEmail);
        ecr.setToken(java.util.UUID.randomUUID().toString());
        ecr.setExpiresAt(LocalDateTime.now().plusDays(2));
        emailChangeRequestRepository.save(ecr);
        emailService.sendEmail(req.newEmail, "Confirm your new email",
                "<p>Confirm: <a href=" + "${APP_ORIGIN:http://localhost:3000}" + "/account/email/confirm?token=" + ecr.getToken() + ">Confirm Email</a></p>");
        return ResponseEntity.ok(Map.of("message", "Confirmation sent to new email"));
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam("token") String token) {
        EmailChangeRequest ecr = emailChangeRequestRepository.findByToken(token).orElseThrow();
        if (ecr.isUsed() || ecr.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Token invalid or expired"));
        }
        AuthUser user = ecr.getUser();
        user.setEmail(ecr.getNewEmail());
        user.setEmailVerified(true);
        authUserRepository.save(user);
        ecr.setUsed(true);
        emailChangeRequestRepository.save(ecr);
        return ResponseEntity.ok(Map.of("message", "Email updated"));
    }

    @PostMapping("/change-username")
    public ResponseEntity<?> changeUsername(Authentication auth, @RequestBody Map<String, String> req) {
        String newUsername = req.getOrDefault("username", "").trim();
        if (newUsername.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username required"));
        }
        if (authUserRepository.existsByUsername(newUsername)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already taken"));
        }
        AuthUser user = authUserRepository.findByUsername(auth.getName()).orElseThrow();
        user.setUsername(newUsername);
        authUserRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Username updated"));
    }
}



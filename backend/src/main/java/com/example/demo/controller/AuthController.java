package com.example.demo.controller;

import com.example.demo.dto.AuthDtos.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.*;
import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileService userProfileService;
    private final JwtTokenService jwtTokenService;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailChangeRequestRepository emailChangeRequestRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailService emailService;
    private final RateLimiterService rateLimiterService;
    private final String appOrigin;
    private final boolean requireEmailVerification;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          AuthUserRepository authUserRepository,
                          PasswordEncoder passwordEncoder,
                          UserProfileService userProfileService,
                          JwtTokenService jwtTokenService,
                          EmailVerificationTokenRepository emailVerificationTokenRepository,
                          PasswordResetTokenRepository passwordResetTokenRepository,
                          EmailChangeRequestRepository emailChangeRequestRepository,
                          RefreshTokenRepository refreshTokenRepository,
                          EmailService emailService,
                          RateLimiterService rateLimiterService,
                           @Value("${app.origin:http://localhost:3000}") String appOrigin,
                           @Value("${app.auth.requireEmailVerification:true}") boolean requireEmailVerification) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.userProfileService = userProfileService;
        this.jwtTokenService = jwtTokenService;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailChangeRequestRepository = emailChangeRequestRepository;
        this.emailService = emailService;
        this.rateLimiterService = rateLimiterService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.appOrigin = appOrigin;
        this.requireEmailVerification = requireEmailVerification;
        log.info("AuthController initialized. requireEmailVerification={} appOrigin={}", this.requireEmailVerification, this.appOrigin);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (authUserRepository.existsByUsername(req.username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already exists"));
        }
        if (authUserRepository.existsByEmail(req.email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email already exists"));
        }
        AuthUser user = new AuthUser();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password));
        user.setFirstName(req.firstName);
        user.setLastName(req.lastName);
        user.setRole("USER");
        user.setEnabled(true);
        user.setLastLogin(null);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = authUserRepository.save(user);
        userProfileService.createProfileForUser(user);

        // Email verification token (24h)
        EmailVerificationToken evt = new EmailVerificationToken();
        evt.setUser(user);
        evt.setToken(java.util.UUID.randomUUID().toString());
        evt.setExpiresAt(LocalDateTime.now().plusDays(1));
        emailVerificationTokenRepository.save(evt);
        String verifyLink = appOrigin + "/verify-email?token=" + evt.getToken();
        emailService.sendEmail(user.getEmail(), "Verify your email",
                "<p>Click to verify: <a href='" + verifyLink + "'>Verify Email</a></p>");

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Registration successful. Please verify your email."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
                                   @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        String clientIp = ip != null ? ip : "unknown";
        Bucket bucket = rateLimiterService.resolveBucket("login:" + clientIp, 5, Duration.ofMinutes(1));
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body(Map.of("error", "Too many login attempts"));
        }
        log.info("Login attempt for {}", req.usernameOrEmail);
        AuthUser user = authUserRepository.findByUsername(req.usernameOrEmail)
                .or(() -> authUserRepository.findByEmail(req.usernameOrEmail))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!Boolean.TRUE.equals(user.getEnabled())) throw new BadCredentialsException("Account disabled");
        log.info("User found={}, emailVerified={}, requireEmailVerification={}", user.getUsername(), user.getEmailVerified(), requireEmailVerification);
        if (requireEmailVerification && !Boolean.TRUE.equals(user.getEmailVerified()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Email not verified"));

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), req.password));
        user.setLastLogin(LocalDateTime.now());
        authUserRepository.save(user);
        Map<String, String> tokens = jwtTokenService.generateTokensForUser(user, clientIp, userAgent);
        return ResponseEntity.ok(Map.of("accessToken", tokens.get("access"), "refreshToken", tokens.get("refresh")));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        EmailVerificationToken evt = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
        if (evt.isUsed() || evt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Token invalid or expired"));
        }
        AuthUser user = evt.getUser();
        user.setEmailVerified(true);
        authUserRepository.save(user);
        evt.setUsed(true);
        emailVerificationTokenRepository.save(evt);
        return ResponseEntity.ok(Map.of("message", "Email verified"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest req, @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
                                     @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        RefreshToken current = refreshTokenRepository.findByTokenId(req.refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        AuthUser user = current.getUser();
        RefreshToken next = jwtTokenService.rotateRefreshToken(current.getTokenId(), user, ip, userAgent);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId()); claims.put("email", user.getEmail()); claims.put("role", user.getRole());
        String access = jwtUtil.generateToken(user.getUsername(), claims);
        return ResponseEntity.ok(Map.of("accessToken", access, "refreshToken", next.getTokenId()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) RefreshRequest req, @RequestAttribute(name = "user", required = false) AuthUser user) {
        if (user == null && req != null) {
            RefreshToken current = refreshTokenRepository.findByTokenId(req.refreshToken).orElse(null);
            if (current != null) user = current.getUser();
        }
        if (user != null) {
            jwtTokenService.revokeAllUserTokens(user);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        Bucket bucket = rateLimiterService.resolveBucket("forgot:" + req.email, 5, Duration.ofHours(1));
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body(Map.of("error", "Too many requests"));
        }
        AuthUser user = authUserRepository.findByEmail(req.email).orElse(null);
        if (user != null) {
            PasswordResetToken prt = new PasswordResetToken();
            prt.setUser(user);
            prt.setToken(java.util.UUID.randomUUID().toString());
            prt.setExpiresAt(LocalDateTime.now().plusHours(2));
            passwordResetTokenRepository.save(prt);
            String resetLink = appOrigin + "/reset-password?token=" + prt.getToken();
            emailService.sendEmail(user.getEmail(), "Reset your password",
                    "<p>Reset link: <a href='" + resetLink + "'>Reset Password</a></p>");
        }
        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(req.token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
        if (prt.isUsed() || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Token invalid or expired"));
        }
        AuthUser user = prt.getUser();
        user.setPassword(passwordEncoder.encode(req.newPassword));
        authUserRepository.save(user);
        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}
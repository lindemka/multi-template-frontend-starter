package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.AuthUser;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserProfileService userProfileService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
            
            // Get the full user entity
            AuthUser authUser = authUserRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Update last login
            authUser.setLastLogin(LocalDateTime.now());
            authUserRepository.save(authUser);

            // Generate JWT token with additional claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", authUser.getId());
            claims.put("email", authUser.getEmail());
            claims.put("role", authUser.getRole());
            claims.put("firstName", authUser.getFirstName());
            claims.put("lastName", authUser.getLastName());
            
            String jwt = jwtUtil.generateToken(loginRequest.getUsername(), claims);

            // Get the user's profile ID
            Long profileId = userProfileService.getProfileByUserId(authUser.getId())
                    .map(profile -> profile.getId())
                    .orElse(null);
            
            // Create response
            LoginResponse response = new LoginResponse(
                    jwt,
                    authUser.getId(),
                    authUser.getUsername(),
                    authUser.getEmail(),
                    authUser.getRole(),
                    authUser.getFirstName(),
                    authUser.getLastName(),
                    profileId
            );

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (authUserRepository.existsByUsername(registerRequest.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username already exists");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Check if email already exists
            if (authUserRepository.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already exists");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Create new user
            AuthUser authUser = new AuthUser();
            authUser.setUsername(registerRequest.getUsername());
            authUser.setEmail(registerRequest.getEmail());
            authUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            authUser.setFirstName(registerRequest.getFirstName());
            authUser.setLastName(registerRequest.getLastName());
            authUser.setRole("USER");
            authUser.setEnabled(true);

            // Save user
            authUser = authUserRepository.save(authUser);
            
            // Create user profile
            userProfileService.createProfileForUser(authUser);

            // Generate JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", authUser.getId());
            claims.put("email", authUser.getEmail());
            claims.put("role", authUser.getRole());
            claims.put("firstName", authUser.getFirstName());
            claims.put("lastName", authUser.getLastName());
            
            String jwt = jwtUtil.generateToken(authUser.getUsername(), claims);

            // Get the user's profile ID
            Long profileId = userProfileService.getProfileByUserId(authUser.getId())
                    .map(profile -> profile.getId())
                    .orElse(null);
            
            // Create response
            LoginResponse response = new LoginResponse(
                    jwt,
                    authUser.getId(),
                    authUser.getUsername(),
                    authUser.getEmail(),
                    authUser.getRole(),
                    authUser.getFirstName(),
                    authUser.getLastName(),
                    profileId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    AuthUser authUser = authUserRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("username", authUser.getUsername());
                    response.put("email", authUser.getEmail());
                    response.put("role", authUser.getRole());
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
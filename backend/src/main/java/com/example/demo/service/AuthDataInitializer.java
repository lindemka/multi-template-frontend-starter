package com.example.demo.service;

import com.example.demo.entity.AuthUser;
import com.example.demo.repository.AuthUserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("postgres")
public class AuthDataInitializer {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void initAuthUsers() {
        // Check if auth users already exist
        if (authUserRepository.count() > 0) {
            System.out.println("Auth users already exist. Skipping initialization.");
            return;
        }

        System.out.println("Initializing auth users...");

        // Create admin user
        AuthUser admin = new AuthUser();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setRole("ADMIN");
        admin.setEnabled(true);
        authUserRepository.save(admin);

        // Create regular user
        AuthUser user = new AuthUser();
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole("USER");
        user.setEnabled(true);
        authUserRepository.save(user);

        // Create another test user
        AuthUser testUser = new AuthUser();
        testUser.setUsername("jane");
        testUser.setEmail("jane@example.com");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setFirstName("Jane");
        testUser.setLastName("Smith");
        testUser.setRole("USER");
        testUser.setEnabled(true);
        authUserRepository.save(testUser);

        System.out.println("Auth users initialized successfully!");
        System.out.println("Test users created:");
        System.out.println("  - Username: admin, Password: admin123 (ADMIN role)");
        System.out.println("  - Username: john, Password: password123 (USER role)");
        System.out.println("  - Username: jane, Password: password123 (USER role)");
    }
}
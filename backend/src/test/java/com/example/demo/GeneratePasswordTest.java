package com.example.demo;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("UPDATE users SET password = '" + encodedPassword + "' WHERE username = 'sarah.chen';");
        System.out.println("-- Encoded password: " + encodedPassword);
        
        // Test it works
        boolean matches = encoder.matches(rawPassword, encodedPassword);
        System.out.println("-- Password matches: " + matches);
    }
}
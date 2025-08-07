package com.example.demo;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123";
        
        // Generate a new hash
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("New encoded password: " + encodedPassword);
        
        // Test the old hash from database
        String dbHash = "$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.";
        boolean matches = encoder.matches(rawPassword, dbHash);
        System.out.println("Password 'password123' matches database hash: " + matches);
        
        // Test with newly generated hash
        boolean matchesNew = encoder.matches(rawPassword, encodedPassword);
        System.out.println("Password 'password123' matches new hash: " + matchesNew);
    }
}
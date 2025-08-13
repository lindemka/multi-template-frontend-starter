package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class AvatarUtil {
    
    /**
     * Generate a deterministic avatar URL for a given seed (username, name, etc.)
     * This ensures the same user always gets the same avatar across the application.
     * 
     * @param seed The seed string (username, full name, etc.)
     * @return A deterministic avatar URL from pravatar.cc
     */
    public static String generateAvatarUrl(String seed) {
        if (seed == null || seed.trim().isEmpty()) {
            return null;
        }
        
        // Normalize the seed to ensure consistency
        String normalizedSeed = seed.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        if (normalizedSeed.isEmpty()) {
            return null;
        }
        
        // Generate a deterministic hash
        int hash = 0;
        for (char c : normalizedSeed.toCharArray()) {
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Map to a pravatar.cc image (1-70)
        int imageIndex = Math.abs(hash % 70) + 1;
        
        return String.format("https://i.pravatar.cc/150?img=%d", imageIndex);
    }
    
    /**
     * Check if a URL is likely a placeholder/initials avatar
     * 
     * @param url The avatar URL to check
     * @return true if it's likely a placeholder avatar
     */
    public static boolean isPlaceholderAvatar(String url) {
        if (url == null || url.trim().isEmpty()) {
            return true;
        }
        
        String lowerUrl = url.toLowerCase();
        return lowerUrl.contains("ui-avatars.com") || 
               lowerUrl.contains("gravatar.com/avatar?d=identicon") ||
               lowerUrl.contains("gravatar.com/avatar?d=mp");
    }
    
    /**
     * Resolve the best avatar URL to use, preferring real photos over placeholders
     * 
     * @param primaryUrl The primary avatar URL (from database)
     * @param seed The seed for generating a fallback avatar
     * @return The best avatar URL to use
     */
    public static String resolveAvatarUrl(String primaryUrl, String seed) {
        // If we have a primary URL and it's not a placeholder, use it
        if (primaryUrl != null && !primaryUrl.trim().isEmpty() && !isPlaceholderAvatar(primaryUrl)) {
            return primaryUrl;
        }
        
        // Otherwise, generate a deterministic avatar from the seed
        return generateAvatarUrl(seed);
    }
}

package com.example.demo.config;

import com.example.demo.entity.UserProfile;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.factory.UserProfileDataFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private UserProfileDataFactory userProfileDataFactory;

    @Override
    public void run(String... args) throws Exception {
        // DataInitializer is disabled - data is now initialized through DatabaseFixer
        // This prevents conflicts with the new user/profile relationship
    }
    
    private void initializeUserProfiles() {
        List<UserProfile> profiles = userProfileDataFactory.createAllProfiles();
        userProfileRepository.saveAll(profiles);
        System.out.println("Demo user profiles initialized successfully! Total: " + profiles.size());
    }
}
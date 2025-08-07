package com.example.demo.controller;

import com.example.demo.entity.UserProfile;
import com.example.demo.entity.FounderProfile;
import com.example.demo.entity.AuthUser;
import com.example.demo.service.UserProfileService;
import com.example.demo.repository.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members") // Keep the same endpoint for backward compatibility
@CrossOrigin(originPatterns = "*")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;
    
    @Autowired
    private AuthUserRepository authUserRepository;

    @GetMapping
    public ResponseEntity<?> getAllProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> goals,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) List<String> interests) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfile> profiles;
        
        if ((search != null && !search.isEmpty()) || goals != null || skills != null || interests != null) {
            profiles = userProfileService.searchWithFilters(search, goals, skills, interests, pageable);
        } else {
            profiles = userProfileService.getAllProfiles(pageable);
        }
        
        // Return as list for backward compatibility
        return ResponseEntity.ok(profiles.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getProfileById(@PathVariable Long id) {
        Optional<UserProfile> profile = userProfileService.getProfileById(id);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfile> getProfileByUserId(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getProfileByUserId(userId);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfile profile) {
        UserProfile savedProfile = userProfileService.saveProfile(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {
        try {
            // Get the profile
            Optional<UserProfile> profileOpt = userProfileService.getProfileById(id);
            if (!profileOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            UserProfile profile = profileOpt.get();
            
            // Check authorization if authentication is present
            if (authentication != null) {
                String currentUsername = authentication.getName();
                AuthUser currentUser = authUserRepository.findByUsername(currentUsername).orElse(null);
                
                if (currentUser != null) {
                    // Check if user is updating their own profile or is an admin
                    boolean isOwner = profile.getUser() != null && profile.getUser().getId().equals(currentUser.getId());
                    boolean isAdmin = "ADMIN".equals(currentUser.getRole());
                    
                    if (!isOwner && !isAdmin) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                }
            }
            
            // Update allowed fields
            if (updates.containsKey("name")) {
                profile.setName((String) updates.get("name"));
            }
            if (updates.containsKey("location")) {
                profile.setLocation((String) updates.get("location"));
            }
            if (updates.containsKey("tagline")) {
                profile.setTagline((String) updates.get("tagline"));
            }
            if (updates.containsKey("goals")) {
                profile.setGoals((List<String>) updates.get("goals"));
            }
            if (updates.containsKey("interests")) {
                profile.setInterests((List<String>) updates.get("interests"));
            }
            if (updates.containsKey("skills")) {
                profile.setSkills((List<String>) updates.get("skills"));
            }
            
            // Update about section
            if (updates.containsKey("about")) {
                Map<String, Object> aboutData = (Map<String, Object>) updates.get("about");
                UserProfile.About about = profile.getAbout();
                if (about == null) {
                    about = new UserProfile.About();
                }
                
                if (aboutData.containsKey("shortDescription")) {
                    about.setShortDescription((String) aboutData.get("shortDescription"));
                }
                if (aboutData.containsKey("lookingFor")) {
                    about.setLookingFor((String) aboutData.get("lookingFor"));
                }
                if (aboutData.containsKey("offering")) {
                    about.setOffering((String) aboutData.get("offering"));
                }
                if (aboutData.containsKey("industries")) {
                    about.setIndustries((List<String>) aboutData.get("industries"));
                }
                if (aboutData.containsKey("languages")) {
                    about.setLanguages((List<String>) aboutData.get("languages"));
                }
                
                profile.setAbout(about);
            }
            
            // Save updated profile
            UserProfile updatedProfile = userProfileService.saveProfile(profile);
            return ResponseEntity.ok(updatedProfile);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        if (!userProfileService.getProfileById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        userProfileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserProfile>> searchProfiles(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfile> results = userProfileService.searchProfiles(query, pageable);
        return ResponseEntity.ok(results);
    }
    
    // Founder profile endpoints
    @PostMapping("/{profileId}/founder")
    public ResponseEntity<FounderProfile> createOrUpdateFounderProfile(
            @PathVariable Long profileId,
            @RequestBody FounderProfile founderProfile) {
        FounderProfile saved = userProfileService.createOrUpdateFounderProfile(profileId, founderProfile);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/founders/looking-for-cofounders")
    public ResponseEntity<Page<UserProfile>> getFoundersLookingForCofounders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfile> results = userProfileService.getFoundersLookingForCofounders(pageable);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/founders/looking-for-investors")
    public ResponseEntity<Page<UserProfile>> getFoundersLookingForInvestors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfile> results = userProfileService.getFoundersLookingForInvestors(pageable);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/investors")
    public ResponseEntity<Page<UserProfile>> getInvestorProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfile> results = userProfileService.getInvestorProfiles(pageable);
        return ResponseEntity.ok(results);
    }
}
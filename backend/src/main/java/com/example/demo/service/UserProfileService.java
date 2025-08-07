package com.example.demo.service;

import com.example.demo.entity.AuthUser;
import com.example.demo.entity.UserProfile;
import com.example.demo.entity.FounderProfile;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.FounderProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private AuthUserRepository authUserRepository;
    
    @Autowired
    private FounderProfileRepository founderProfileRepository;

    @Transactional(readOnly = true)
    public Page<UserProfile> getAllProfiles(Pageable pageable) {
        return userProfileRepository.findAll(pageable);
    }

    public Optional<UserProfile> getProfileById(Long id) {
        return userProfileRepository.findById(id);
    }
    
    public Optional<UserProfile> getProfileByUserId(Long userId) {
        return userProfileRepository.findByUserId(userId);
    }
    
    @Transactional
    public UserProfile createProfileForUser(AuthUser user) {
        // Check if profile already exists
        Optional<UserProfile> existing = userProfileRepository.findByUserId(user.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        
        // Create new profile
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setName(user.getFullName());
        profile.setAvatar("https://ui-avatars.com/api/?name=" + user.getFullName().replace(" ", "+"));
        profile.setLocation("Not specified");
        profile.setTagline("New member of Foundersbase");
        profile.setFollowers(0);
        profile.setRating(0.0);
        
        return userProfileRepository.save(profile);
    }

    @Transactional
    public UserProfile saveProfile(UserProfile profile) {
        return userProfileRepository.save(profile);
    }

    @Transactional
    public void deleteProfile(Long id) {
        userProfileRepository.deleteById(id);
    }

    public Page<UserProfile> searchProfiles(String query, Pageable pageable) {
        if (query == null || query.isEmpty()) {
            return userProfileRepository.findAll(pageable);
        }
        return userProfileRepository.searchProfiles(query, pageable);
    }

    public Page<UserProfile> searchWithFilters(String query, List<String> goals, 
                                               List<String> skills, List<String> interests, 
                                               Pageable pageable) {
        return userProfileRepository.searchWithFilters(query, goals, skills, interests, pageable);
    }
    
    @Transactional
    public FounderProfile createOrUpdateFounderProfile(Long userProfileId, FounderProfile founderData) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
            .orElseThrow(() -> new RuntimeException("User profile not found"));
        
        FounderProfile founderProfile = userProfile.getFounderProfile();
        if (founderProfile == null) {
            founderProfile = new FounderProfile();
            founderProfile.setUserProfile(userProfile);
        }
        
        // Update fields
        if (founderData.getMyIntroduction() != null) {
            founderProfile.setMyIntroduction(founderData.getMyIntroduction());
        }
        if (founderData.getMyMotivation() != null) {
            founderProfile.setMyMotivation(founderData.getMyMotivation());
        }
        if (founderData.getMyAchievement() != null) {
            founderProfile.setMyAchievement(founderData.getMyAchievement());
        }
        if (founderData.getMyCharacter() != null) {
            founderProfile.setMyCharacter(founderData.getMyCharacter());
        }
        if (founderData.getLookingForCofounder() != null) {
            founderProfile.setLookingForCofounder(founderData.getLookingForCofounder());
        }
        if (founderData.getLookingForInvestor() != null) {
            founderProfile.setLookingForInvestor(founderData.getLookingForInvestor());
        }
        if (founderData.getLookingForMentor() != null) {
            founderProfile.setLookingForMentor(founderData.getLookingForMentor());
        }
        if (founderData.getExpertiseAreas() != null) {
            founderProfile.setExpertiseAreas(founderData.getExpertiseAreas());
        }
        if (founderData.getYearsExperience() != null) {
            founderProfile.setYearsExperience(founderData.getYearsExperience());
        }
        if (founderData.getPreviousStartups() != null) {
            founderProfile.setPreviousStartups(founderData.getPreviousStartups());
        }
        
        return founderProfileRepository.save(founderProfile);
    }
    
    public Page<UserProfile> getFoundersLookingForCofounders(Pageable pageable) {
        return userProfileRepository.findFoundersLookingForCofounders(pageable);
    }
    
    public Page<UserProfile> getFoundersLookingForInvestors(Pageable pageable) {
        return userProfileRepository.findFoundersLookingForInvestors(pageable);
    }
    
    public Page<UserProfile> getInvestorProfiles(Pageable pageable) {
        return userProfileRepository.findInvestorProfiles(pageable);
    }
}
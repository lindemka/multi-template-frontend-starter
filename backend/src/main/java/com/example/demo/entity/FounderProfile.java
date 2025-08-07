package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "founder_profiles")
public class FounderProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false, unique = true)
    private UserProfile userProfile;

    @Column(name = "completeness")
    private Integer completeness = 0;

    @Column(name = "my_introduction", columnDefinition = "TEXT")
    private String myIntroduction;

    @Column(name = "my_motivation", columnDefinition = "TEXT")
    private String myMotivation;

    @Column(name = "my_achievement", columnDefinition = "TEXT")
    private String myAchievement;

    @Column(name = "my_character", columnDefinition = "TEXT")
    private String myCharacter;

    @Column(name = "looking_for_cofounder")
    private Boolean lookingForCofounder = false;

    @Column(name = "looking_for_investor")
    private Boolean lookingForInvestor = false;

    @Column(name = "looking_for_mentor")
    private Boolean lookingForMentor = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "founder_expertise_areas", joinColumns = @JoinColumn(name = "founder_profile_id"))
    @Column(name = "expertise_area")
    private List<String> expertiseAreas;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "previous_startups")
    private Integer previousStartups = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (completeness == null) completeness = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateCompleteness();
    }

    private void calculateCompleteness() {
        int score = 0;
        int total = 10;
        
        if (myIntroduction != null && !myIntroduction.isEmpty()) score++;
        if (myMotivation != null && !myMotivation.isEmpty()) score++;
        if (myAchievement != null && !myAchievement.isEmpty()) score++;
        if (myCharacter != null && !myCharacter.isEmpty()) score++;
        if (expertiseAreas != null && !expertiseAreas.isEmpty()) score++;
        if (yearsExperience != null && yearsExperience > 0) score++;
        if (previousStartups != null && previousStartups > 0) score++;
        if (lookingForCofounder != null) score++;
        if (lookingForInvestor != null) score++;
        if (lookingForMentor != null) score++;
        
        this.completeness = (score * 100) / total;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Integer getCompleteness() {
        return completeness;
    }

    public void setCompleteness(Integer completeness) {
        this.completeness = completeness;
    }

    public String getMyIntroduction() {
        return myIntroduction;
    }

    public void setMyIntroduction(String myIntroduction) {
        this.myIntroduction = myIntroduction;
    }

    public String getMyMotivation() {
        return myMotivation;
    }

    public void setMyMotivation(String myMotivation) {
        this.myMotivation = myMotivation;
    }

    public String getMyAchievement() {
        return myAchievement;
    }

    public void setMyAchievement(String myAchievement) {
        this.myAchievement = myAchievement;
    }

    public String getMyCharacter() {
        return myCharacter;
    }

    public void setMyCharacter(String myCharacter) {
        this.myCharacter = myCharacter;
    }

    public Boolean getLookingForCofounder() {
        return lookingForCofounder;
    }

    public void setLookingForCofounder(Boolean lookingForCofounder) {
        this.lookingForCofounder = lookingForCofounder;
    }

    public Boolean getLookingForInvestor() {
        return lookingForInvestor;
    }

    public void setLookingForInvestor(Boolean lookingForInvestor) {
        this.lookingForInvestor = lookingForInvestor;
    }

    public Boolean getLookingForMentor() {
        return lookingForMentor;
    }

    public void setLookingForMentor(Boolean lookingForMentor) {
        this.lookingForMentor = lookingForMentor;
    }

    public List<String> getExpertiseAreas() {
        return expertiseAreas;
    }

    public void setExpertiseAreas(List<String> expertiseAreas) {
        this.expertiseAreas = expertiseAreas;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public Integer getPreviousStartups() {
        return previousStartups;
    }

    public void setPreviousStartups(Integer previousStartups) {
        this.previousStartups = previousStartups;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
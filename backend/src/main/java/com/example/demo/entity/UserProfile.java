package com.example.demo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private AuthUser user;

    @Column(nullable = false)
    private String name;

    private String location;
    private String avatar;
    private Integer followers = 0;
    private Double rating = 0.0;
    private String tagline;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_profile_goals", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "goal")
    private List<String> goals;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_profile_interests", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "interest")
    private List<String> interests;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_profile_skills", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Embedded
    private Asset assets;

    private String status;

    @Embedded
    private About about;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private FounderProfile founderProfile;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private InvestorProfile investorProfile;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Embeddable
    public static class Asset {
        private String type;
        private String label;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }

    @Embeddable
    public static class About {
        @Column(length = 1000)
        private String shortDescription;

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "user_profile_industries", joinColumns = @JoinColumn(name = "user_profile_id"))
        @Column(name = "industry")
        private List<String> industries;

        @Column(length = 500)
        private String lookingFor;

        @Column(length = 500)
        private String offering;

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "user_profile_languages", joinColumns = @JoinColumn(name = "user_profile_id"))
        @Column(name = "language")
        private List<String> languages;

        public String getShortDescription() {
            return shortDescription;
        }

        public void setShortDescription(String shortDescription) {
            this.shortDescription = shortDescription;
        }

        public List<String> getIndustries() {
            return industries;
        }

        public void setIndustries(List<String> industries) {
            this.industries = industries;
        }

        public String getLookingFor() {
            return lookingFor;
        }

        public void setLookingFor(String lookingFor) {
            this.lookingFor = lookingFor;
        }

        public String getOffering() {
            return offering;
        }

        public void setOffering(String offering) {
            this.offering = offering;
        }

        public List<String> getLanguages() {
            return languages;
        }

        public void setLanguages(List<String> languages) {
            this.languages = languages;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthUser getUser() {
        return user;
    }

    public void setUser(AuthUser user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Integer getFollowers() {
        return followers;
    }

    public void setFollowers(Integer followers) {
        this.followers = followers;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public Asset getAssets() {
        return assets;
    }

    public void setAssets(Asset assets) {
        this.assets = assets;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public About getAbout() {
        return about;
    }

    public void setAbout(About about) {
        this.about = about;
    }

    public FounderProfile getFounderProfile() {
        return founderProfile;
    }

    public void setFounderProfile(FounderProfile founderProfile) {
        this.founderProfile = founderProfile;
    }

    public InvestorProfile getInvestorProfile() {
        return investorProfile;
    }

    public void setInvestorProfile(InvestorProfile investorProfile) {
        this.investorProfile = investorProfile;
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
    
    // Helper methods to determine profile types
    public boolean getIsFounder() {
        return founderProfile != null;
    }
    
    public boolean getIsInvestor() {
        return investorProfile != null;
    }
}
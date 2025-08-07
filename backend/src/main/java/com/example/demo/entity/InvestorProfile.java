package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "investor_profiles")
public class InvestorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false, unique = true)
    private UserProfile userProfile;

    @Column(name = "completeness")
    private Integer completeness = 0;

    @Column(name = "investment_focus", columnDefinition = "TEXT")
    private String investmentFocus;

    @Column(name = "investment_experience", columnDefinition = "TEXT")
    private String investmentExperience;

    @Column(name = "investor_introduction", columnDefinition = "TEXT")
    private String investorIntroduction;

    @Column(name = "investment_range_min")
    private BigDecimal investmentRangeMin;

    @Column(name = "investment_range_max")
    private BigDecimal investmentRangeMax;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "investor_preferred_stages", joinColumns = @JoinColumn(name = "investor_profile_id"))
    @Column(name = "stage")
    private List<String> preferredStages;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "investor_preferred_industries", joinColumns = @JoinColumn(name = "investor_profile_id"))
    @Column(name = "industry")
    private List<String> preferredIndustries;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "investor_portfolio_companies", joinColumns = @JoinColumn(name = "investor_profile_id"))
    @Column(name = "company")
    private List<String> portfolioCompanies;

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
        int total = 8;
        
        if (investmentFocus != null && !investmentFocus.isEmpty()) score++;
        if (investmentExperience != null && !investmentExperience.isEmpty()) score++;
        if (investorIntroduction != null && !investorIntroduction.isEmpty()) score++;
        if (investmentRangeMin != null) score++;
        if (investmentRangeMax != null) score++;
        if (preferredStages != null && !preferredStages.isEmpty()) score++;
        if (preferredIndustries != null && !preferredIndustries.isEmpty()) score++;
        if (portfolioCompanies != null && !portfolioCompanies.isEmpty()) score++;
        
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

    public String getInvestmentFocus() {
        return investmentFocus;
    }

    public void setInvestmentFocus(String investmentFocus) {
        this.investmentFocus = investmentFocus;
    }

    public String getInvestmentExperience() {
        return investmentExperience;
    }

    public void setInvestmentExperience(String investmentExperience) {
        this.investmentExperience = investmentExperience;
    }

    public String getInvestorIntroduction() {
        return investorIntroduction;
    }

    public void setInvestorIntroduction(String investorIntroduction) {
        this.investorIntroduction = investorIntroduction;
    }

    public BigDecimal getInvestmentRangeMin() {
        return investmentRangeMin;
    }

    public void setInvestmentRangeMin(BigDecimal investmentRangeMin) {
        this.investmentRangeMin = investmentRangeMin;
    }

    public BigDecimal getInvestmentRangeMax() {
        return investmentRangeMax;
    }

    public void setInvestmentRangeMax(BigDecimal investmentRangeMax) {
        this.investmentRangeMax = investmentRangeMax;
    }

    public List<String> getPreferredStages() {
        return preferredStages;
    }

    public void setPreferredStages(List<String> preferredStages) {
        this.preferredStages = preferredStages;
    }

    public List<String> getPreferredIndustries() {
        return preferredIndustries;
    }

    public void setPreferredIndustries(List<String> preferredIndustries) {
        this.preferredIndustries = preferredIndustries;
    }

    public List<String> getPortfolioCompanies() {
        return portfolioCompanies;
    }

    public void setPortfolioCompanies(List<String> portfolioCompanies) {
        this.portfolioCompanies = portfolioCompanies;
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
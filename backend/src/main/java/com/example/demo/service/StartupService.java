package com.example.demo.service;

import com.example.demo.entity.AuthUser;
import com.example.demo.entity.Startup;
import com.example.demo.entity.StartupMember;
import com.example.demo.repository.AuthUserRepository;
import com.example.demo.repository.StartupRepository;
import com.example.demo.repository.StartupMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class StartupService {

    @Autowired
    private StartupRepository startupRepository;
    
    @Autowired
    private StartupMemberRepository startupMemberRepository;
    
    @Autowired
    private AuthUserRepository authUserRepository;

    public Page<Startup> getAllStartups(Pageable pageable) {
        return startupRepository.findAll(pageable);
    }

    public Optional<Startup> getStartupById(Long id) {
        return startupRepository.findById(id);
    }
    
    public List<Startup> getUserStartups(Long userId) {
        return startupRepository.findByUserId(userId);
    }

    @Transactional
    public Startup createStartup(Startup startup, Long founderId) {
        // Save the startup first
        Startup savedStartup = startupRepository.save(startup);
        
        // Add founder as first member
        AuthUser founder = authUserRepository.findById(founderId)
            .orElseThrow(() -> new RuntimeException("Founder user not found"));
        
        StartupMember founderMember = new StartupMember();
        founderMember.setStartup(savedStartup);
        founderMember.setUser(founder);
        founderMember.setRole("Founder");
        founderMember.setEquityPercentage(new BigDecimal("100.00")); // Initially 100%
        founderMember.setIsActive(true);
        
        startupMemberRepository.save(founderMember);
        
        return savedStartup;
    }

    @Transactional
    public Startup updateStartup(Long id, Startup updatedStartup) {
        Startup existing = startupRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Startup not found"));
        
        // Update fields
        if (updatedStartup.getName() != null) {
            existing.setName(updatedStartup.getName());
        }
        if (updatedStartup.getTagline() != null) {
            existing.setTagline(updatedStartup.getTagline());
        }
        if (updatedStartup.getDescription() != null) {
            existing.setDescription(updatedStartup.getDescription());
        }
        if (updatedStartup.getLogoUrl() != null) {
            existing.setLogoUrl(updatedStartup.getLogoUrl());
        }
        if (updatedStartup.getWebsite() != null) {
            existing.setWebsite(updatedStartup.getWebsite());
        }
        if (updatedStartup.getFoundedDate() != null) {
            existing.setFoundedDate(updatedStartup.getFoundedDate());
        }
        if (updatedStartup.getStage() != null) {
            existing.setStage(updatedStartup.getStage());
        }
        if (updatedStartup.getIndustry() != null) {
            existing.setIndustry(updatedStartup.getIndustry());
        }
        if (updatedStartup.getTeamSize() != null) {
            existing.setTeamSize(updatedStartup.getTeamSize());
        }
        if (updatedStartup.getLocation() != null) {
            existing.setLocation(updatedStartup.getLocation());
        }
        if (updatedStartup.getIsHiring() != null) {
            existing.setIsHiring(updatedStartup.getIsHiring());
        }
        if (updatedStartup.getIsFundraising() != null) {
            existing.setIsFundraising(updatedStartup.getIsFundraising());
        }
        if (updatedStartup.getFundingAmount() != null) {
            existing.setFundingAmount(updatedStartup.getFundingAmount());
        }
        if (updatedStartup.getRevenueRange() != null) {
            existing.setRevenueRange(updatedStartup.getRevenueRange());
        }
        if (updatedStartup.getProductStatus() != null) {
            existing.setProductStatus(updatedStartup.getProductStatus());
        }
        if (updatedStartup.getAchievements() != null) {
            existing.setAchievements(updatedStartup.getAchievements());
        }
        
        return startupRepository.save(existing);
    }

    @Transactional
    public void deleteStartup(Long id) {
        startupRepository.deleteById(id);
    }

    @Transactional
    public StartupMember addMember(Long startupId, Long userId, String role, BigDecimal equity) {
        Startup startup = startupRepository.findById(startupId)
            .orElseThrow(() -> new RuntimeException("Startup not found"));
        
        AuthUser user = authUserRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already a member
        if (startupMemberRepository.existsByStartupIdAndUserId(startupId, userId)) {
            throw new RuntimeException("User is already a member of this startup");
        }
        
        StartupMember member = new StartupMember();
        member.setStartup(startup);
        member.setUser(user);
        member.setRole(role);
        member.setEquityPercentage(equity);
        member.setIsActive(true);
        
        return startupMemberRepository.save(member);
    }

    @Transactional
    public StartupMember updateMember(Long memberId, String role, BigDecimal equity) {
        StartupMember member = startupMemberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        if (role != null) {
            member.setRole(role);
        }
        if (equity != null) {
            member.setEquityPercentage(equity);
        }
        
        return startupMemberRepository.save(member);
    }

    @Transactional
    public void removeMember(Long startupId, Long userId) {
        StartupMember member = startupMemberRepository.findByStartupIdAndUserId(startupId, userId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        member.setIsActive(false);
        startupMemberRepository.save(member);
    }

    public List<StartupMember> getStartupMembers(Long startupId) {
        return startupMemberRepository.findByStartupId(startupId);
    }

    public Page<Startup> searchStartups(String query, Pageable pageable) {
        if (query == null || query.isEmpty()) {
            return startupRepository.findAll(pageable);
        }
        return startupRepository.searchStartups(query, pageable);
    }

    public Page<Startup> getHiringStartups(Pageable pageable) {
        return startupRepository.findByIsHiring(true, pageable);
    }

    public Page<Startup> getFundraisingStartups(Pageable pageable) {
        return startupRepository.findByIsFundraising(true, pageable);
    }
}
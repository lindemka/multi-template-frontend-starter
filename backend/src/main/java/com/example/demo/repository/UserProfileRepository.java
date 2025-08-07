package com.example.demo.repository;

import com.example.demo.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    Optional<UserProfile> findByUserId(Long userId);
    
    @Query("SELECT up FROM UserProfile up LEFT JOIN FETCH up.founderProfile WHERE up.id = :id")
    Optional<UserProfile> findByIdWithFounderProfile(@Param("id") Long id);
    
    @Query("SELECT up FROM UserProfile up LEFT JOIN FETCH up.investorProfile WHERE up.id = :id")
    Optional<UserProfile> findByIdWithInvestorProfile(@Param("id") Long id);
    
    // Search queries
    @Query("SELECT up FROM UserProfile up WHERE " +
           "LOWER(up.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(up.tagline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(up.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<UserProfile> searchProfiles(@Param("query") String query, Pageable pageable);
    
    // Filter by goals
    @Query("SELECT DISTINCT up FROM UserProfile up JOIN up.goals g WHERE g IN :goals")
    Page<UserProfile> findByGoalsIn(@Param("goals") List<String> goals, Pageable pageable);
    
    // Filter by skills
    @Query("SELECT DISTINCT up FROM UserProfile up JOIN up.skills s WHERE s IN :skills")
    Page<UserProfile> findBySkillsIn(@Param("skills") List<String> skills, Pageable pageable);
    
    // Filter by interests
    @Query("SELECT DISTINCT up FROM UserProfile up JOIN up.interests i WHERE i IN :interests")
    Page<UserProfile> findByInterestsIn(@Param("interests") List<String> interests, Pageable pageable);
    
    // Combined search with filters
    @Query("SELECT DISTINCT up FROM UserProfile up " +
           "LEFT JOIN up.goals g " +
           "LEFT JOIN up.skills s " +
           "LEFT JOIN up.interests i " +
           "WHERE (:query IS NULL OR :query = '' OR " +
           "       LOWER(up.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(up.tagline) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:goals IS NULL OR g IN :goals) " +
           "AND (:skills IS NULL OR s IN :skills) " +
           "AND (:interests IS NULL OR i IN :interests)")
    Page<UserProfile> searchWithFilters(@Param("query") String query,
                                        @Param("goals") List<String> goals,
                                        @Param("skills") List<String> skills,
                                        @Param("interests") List<String> interests,
                                        Pageable pageable);
    
    // Get profiles with founder profiles looking for co-founders
    @Query("SELECT up FROM UserProfile up JOIN up.founderProfile fp WHERE fp.lookingForCofounder = true")
    Page<UserProfile> findFoundersLookingForCofounders(Pageable pageable);
    
    // Get profiles with founder profiles looking for investors
    @Query("SELECT up FROM UserProfile up JOIN up.founderProfile fp WHERE fp.lookingForInvestor = true")
    Page<UserProfile> findFoundersLookingForInvestors(Pageable pageable);
    
    // Get investor profiles
    @Query("SELECT up FROM UserProfile up WHERE up.investorProfile IS NOT NULL")
    Page<UserProfile> findInvestorProfiles(Pageable pageable);
}
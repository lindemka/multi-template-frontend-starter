package com.example.demo.repository;

import com.example.demo.entity.Startup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StartupRepository extends JpaRepository<Startup, Long> {
    
    Page<Startup> findByIsHiring(Boolean isHiring, Pageable pageable);
    
    Page<Startup> findByIsFundraising(Boolean isFundraising, Pageable pageable);
    
    @Query("SELECT s FROM Startup s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.tagline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Startup> searchStartups(@Param("query") String query, Pageable pageable);
    
    Page<Startup> findByStage(String stage, Pageable pageable);
    
    Page<Startup> findByIndustry(String industry, Pageable pageable);
    
    @Query("SELECT DISTINCT s FROM Startup s JOIN s.members m WHERE m.user.id = :userId")
    List<Startup> findByUserId(@Param("userId") Long userId);
}
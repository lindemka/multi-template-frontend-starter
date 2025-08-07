package com.example.demo.repository;

import com.example.demo.entity.FounderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FounderProfileRepository extends JpaRepository<FounderProfile, Long> {
    Optional<FounderProfile> findByUserProfileId(Long userProfileId);
}
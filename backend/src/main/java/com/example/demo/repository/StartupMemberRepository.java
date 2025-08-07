package com.example.demo.repository;

import com.example.demo.entity.StartupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StartupMemberRepository extends JpaRepository<StartupMember, Long> {
    List<StartupMember> findByStartupId(Long startupId);
    List<StartupMember> findByUserId(Long userId);
    Optional<StartupMember> findByStartupIdAndUserId(Long startupId, Long userId);
    boolean existsByStartupIdAndUserId(Long startupId, Long userId);
}
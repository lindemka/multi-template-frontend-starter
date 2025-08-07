package com.example.demo.service;

import com.example.demo.entity.Member;
import com.example.demo.factory.MemberDataFactory;
import com.example.demo.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Profile("postgres")
public class MigrationService {
    
    private static final Logger logger = LoggerFactory.getLogger(MigrationService.class);
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private MemberDataFactory memberDataFactory;
    
    @PostConstruct
    @Transactional
    public void migrateData() {
        try {
            long currentCount = memberRepository.count();
            
            if (shouldSkipMigration(currentCount)) {
                logger.info("Migration skipped. {} members already exist in database.", currentCount);
                return;
            }
            
            if (shouldClearAndReload(currentCount)) {
                logger.info("Found {} members. Clearing and reloading data...", currentCount);
                memberRepository.deleteAll();
            } else {
                logger.info("Starting fresh data migration to PostgreSQL...");
            }
            
            performMigration();
            
        } catch (Exception e) {
            logger.error("Migration failed: ", e);
            throw new RuntimeException("Data migration failed", e);
        }
    }
    
    private boolean shouldSkipMigration(long currentCount) {
        return currentCount == getExpectedMemberCount();
    }
    
    private boolean shouldClearAndReload(long currentCount) {
        return currentCount > 0 && currentCount != getExpectedMemberCount();
    }
    
    private void performMigration() {
        List<Member> members = memberDataFactory.createAllMembers();
        memberRepository.saveAll(members);
        logger.info("Successfully migrated {} members to database.", members.size());
    }
    
    private int getExpectedMemberCount() {
        return 25; // This could be made configurable
    }
}
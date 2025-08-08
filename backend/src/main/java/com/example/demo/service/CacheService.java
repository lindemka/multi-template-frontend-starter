package com.example.demo.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

/**
 * Centralized cache management service
 */
@Service
@Slf4j
public class CacheService {

    @CacheEvict(value = {"users", "profiles", "members"}, allEntries = true)
    public void evictUserCaches() {
        log.debug("Evicting all user-related caches");
    }

    @CacheEvict(value = "startups", allEntries = true)
    public void evictStartupCache() {
        log.debug("Evicting startup cache");
    }

    @CacheEvict(value = "searchResults", allEntries = true)
    public void evictSearchCache() {
        log.debug("Evicting search cache");
    }

    @CacheEvict(allEntries = true, value = {
        "users", "profiles", "members", 
        "startups", "searchResults"
    })
    public void evictAllCaches() {
        log.info("Evicting all application caches");
    }

    /**
     * Warm up caches on application startup
     */
    public void warmUpCaches() {
        log.info("Warming up caches...");
        // This would be called on startup to pre-populate caches
        // Implementation depends on specific needs
    }
}
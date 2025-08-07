package com.example.demo.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    @Profile("!production")
    public CacheManager simpleCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("members"),
            new ConcurrentMapCache("memberDetails"),
            new ConcurrentMapCache("filters"),
            new ConcurrentMapCache("searchResults")
        ));
        return cacheManager;
    }
    
    // Production cache configuration would use Redis or Caffeine
    // Configured through application.yml
}
package com.example.demo.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key, int capacity, Duration refillDuration) {
        return buckets.computeIfAbsent(key, k -> Bucket.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.greedy(capacity, refillDuration)))
                .build());
    }
}



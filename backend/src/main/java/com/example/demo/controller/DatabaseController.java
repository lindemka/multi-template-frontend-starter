package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db")
@CrossOrigin(originPatterns = "*")
public class DatabaseController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/reset")
    public Map<String, Object> resetDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Read the reset script
            String sql = Files.readString(Paths.get("reset_and_init_db.sql"));
            
            // Split by semicolons and execute each statement
            String[] statements = sql.split(";");
            int executed = 0;
            
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    try {
                        jdbcTemplate.execute(statement);
                        executed++;
                    } catch (Exception e) {
                        // Log but continue - some statements might fail if objects don't exist
                        System.err.println("Statement failed (continuing): " + e.getMessage());
                    }
                }
            }
            
            response.put("success", true);
            response.put("statementsExecuted", executed);
            response.put("message", "Database reset and initialized successfully");
            
            // Get counts
            Map<String, Integer> counts = new HashMap<>();
            counts.put("users", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class));
            counts.put("userProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_profiles", Integer.class));
            counts.put("startups", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startups", Integer.class));
            counts.put("founderProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM founder_profiles", Integer.class));
            counts.put("investorProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM investor_profiles", Integer.class));
            response.put("counts", counts);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @GetMapping("/status")
    public Map<String, Object> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            Map<String, Integer> counts = new HashMap<>();
            counts.put("users", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class));
            counts.put("userProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_profiles", Integer.class));
            counts.put("startups", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startups", Integer.class));
            counts.put("founderProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM founder_profiles", Integer.class));
            counts.put("investorProfiles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM investor_profiles", Integer.class));
            counts.put("startupMembers", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startup_members", Integer.class));
            
            status.put("connected", true);
            status.put("counts", counts);
        } catch (Exception e) {
            status.put("connected", false);
            status.put("error", e.getMessage());
        }
        
        return status;
    }
}
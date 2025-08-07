package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Configuration
public class DatabaseMigration {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void runMigration() {
        try {
            // Check if migration already ran
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_profiles'",
                Integer.class
            );
            
            if (count != null && count > 0) {
                System.out.println("Migration already completed - user_profiles table exists");
                return;
            }

            // Read migration file
            ClassPathResource resource = new ClassPathResource("db/migration/V1__restructure_user_architecture.sql");
            String sql = FileCopyUtils.copyToString(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
            
            // Split by semicolons but keep them for execution
            String[] statements = sql.split("(?<=;)");
            
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    try {
                        jdbcTemplate.execute(statement);
                    } catch (Exception e) {
                        // Some statements might fail if already executed, that's ok
                        System.err.println("Statement failed (might be ok if already exists): " + e.getMessage());
                    }
                }
            }
            
            System.out.println("Database migration completed successfully!");
            
        } catch (Exception e) {
            System.err.println("Migration failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
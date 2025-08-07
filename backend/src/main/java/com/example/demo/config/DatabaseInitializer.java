package com.example.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DatabaseInitializer {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private DataSource dataSource;
    
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            try {
                logger.info("Checking database initialization status...");
                
                // Check if data already exists
                Integer userCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users", Integer.class
                );
                
                if (userCount != null && userCount > 0) {
                    logger.info("Database already initialized with {} users", userCount);
                    logDatabaseStatus();
                    return;
                }
                
                logger.info("Initializing database with sample data...");
                
                // Execute the initialization script
                try (Connection connection = dataSource.getConnection()) {
                    ScriptUtils.executeSqlScript(
                        connection,
                        new ClassPathResource("db/init/sample_data.sql")
                    );
                }
                
                logger.info("Database initialization completed successfully!");
                logDatabaseStatus();
                
            } catch (Exception e) {
                logger.error("Error during database initialization: {}", e.getMessage());
                // Don't fail the application startup
            }
        };
    }
    
    private void logDatabaseStatus() {
        try {
            Integer users = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            Integer profiles = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_profiles", Integer.class);
            Integer startups = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startups", Integer.class);
            Integer founders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM founder_profiles", Integer.class);
            Integer investors = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM investor_profiles", Integer.class);
            
            logger.info("Database Status:");
            logger.info("  - Users: {}", users);
            logger.info("  - User Profiles: {}", profiles);
            logger.info("  - Startups: {}", startups);
            logger.info("  - Founder Profiles: {}", founders);
            logger.info("  - Investor Profiles: {}", investors);
        } catch (Exception e) {
            logger.error("Error getting database status: {}", e.getMessage());
        }
    }
}
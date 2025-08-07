package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseFixer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseFixer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixDatabase() {
        try {
            logger.info("Starting database fix...");
            
            // Fix null values in users table
            int usersFixed = jdbcTemplate.update(
                "UPDATE users SET username = email WHERE username IS NULL"
            );
            logger.info("Fixed {} users with null username", usersFixed);
            
            jdbcTemplate.update(
                "UPDATE users SET password = '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.' WHERE password IS NULL"
            );
            
            jdbcTemplate.update(
                "UPDATE users SET first_name = split_part(email, '@', 1) WHERE first_name IS NULL"
            );
            
            jdbcTemplate.update(
                "UPDATE users SET last_name = 'User' WHERE last_name IS NULL"
            );
            
            jdbcTemplate.update(
                "UPDATE users SET enabled = true WHERE enabled IS NULL"
            );
            
            jdbcTemplate.update(
                "UPDATE users SET role = 'USER' WHERE role IS NULL"
            );
            
            // Create user profiles for users without one
            int profilesCreated = jdbcTemplate.update(
                "INSERT INTO user_profiles (user_id, name, location, avatar, tagline, followers, rating, created_at, updated_at) " +
                "SELECT u.id, " +
                "       COALESCE(u.first_name || ' ' || u.last_name, u.username), " +
                "       'Not specified', " +
                "       'https://ui-avatars.com/api/?name=' || REPLACE(COALESCE(u.first_name || ' ' || u.last_name, u.username), ' ', '+'), " +
                "       'Member of Foundersbase', " +
                "       0, " +
                "       0.0, " +
                "       NOW(), " +
                "       NOW() " +
                "FROM users u " +
                "LEFT JOIN user_profiles up ON u.id = up.user_id " +
                "WHERE up.id IS NULL"
            );
            logger.info("Created {} user profiles", profilesCreated);
            
            // Check if startups exist
            Integer startupCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM startups", Integer.class
            );
            
            if (startupCount == 0) {
                // Insert sample startups
                jdbcTemplate.update(
                    "INSERT INTO startups (name, tagline, description, stage, industry, team_size, location, is_hiring, is_fundraising, created_at, updated_at) VALUES " +
                    "('TechVenture', 'Building the future of AI', 'An AI-powered platform for startup innovation', 'mvp', 'Technology', 3, 'San Francisco, CA', true, true, NOW(), NOW()), " +
                    "('GreenTech Solutions', 'Sustainable technology for tomorrow', 'Environmental monitoring and optimization platform', 'revenue', 'CleanTech', 5, 'Berlin, Germany', true, false, NOW(), NOW()), " +
                    "('HealthFlow', 'Revolutionizing patient care', 'Digital health platform connecting patients with providers', 'growth', 'Healthcare', 12, 'Boston, MA', true, true, NOW(), NOW())"
                );
                logger.info("Created 3 sample startups");
                
                // Add startup members
                jdbcTemplate.update(
                    "INSERT INTO startup_members (startup_id, user_id, role, equity_percentage, joined_date, is_active, created_at) " +
                    "SELECT s.id, u.id, 'Founder', 40.00, CURRENT_DATE, true, NOW() " +
                    "FROM startups s " +
                    "CROSS JOIN (SELECT id FROM users LIMIT 1) u " +
                    "WHERE s.name = 'TechVenture' " +
                    "ON CONFLICT (startup_id, user_id) DO NOTHING"
                );
                logger.info("Added startup members");
            }
            
            // Create sample founder profiles
            Integer founderCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM founder_profiles", Integer.class
            );
            
            if (founderCount == 0) {
                jdbcTemplate.update(
                    "INSERT INTO founder_profiles (user_profile_id, my_introduction, my_motivation, looking_for_cofounder, looking_for_investor, years_experience, created_at, updated_at) " +
                    "SELECT up.id, " +
                    "       'Passionate entrepreneur building innovative solutions', " +
                    "       'To create technology that makes a real difference', " +
                    "       true, " +
                    "       true, " +
                    "       5, " +
                    "       NOW(), " +
                    "       NOW() " +
                    "FROM user_profiles up " +
                    "LIMIT 2 " +
                    "ON CONFLICT (user_profile_id) DO NOTHING"
                );
                logger.info("Created sample founder profiles");
            }
            
            // Log table counts
            logger.info("Database status:");
            logger.info("- Users: {}", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class));
            logger.info("- User Profiles: {}", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_profiles", Integer.class));
            logger.info("- Startups: {}", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startups", Integer.class));
            logger.info("- Startup Members: {}", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM startup_members", Integer.class));
            logger.info("- Founder Profiles: {}", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM founder_profiles", Integer.class));
            
        } catch (Exception e) {
            logger.error("Error fixing database: ", e);
        }
    }
}
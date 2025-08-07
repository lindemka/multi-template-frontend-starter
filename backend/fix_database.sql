-- Fix database issues and populate with test data

-- First, let's see what tables we have
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Fix null values in users table
UPDATE users SET username = email WHERE username IS NULL;
UPDATE users SET password = '$2a$10$defaultPasswordHash' WHERE password IS NULL;
UPDATE users SET first_name = split_part(email, '@', 1) WHERE first_name IS NULL;
UPDATE users SET last_name = 'User' WHERE last_name IS NULL;
UPDATE users SET enabled = true WHERE enabled IS NULL;
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Add NOT NULL constraints only after fixing nulls
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- Check if we have any users
SELECT id, username, email, first_name, last_name FROM users;

-- Check user_profiles table
SELECT COUNT(*) as profile_count FROM user_profiles;

-- Create user profiles for users that don't have one
INSERT INTO user_profiles (user_id, name, location, avatar, tagline, followers, rating, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(u.first_name || ' ' || u.last_name, u.username),
    'Not specified',
    'https://ui-avatars.com/api/?name=' || REPLACE(COALESCE(u.first_name || ' ' || u.last_name, u.username), ' ', '+'),
    'Member of Foundersbase',
    0,
    0.0,
    NOW(),
    NOW()
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.id IS NULL;

-- Insert sample startups
INSERT INTO startups (name, tagline, description, stage, industry, team_size, location, is_hiring, is_fundraising, created_at, updated_at)
VALUES 
    ('TechVenture', 'Building the future of AI', 'An AI-powered platform for startup innovation', 'mvp', 'Technology', 3, 'San Francisco, CA', true, true, NOW(), NOW()),
    ('GreenTech Solutions', 'Sustainable technology for tomorrow', 'Environmental monitoring and optimization platform', 'revenue', 'CleanTech', 5, 'Berlin, Germany', true, false, NOW(), NOW()),
    ('HealthFlow', 'Revolutionizing patient care', 'Digital health platform connecting patients with providers', 'growth', 'Healthcare', 12, 'Boston, MA', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add some users as startup members
INSERT INTO startup_members (startup_id, user_id, role, equity_percentage, joined_date, is_active, created_at)
SELECT 
    s.id,
    u.id,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY u.id) = 1 THEN 'Founder'
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY u.id) = 2 THEN 'Co-Founder'
        ELSE 'Team Member'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY u.id) = 1 THEN 40.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY u.id) = 2 THEN 30.00
        ELSE 10.00
    END,
    CURRENT_DATE,
    true,
    NOW()
FROM startups s
CROSS JOIN (SELECT id FROM users LIMIT 3) u
WHERE s.name = 'TechVenture'
ON CONFLICT (startup_id, user_id) DO NOTHING;

-- Create some founder profiles
INSERT INTO founder_profiles (user_profile_id, my_introduction, my_motivation, looking_for_cofounder, looking_for_investor, years_experience, created_at, updated_at)
SELECT 
    up.id,
    'Passionate entrepreneur building innovative solutions',
    'To create technology that makes a real difference',
    true,
    true,
    5,
    NOW(),
    NOW()
FROM user_profiles up
LIMIT 2
ON CONFLICT (user_profile_id) DO NOTHING;

-- Check the data
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'User Profiles:', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'Startups:', COUNT(*) FROM startups
UNION ALL
SELECT 'Startup Members:', COUNT(*) FROM startup_members
UNION ALL
SELECT 'Founder Profiles:', COUNT(*) FROM founder_profiles;
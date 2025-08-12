-- PostgreSQL verification queries for the current database structure
-- Run these queries in your PostgreSQL client to verify the database state

-- Connect to the database
-- \c sitedb;

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count users and profiles
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_user_profiles FROM user_profiles;

-- View first 5 user profiles
SELECT up.id, up.name, up.location, up.followers, up.rating, up.tagline, u.username, u.email
FROM user_profiles up
JOIN users u ON up.user_id = u.id
LIMIT 5;

-- Check startup members
SELECT u.username, u.first_name, u.last_name, sm.role, s.name as startup_name
FROM startup_members sm
JOIN users u ON sm.user_id = u.id
JOIN startups s ON sm.startup_id = s.id
LIMIT 10;

-- Search user profiles by location
SELECT up.name, up.location, up.tagline 
FROM user_profiles up
WHERE location LIKE '%US%';

-- High-rated user profiles (rating >= 4.8)
SELECT up.name, up.rating, up.followers, up.tagline 
FROM user_profiles up
WHERE rating >= 4.8 
ORDER BY rating DESC, followers DESC;

-- Check founder profiles
SELECT fp.id, up.name, fp.looking_for_cofounder, fp.looking_for_investor
FROM founder_profiles fp
JOIN user_profiles up ON fp.user_profile_id = up.id
LIMIT 5;

-- Check investor profiles
SELECT ip.id, up.name, ip.investment_focus, ip.typical_investment_size
FROM investor_profiles ip
JOIN user_profiles up ON ip.user_profile_id = up.id
LIMIT 5;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'startups', COUNT(*) FROM startups
UNION ALL
SELECT 'startup_members', COUNT(*) FROM startup_members
UNION ALL
SELECT 'founder_profiles', COUNT(*) FROM founder_profiles
UNION ALL
SELECT 'investor_profiles', COUNT(*) FROM investor_profiles
UNION ALL
SELECT 'chat_conversations', COUNT(*) FROM chat_conversations
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages;
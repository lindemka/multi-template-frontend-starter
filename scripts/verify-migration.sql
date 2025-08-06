-- PostgreSQL verification queries for the migrated data
-- Run these queries in your PostgreSQL client to verify the migration

-- Connect to the database
-- \c project1;

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count members
SELECT COUNT(*) as total_members FROM members;

-- View first 5 members
SELECT id, name, location, followers, rating, tagline 
FROM members 
LIMIT 5;

-- Check member goals
SELECT m.name, mg.goal 
FROM members m 
JOIN member_goals mg ON m.id = mg.member_id 
LIMIT 10;

-- Check member skills
SELECT m.name, ms.skill 
FROM members m 
JOIN member_skills ms ON m.id = ms.member_id 
LIMIT 10;

-- Search members by location
SELECT name, location, tagline 
FROM members 
WHERE location LIKE '%US%';

-- Members with assets (startups, VC funds, etc.)
SELECT name, assets_type, assets_label, status 
FROM members 
WHERE assets_type IS NOT NULL;

-- High-rated members (rating >= 4.8)
SELECT name, rating, followers, tagline 
FROM members 
WHERE rating >= 4.8 
ORDER BY rating DESC, followers DESC;
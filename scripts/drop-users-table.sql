-- Script to document the current table architecture
-- Note: This script is for documentation purposes only
-- 
-- Current architecture:
-- - users table: Main authentication table (formerly auth_users)
-- - user_profiles table: Extended user profiles (replaced old members table)
-- - startup_members table: Junction table linking users to startups
--
-- The old "members" table has been migrated to "user_profiles" 
-- and should no longer exist in the database.

-- Check current table structure
SELECT table_name, 
       CASE 
           WHEN table_name = 'users' THEN 'Authentication and basic user info'
           WHEN table_name = 'user_profiles' THEN 'Extended user profiles (replaced members)'
           WHEN table_name = 'startup_members' THEN 'Links users to startups with roles'
           WHEN table_name = 'startups' THEN 'Startup entities'
           WHEN table_name = 'founder_profiles' THEN 'Founder-specific profiles'
           WHEN table_name = 'investor_profiles' THEN 'Investor-specific profiles'
           ELSE 'Other'
       END as purpose
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'user_profiles', 'startup_members', 'startups', 'founder_profiles', 'investor_profiles')
ORDER BY table_name;
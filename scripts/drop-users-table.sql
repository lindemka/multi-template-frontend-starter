-- Script to drop the obsolete users table
-- This table is being removed as we're using auth_users for authentication
-- and members for platform member profiles

-- Drop the users table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Verify the table has been dropped
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'users';

-- List remaining tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
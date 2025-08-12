-- Check current database schema and identify outdated tables

-- List all tables in the database
SELECT 
    'Current tables in database:' as info;

SELECT 
    table_name,
    CASE 
        WHEN table_name = 'members' THEN 'OUTDATED - migrated to user_profiles'
        WHEN table_name = 'member_goals' THEN 'OUTDATED - related to old members table'
        WHEN table_name = 'member_skills' THEN 'OUTDATED - related to old members table'
        WHEN table_name = 'user_profiles' THEN 'ACTIVE - current user profile storage'
        WHEN table_name = 'users' THEN 'ACTIVE - authentication and user accounts'
        WHEN table_name = 'startups' THEN 'ACTIVE - startup entities'
        WHEN table_name = 'startup_members' THEN 'ACTIVE - links users to startups'
        WHEN table_name = 'founder_profiles' THEN 'ACTIVE - founder-specific profiles'
        WHEN table_name = 'investor_profiles' THEN 'ACTIVE - investor-specific profiles'
        WHEN table_name = 'chat_conversations' THEN 'ACTIVE - chat system'
        WHEN table_name = 'chat_messages' THEN 'ACTIVE - chat system'
        WHEN table_name = 'refresh_tokens' THEN 'ACTIVE - authentication tokens'
        WHEN table_name = 'email_verification_tokens' THEN 'ACTIVE - email verification'
        WHEN table_name = 'password_reset_tokens' THEN 'ACTIVE - password reset'
        WHEN table_name = 'email_change_requests' THEN 'ACTIVE - email change requests'
        WHEN table_name LIKE 'flyway%' THEN 'SYSTEM - migration tracking'
        ELSE 'UNKNOWN - needs review'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY 
    CASE 
        WHEN table_name = 'members' THEN 0
        WHEN table_name LIKE 'member_%' THEN 1
        ELSE 2
    END,
    table_name;

-- Check if members table exists
SELECT 
    '',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'members'
        ) 
        THEN 'WARNING: "members" table still exists and should be removed!' 
        ELSE 'OK: "members" table has been removed' 
    END as members_status;

-- Check for member_* tables
SELECT 
    '',
    'Checking for related member_* tables:' as info;

SELECT 
    table_name as "Outdated member_* tables found"
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE 'member_%'
ORDER BY table_name;

-- Count records in potentially outdated tables
SELECT 
    '',
    'Record counts in potentially outdated tables:' as info;

-- Dynamic count for members table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
        RAISE NOTICE 'members table: % records', (SELECT COUNT(*) FROM members);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_goals') THEN
        RAISE NOTICE 'member_goals table: % records', (SELECT COUNT(*) FROM member_goals);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_skills') THEN
        RAISE NOTICE 'member_skills table: % records', (SELECT COUNT(*) FROM member_skills);
    END IF;
END $$;

-- Show current active tables and their relationships
SELECT 
    '',
    'Current active table structure:' as info;

SELECT 
    '- users: Authentication and basic user info' as description
UNION ALL
SELECT '- user_profiles: Extended user profiles (replaces old members table)'
UNION ALL
SELECT '- startups: Startup entities'
UNION ALL
SELECT '- startup_members: Junction table linking users to startups with roles'
UNION ALL
SELECT '- founder_profiles: Additional founder-specific data'
UNION ALL
SELECT '- investor_profiles: Additional investor-specific data'
UNION ALL
SELECT '- chat_conversations & chat_messages: Messaging system'
UNION ALL
SELECT '- *_tokens tables: Authentication and verification tokens';

-- Recommendations
SELECT 
    '',
    'RECOMMENDATIONS:' as info;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members')
        THEN '1. DROP TABLE members CASCADE; -- This table has been migrated to user_profiles'
        ELSE '1. members table already removed ✓'
    END as recommendation
UNION ALL
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_goals')
        THEN '2. DROP TABLE member_goals CASCADE; -- Related to old members table'
        ELSE '2. member_goals table already removed ✓'
    END
UNION ALL
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_skills')
        THEN '3. DROP TABLE member_skills CASCADE; -- Related to old members table'
        ELSE '3. member_skills table already removed ✓'
    END
UNION ALL
SELECT '4. Update any remaining references in scripts/verify-migration.sql'
UNION ALL
SELECT '5. Remove indexes for members table from scripts/database/01_add_indexes.sql';
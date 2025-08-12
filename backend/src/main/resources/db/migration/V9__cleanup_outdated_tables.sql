-- Migration V9: Clean up outdated tables
-- The members table was migrated to user_profiles in V1, but the old table may still exist

-- Drop outdated member-related tables if they exist
DROP TABLE IF EXISTS member_goals CASCADE;
DROP TABLE IF EXISTS member_skills CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Log the cleanup
DO $$
BEGIN
    RAISE NOTICE 'Cleanup completed: Removed outdated members, member_goals, and member_skills tables if they existed';
END $$;
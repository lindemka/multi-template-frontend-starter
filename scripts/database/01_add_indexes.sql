-- Performance optimization indexes for Foundersbase database
-- Run this script after initial database setup

-- User profiles table indexes (replaces old members table)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_location_created ON user_profiles(location, created_at DESC);

-- Full text search index for user profile search
CREATE INDEX IF NOT EXISTS idx_user_profiles_search ON user_profiles 
  USING gin(to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(tagline, '') || ' ' || 
    COALESCE(location, '')
  ));

-- Users table indexes (renamed from auth_users)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

-- Startup related indexes
CREATE INDEX IF NOT EXISTS idx_startups_name ON startups(name);
CREATE INDEX IF NOT EXISTS idx_startup_members_startup_id ON startup_members(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_user_id ON startup_members(user_id);

-- Analyze tables after adding indexes
ANALYZE user_profiles;
ANALYZE users;
ANALYZE startups;
ANALYZE startup_members;
-- Performance optimization indexes for Foundersbase database
-- Run this script after initial database setup

-- Member table indexes
CREATE INDEX IF NOT EXISTS idx_member_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_member_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_member_location ON members(location);
CREATE INDEX IF NOT EXISTS idx_member_created_at ON members(created_at);
CREATE INDEX IF NOT EXISTS idx_member_updated_at ON members(updated_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_member_status_location ON members(status, location);
CREATE INDEX IF NOT EXISTS idx_member_status_created ON members(status, created_at DESC);

-- Full text search index for member search
CREATE INDEX IF NOT EXISTS idx_member_search ON members 
  USING gin(to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(tagline, '') || ' ' || 
    COALESCE(about, '')
  ));

-- AuthUser table indexes
CREATE INDEX IF NOT EXISTS idx_auth_user_username ON auth_users(username);
CREATE INDEX IF NOT EXISTS idx_auth_user_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_user_enabled ON auth_users(enabled);

-- Analyze tables after adding indexes
ANALYZE members;
ANALYZE auth_users;
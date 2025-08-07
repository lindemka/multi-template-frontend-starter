-- Migration: Restructure User Architecture
-- This migration transforms the authentication and profile system to support multiple user roles

-- Step 1: Rename auth_users to users (if not already done)
ALTER TABLE IF EXISTS auth_users RENAME TO users;

-- Add missing columns to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Update existing rows to have default values
UPDATE users SET enabled = true WHERE enabled IS NULL;
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Step 2: Rename members to user_profiles
ALTER TABLE IF EXISTS members RENAME TO user_profiles;

-- Step 3: Add user_id column to user_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_profiles' AND column_name='user_id') THEN
        ALTER TABLE user_profiles ADD COLUMN user_id BIGINT;
    END IF;
END $$;

-- Step 4: Create founder_profiles table
CREATE TABLE IF NOT EXISTS founder_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL,
    completeness INTEGER DEFAULT 0,
    my_introduction TEXT,
    my_motivation TEXT,
    my_achievement TEXT,
    my_character TEXT,
    looking_for_cofounder BOOLEAN DEFAULT false,
    looking_for_investor BOOLEAN DEFAULT false,
    looking_for_mentor BOOLEAN DEFAULT false,
    expertise_areas TEXT[],
    years_experience INTEGER,
    previous_startups INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_founder_profile_user_profile 
        FOREIGN KEY (user_profile_id) 
        REFERENCES user_profiles(id) 
        ON DELETE CASCADE,
    CONSTRAINT unique_founder_profile_user UNIQUE (user_profile_id)
);

-- Step 5: Create startups table
CREATE TABLE IF NOT EXISTS startups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    founded_date DATE,
    stage VARCHAR(50), -- idea, mvp, revenue, growth, scale
    industry VARCHAR(100),
    team_size INTEGER DEFAULT 1,
    location VARCHAR(255),
    is_hiring BOOLEAN DEFAULT false,
    is_fundraising BOOLEAN DEFAULT false,
    funding_amount DECIMAL(15,2),
    revenue_range VARCHAR(50),
    product_status VARCHAR(50), -- concept, development, beta, launched
    achievements TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Create startup_members junction table
CREATE TABLE IF NOT EXISTS startup_members (
    id BIGSERIAL PRIMARY KEY,
    startup_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(100) NOT NULL, -- founder, co-founder, cto, ceo, developer, designer, etc
    equity_percentage DECIMAL(5,2),
    joined_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_startup_member_startup 
        FOREIGN KEY (startup_id) 
        REFERENCES startups(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_startup_member_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT unique_startup_member UNIQUE (startup_id, user_id)
);

-- Step 7: Create investor_profiles table for future use
CREATE TABLE IF NOT EXISTS investor_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL,
    completeness INTEGER DEFAULT 0,
    investment_focus TEXT,
    investment_experience TEXT,
    investor_introduction TEXT,
    investment_range_min DECIMAL(15,2),
    investment_range_max DECIMAL(15,2),
    preferred_stages TEXT[],
    preferred_industries TEXT[],
    portfolio_companies TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_investor_profile_user_profile 
        FOREIGN KEY (user_profile_id) 
        REFERENCES user_profiles(id) 
        ON DELETE CASCADE,
    CONSTRAINT unique_investor_profile_user UNIQUE (user_profile_id)
);

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_user_profile_id ON founder_profiles(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_startup_id ON startup_members(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_user_id ON startup_members(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_user_profile_id ON investor_profiles(user_profile_id);

-- Step 9: Link existing auth users to user profiles
-- First, ensure we have user profiles for all existing users
DO $$
DECLARE
    auth_user RECORD;
    profile_id BIGINT;
BEGIN
    FOR auth_user IN SELECT id, username, email FROM users LOOP
        -- Check if user already has a profile (by matching email or name)
        SELECT id INTO profile_id 
        FROM user_profiles 
        WHERE name = auth_user.username 
           OR name = split_part(auth_user.email, '@', 1)
        LIMIT 1;
        
        IF profile_id IS NOT NULL THEN
            -- Link existing profile to user
            UPDATE user_profiles 
            SET user_id = auth_user.id 
            WHERE id = profile_id AND user_id IS NULL;
        ELSE
            -- Create new profile for user
            INSERT INTO user_profiles (
                user_id, name, location, avatar, tagline, followers, rating
            ) VALUES (
                auth_user.id,
                COALESCE(auth_user.username, split_part(auth_user.email, '@', 1)),
                'Not specified',
                'https://ui-avatars.com/api/?name=' || COALESCE(auth_user.username, split_part(auth_user.email, '@', 1)),
                'New member of Foundersbase',
                0,
                0.0
            );
        END IF;
    END LOOP;
END $$;

-- Step 10: Add sample founder profiles for demo users
INSERT INTO founder_profiles (user_profile_id, my_introduction, my_motivation, looking_for_cofounder, expertise_areas, years_experience)
SELECT up.id, 
       'Passionate entrepreneur building the future',
       'To create innovative solutions that make a difference',
       true,
       ARRAY['Technology', 'Product Management', 'Growth'],
       5
FROM user_profiles up
INNER JOIN users u ON u.id = up.user_id
WHERE u.email IN ('john@example.com', 'jane@example.com')
ON CONFLICT (user_profile_id) DO NOTHING;

-- Step 11: Add sample startups
INSERT INTO startups (name, tagline, description, stage, industry, team_size, location, is_hiring)
VALUES 
    ('TechVenture', 'Building the future of AI', 'An AI-powered platform for startup innovation', 'mvp', 'Technology', 3, 'San Francisco, CA', true),
    ('GreenTech Solutions', 'Sustainable technology for tomorrow', 'Environmental monitoring and optimization platform', 'revenue', 'CleanTech', 5, 'Berlin, Germany', true)
ON CONFLICT DO NOTHING;

-- Step 12: Link sample users to startups
INSERT INTO startup_members (startup_id, user_id, role, equity_percentage)
SELECT s.id, u.id, 'Co-Founder', 25.0
FROM startups s
CROSS JOIN users u
WHERE s.name = 'TechVenture' AND u.email = 'john@example.com'
ON CONFLICT (startup_id, user_id) DO NOTHING;

INSERT INTO startup_members (startup_id, user_id, role, equity_percentage)
SELECT s.id, u.id, 'CTO', 15.0
FROM startups s
CROSS JOIN users u
WHERE s.name = 'TechVenture' AND u.email = 'jane@example.com'
ON CONFLICT (startup_id, user_id) DO NOTHING;
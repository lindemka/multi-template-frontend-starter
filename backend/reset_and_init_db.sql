-- Complete database reset and initialization for Foundersbase

-- Drop and recreate users table with all required columns
DROP TABLE IF EXISTS startup_members CASCADE;
DROP TABLE IF EXISTS startups CASCADE;
DROP TABLE IF EXISTS founder_profiles CASCADE;
DROP TABLE IF EXISTS investor_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (authentication)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create user_profiles table
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    avatar VARCHAR(500),
    tagline VARCHAR(500),
    followers INTEGER DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create founder_profiles table
CREATE TABLE founder_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    completeness INTEGER DEFAULT 0,
    my_introduction TEXT,
    my_motivation TEXT,
    my_achievement TEXT,
    my_character TEXT,
    looking_for_cofounder BOOLEAN DEFAULT false,
    looking_for_investor BOOLEAN DEFAULT false,
    looking_for_mentor BOOLEAN DEFAULT false,
    years_experience INTEGER,
    previous_startups INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create investor_profiles table
CREATE TABLE investor_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    completeness INTEGER DEFAULT 0,
    investment_focus TEXT,
    investment_experience TEXT,
    investor_introduction TEXT,
    investment_range_min DECIMAL(15,2),
    investment_range_max DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create startups table
CREATE TABLE startups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    founded_date DATE,
    stage VARCHAR(50),
    industry VARCHAR(100),
    team_size INTEGER DEFAULT 1,
    location VARCHAR(255),
    is_hiring BOOLEAN DEFAULT false,
    is_fundraising BOOLEAN DEFAULT false,
    funding_amount DECIMAL(15,2),
    revenue_range VARCHAR(50),
    product_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create startup_members table
CREATE TABLE startup_members (
    id BIGSERIAL PRIMARY KEY,
    startup_id BIGINT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    equity_percentage DECIMAL(5,2),
    joined_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(startup_id, user_id)
);

-- Insert sample users (password is 'password123' bcrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, role, enabled) VALUES
('sarah.chen', 'sarah.chen@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Sarah', 'Chen', 'USER', true),
('alex.johnson', 'alex.johnson@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Alex', 'Johnson', 'USER', true),
('maria.garcia', 'maria.garcia@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Maria', 'Garcia', 'USER', true),
('james.kim', 'james.kim@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'James', 'Kim', 'USER', true),
('emma.wilson', 'emma.wilson@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Emma', 'Wilson', 'USER', true),
('david.patel', 'david.patel@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'David', 'Patel', 'USER', true),
('lisa.anderson', 'lisa.anderson@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Lisa', 'Anderson', 'USER', true),
('michael.zhang', 'michael.zhang@example.com', '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.', 'Michael', 'Zhang', 'USER', true);

-- Create user profiles
INSERT INTO user_profiles (user_id, name, location, avatar, tagline, followers, rating) VALUES
(1, 'Sarah Chen', 'San Francisco, CA', 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff', 'Serial Entrepreneur | AI Innovator | Building the Future', 342, 4.5),
(2, 'Alex Johnson', 'New York, NY', 'https://ui-avatars.com/api/?name=Alex+Johnson&background=10b981&color=fff', 'Technical Co-founder | Full-Stack Developer | Open to Opportunities', 215, 4.8),
(3, 'Maria Garcia', 'Austin, TX', 'https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff', 'Growth Expert | Marketing Strategist | Helping Startups Scale', 567, 4.7),
(4, 'James Kim', 'Seattle, WA', 'https://ui-avatars.com/api/?name=James+Kim&background=ef4444&color=fff', 'Product Designer | UX Specialist | Creating Delightful Experiences', 189, 4.6),
(5, 'Emma Wilson', 'London, UK', 'https://ui-avatars.com/api/?name=Emma+Wilson&background=8b5cf6&color=fff', 'Angel Investor | Startup Advisor | Former Google PM', 892, 4.9),
(6, 'David Patel', 'Berlin, Germany', 'https://ui-avatars.com/api/?name=David+Patel&background=ec4899&color=fff', 'ML Engineer | Deep Learning Expert | Looking for Co-founder', 423, 4.4),
(7, 'Lisa Anderson', 'Toronto, Canada', 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=14b8a6&color=fff', 'Business Development | Strategic Partnerships | SaaS Expert', 156, 4.3),
(8, 'Michael Zhang', 'Singapore', 'https://ui-avatars.com/api/?name=Michael+Zhang&background=f97316&color=fff', 'Venture Partner | Investing in SEA Startups | Ex-Founder', 1203, 4.8);

-- Create founder profiles for first 5 users
INSERT INTO founder_profiles (user_profile_id, my_introduction, my_motivation, looking_for_cofounder, looking_for_investor, years_experience) VALUES
(1, 'Serial entrepreneur with 3 successful exits. Passionate about AI and its potential to transform industries.', 'To build technology that makes a meaningful impact on billions of lives.', true, true, 8),
(2, 'Full-stack developer with expertise in scalable systems. Previously built products at FAANG companies.', 'To create products that users love and that solve real problems.', true, false, 6),
(3, 'Growth marketer who has helped 10+ startups achieve product-market fit and scale to millions in ARR.', 'To democratize access to growth strategies for early-stage founders.', false, true, 7),
(4, 'Award-winning product designer with a focus on accessibility and inclusive design.', 'To make technology accessible and delightful for everyone.', true, false, 5),
(6, 'ML researcher turned entrepreneur. Published 15+ papers in top conferences.', 'To bridge the gap between AI research and real-world applications.', true, true, 4);

-- Create investor profiles for users 5, 7, 8
INSERT INTO investor_profiles (user_profile_id, investment_focus, investment_experience, investment_range_min, investment_range_max) VALUES
(5, 'B2B SaaS, AI/ML, and Developer Tools in seed to Series A stages', '5 years angel investing, 20+ portfolio companies, 3 successful exits', 25000, 100000),
(7, 'Enterprise software and API-first companies', '3 years investing, focus on technical founders', 10000, 50000),
(8, 'Southeast Asian startups across fintech, e-commerce, and logistics', '7 years as VC partner, $50M+ deployed, specializing in SEA market', 50000, 500000);

-- Create startups
INSERT INTO startups (name, tagline, description, stage, industry, team_size, location, is_hiring, is_fundraising) VALUES
('NeuralFlow', 'AI-powered workflow automation for enterprises', 'We are building the next generation of workflow automation using advanced AI to help enterprises streamline operations and reduce costs by 60%.', 'seed', 'AI/ML', 4, 'San Francisco, CA', true, true),
('GreenGrid', 'Sustainable energy management platform', 'Smart analytics platform helping businesses optimize energy consumption and achieve carbon neutrality goals.', 'revenue', 'Climate Tech', 7, 'Berlin, Germany', true, false),
('HealthBridge', 'Connecting patients with specialists worldwide', 'Telemedicine platform breaking down geographical barriers in healthcare, making specialist care accessible globally.', 'growth', 'Healthcare', 15, 'New York, NY', true, true),
('EduSpark', 'Personalized learning powered by AI', 'Adaptive learning platform that customizes education paths for each student based on their learning style and pace.', 'mvp', 'EdTech', 3, 'Austin, TX', false, true),
('FinFlow', 'Modern treasury management for startups', 'All-in-one financial operations platform designed specifically for fast-growing startups and scale-ups.', 'seed', 'Fintech', 5, 'London, UK', true, false);

-- Add startup members
INSERT INTO startup_members (startup_id, user_id, role, equity_percentage) VALUES
(1, 1, 'Founder & CEO', 35.00),
(1, 2, 'Co-Founder & CTO', 30.00),
(2, 6, 'Founder & CEO', 40.00),
(3, 3, 'Founder & CMO', 45.00),
(4, 4, 'Founder & Head of Design', 50.00),
(5, 7, 'Founder & COO', 40.00);

-- Create additional tables for profile data
CREATE TABLE IF NOT EXISTS user_profile_goals (
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    goal VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_profile_interests (
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    interest VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_profile_skills (
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill VARCHAR(255)
);

-- Add goals, interests, and skills
INSERT INTO user_profile_goals VALUES
(1, 'Find co-founder'), (1, 'Raise Series A'),
(2, 'Join a startup'), (2, 'Build network'),
(3, 'Find clients'), (3, 'Share knowledge'),
(4, 'Find co-founder'), (4, 'Launch product'),
(5, 'Find deals'), (5, 'Support founders'),
(6, 'Build team'), (6, 'Find co-founder'),
(7, 'Join unicorn'), (7, 'Learn and grow'),
(8, 'Deploy capital'), (8, 'Find unicorns');

INSERT INTO user_profile_interests VALUES
(1, 'AI & Machine Learning'), (1, 'SaaS'), (1, 'Enterprise Software'),
(2, 'Web3'), (2, 'Developer Tools'), (2, 'Open Source'),
(3, 'Marketing'), (3, 'Growth'), (3, 'Analytics'),
(4, 'Design Systems'), (4, 'User Research'), (4, 'Accessibility'),
(5, 'B2B SaaS'), (5, 'AI/ML'), (5, 'Developer Tools'),
(6, 'Deep Learning'), (6, 'Computer Vision'), (6, 'NLP'),
(7, 'Sales'), (7, 'Partnerships'), (7, 'Strategy'),
(8, 'Fintech'), (8, 'E-commerce'), (8, 'Logistics');

INSERT INTO user_profile_skills VALUES
(1, 'Leadership'), (1, 'Fundraising'), (1, 'Product Strategy'),
(2, 'Full-Stack Development'), (2, 'Cloud Architecture'), (2, 'DevOps'),
(3, 'Growth Marketing'), (3, 'SEO/SEM'), (3, 'Content Strategy'),
(4, 'UI/UX Design'), (4, 'Prototyping'), (4, 'User Testing'),
(5, 'Investment Analysis'), (5, 'Due Diligence'), (5, 'Board Advisory'),
(6, 'Machine Learning'), (6, 'Python'), (6, 'TensorFlow'),
(7, 'Business Development'), (7, 'Negotiation'), (7, 'Account Management'),
(8, 'Venture Capital'), (8, 'Market Analysis'), (8, 'Portfolio Management');

-- Show final counts
SELECT 'Database initialized successfully!' as status;
SELECT 'Users: ' || COUNT(*) FROM users
UNION ALL SELECT 'User Profiles: ' || COUNT(*) FROM user_profiles
UNION ALL SELECT 'Founder Profiles: ' || COUNT(*) FROM founder_profiles
UNION ALL SELECT 'Investor Profiles: ' || COUNT(*) FROM investor_profiles
UNION ALL SELECT 'Startups: ' || COUNT(*) FROM startups
UNION ALL SELECT 'Startup Members: ' || COUNT(*) FROM startup_members;
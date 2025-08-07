-- Fix user architecture and complete migration

-- Ensure users table has all required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Update nulls with defaults
UPDATE users SET enabled = true WHERE enabled IS NULL;
UPDATE users SET role = 'USER' WHERE role IS NULL;
UPDATE users SET first_name = split_part(username, '@', 1) WHERE first_name IS NULL;
UPDATE users SET last_name = 'User' WHERE last_name IS NULL;

-- Now make columns NOT NULL after they have values
ALTER TABLE users ALTER COLUMN enabled SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
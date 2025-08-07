-- Fix users table to have all required columns

-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Update any null values with defaults
UPDATE users SET enabled = true WHERE enabled IS NULL;
UPDATE users SET role = 'USER' WHERE role IS NULL;
UPDATE users SET first_name = COALESCE(first_name, split_part(username, '@', 1)) WHERE first_name IS NULL OR first_name = '';
UPDATE users SET last_name = COALESCE(last_name, 'User') WHERE last_name IS NULL OR last_name = '';
UPDATE users SET username = COALESCE(username, email) WHERE username IS NULL;
UPDATE users SET password = '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.' WHERE password IS NULL OR password = '';

-- Now set NOT NULL constraints
ALTER TABLE users ALTER COLUMN enabled SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
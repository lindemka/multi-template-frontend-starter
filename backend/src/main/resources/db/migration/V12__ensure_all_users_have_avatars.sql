-- Ensure ALL users have avatars in the database (single source of truth)
-- This migration ensures no user can exist without an avatar

-- Step 1: Update any NULL or empty avatars in user_profiles
UPDATE user_profiles
SET avatar = 
    CASE 
        WHEN user_id IS NOT NULL THEN
            -- Generate deterministic avatar based on user_id
            'https://i.pravatar.cc/150?img=' || ((user_id % 70) + 1)
        ELSE
            -- Fallback for profiles without user_id
            'https://i.pravatar.cc/150?img=' || ((id % 70) + 1)
    END
WHERE avatar IS NULL OR avatar = '' OR avatar LIKE '%ui-avatars.com%';

-- Step 2: Ensure Kai Three (kai3) has the correct avatar
UPDATE user_profiles
SET avatar = 'https://i.pravatar.cc/150?img=41'
WHERE user_id = (SELECT id FROM users WHERE username = 'kai3');

-- Step 3: Make avatar column NOT NULL to enforce data integrity
ALTER TABLE user_profiles 
ALTER COLUMN avatar SET NOT NULL;

-- Step 4: Add a default value for future inserts
ALTER TABLE user_profiles 
ALTER COLUMN avatar SET DEFAULT 'https://i.pravatar.cc/150?img=1';

-- Step 5: Create a trigger to ensure avatar is always set on insert
CREATE OR REPLACE FUNCTION ensure_avatar_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.avatar IS NULL OR NEW.avatar = '' THEN
        IF NEW.user_id IS NOT NULL THEN
            NEW.avatar := 'https://i.pravatar.cc/150?img=' || ((NEW.user_id % 70) + 1);
        ELSE
            NEW.avatar := 'https://i.pravatar.cc/150?img=' || ((NEW.id % 70) + 1);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_avatar_before_insert
BEFORE INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION ensure_avatar_on_insert();

-- Step 6: Log the migration
DO $$
BEGIN
    RAISE NOTICE 'Avatar migration completed. All users now have avatars in the database.';
END $$;

-- Add avatar_url column to user_profile table
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Update existing users with deterministic avatars based on their username
UPDATE user_profile 
SET avatar_url = CASE 
    WHEN id = 1 THEN 'https://i.pravatar.cc/150?img=49'  -- Sarah Chen gets a consistent photo
    WHEN id = 2 THEN 'https://i.pravatar.cc/150?img=3'   -- Test User 2
    WHEN id = 3 THEN 'https://i.pravatar.cc/150?img=5'   -- Test User 3
    ELSE 'https://i.pravatar.cc/150?img=' || ((id % 70) + 1)  -- Others get deterministic based on ID
END
WHERE avatar_url IS NULL;
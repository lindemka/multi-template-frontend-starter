-- The avatar column already exists in user_profiles table
-- Update existing users with deterministic photo avatars (replacing initials avatars)
UPDATE user_profiles 
SET avatar = CASE 
    WHEN user_id = 1 THEN 'https://i.pravatar.cc/150?img=49'  -- Sarah Chen gets a consistent photo
    WHEN user_id = 2 THEN 'https://i.pravatar.cc/150?img=3'   -- Alex Johnson
    WHEN user_id = 3 THEN 'https://i.pravatar.cc/150?img=5'   -- Maria Garcia
    WHEN user_id = 4 THEN 'https://i.pravatar.cc/150?img=8'   -- James Kim
    WHEN user_id = 5 THEN 'https://i.pravatar.cc/150?img=23'  -- Emma Wilson
    WHEN user_id = 6 THEN 'https://i.pravatar.cc/150?img=14'  -- David Patel
    ELSE 'https://i.pravatar.cc/150?img=' || ((user_id % 70) + 1)  -- Others get deterministic based on user_id
END
WHERE avatar IS NULL OR avatar LIKE '%ui-avatars.com%';
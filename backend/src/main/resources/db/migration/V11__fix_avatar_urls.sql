-- Fix avatar URLs to use consistent pravatar.cc instead of ui-avatars.com
-- This ensures all users have consistent avatars across the application

-- Update user profiles that use ui-avatars.com to use a default avatar
UPDATE user_profiles 
SET avatar = 'https://i.pravatar.cc/150?img=1'
WHERE avatar LIKE '%ui-avatars.com%' OR avatar IS NULL OR avatar = '';

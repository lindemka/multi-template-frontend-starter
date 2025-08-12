-- Mark Sarah Chen's email as verified so she can log in
UPDATE users 
SET email_verified = true 
WHERE username = 'sarah.chen@example.com';

-- Also ensure her avatar is set properly
UPDATE user_profiles 
SET avatar = 'https://i.pravatar.cc/150?img=49'
WHERE user_id = (SELECT id FROM users WHERE username = 'sarah.chen@example.com');
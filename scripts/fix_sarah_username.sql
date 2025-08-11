-- Fix Sarah's username to match what the JWT is sending
UPDATE users 
SET username = 'sarah.chen'
WHERE email = 'sarah.chen@example.com';
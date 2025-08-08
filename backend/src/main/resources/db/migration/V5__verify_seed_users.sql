-- Mark existing users as email verified to allow dev/test logins
-- This keeps the requirement for email verification for newly registered users
UPDATE users SET email_verified = true WHERE email_verified IS DISTINCT FROM true;



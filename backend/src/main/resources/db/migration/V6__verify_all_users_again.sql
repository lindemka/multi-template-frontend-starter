-- Ensure all existing users are marked as verified in development
-- This is idempotent and only affects rows where email_verified is not already true
UPDATE users SET email_verified = true WHERE email_verified IS DISTINCT FROM true;



-- Check if users table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        ) 
        THEN 'WARNING: users table still exists!' 
        ELSE 'SUCCESS: users table has been removed' 
    END as status;

-- List all tables
SELECT 
    '--- All tables in database ---' as info;
    
SELECT 
    table_name as "Table Name"
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
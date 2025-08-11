-- Check all avatar-related columns in the database
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length
FROM 
    information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE 
    c.column_name LIKE '%avatar%'
    AND t.table_schema = 'public'
ORDER BY 
    t.table_name, c.column_name;
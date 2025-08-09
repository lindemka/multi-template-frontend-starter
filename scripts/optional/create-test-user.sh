#!/bin/bash

# Create a test user with known credentials
# Password will be: Test123!

echo "Creating test user in database..."

# BCrypt hash for "Test123!" (generated with rounds=10)
# You can verify this works with Spring Security BCrypt
PASSWORD_HASH='$2a$10$8K1p/a0PchLFqC9xJxY6VuUgIh0kDrag77bYMSs5RJ3OC6wb4qRs.'

# Create the SQL command
SQL_COMMAND="INSERT INTO auth_users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at) 
VALUES ('testuser', 'test@example.com', '${PASSWORD_HASH}', 'Test', 'User', 'USER', true, NOW(), NOW()) 
ON CONFLICT (username) DO UPDATE 
SET password = '${PASSWORD_HASH}', 
    updated_at = NOW()
RETURNING id, username, email;"

# Execute the SQL (will use local Postgres by default; override with env vars)
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-project1}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-password}

PGPASSWORD="$DB_PASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USERNAME" \
  -d "$DB_NAME" \
  -c "$SQL_COMMAND"

echo ""
echo "✅ Test user created/updated successfully!"
echo ""
echo "Login credentials:"
echo "  Username: testuser"
echo "  Password: Test123!"
echo ""
echo "Now open: http://localhost:3000/login"
echo ""
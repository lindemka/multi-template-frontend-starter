#!/bin/bash

# Script to migrate data to PostgreSQL and run the backend

echo "===========================================" 
echo "Starting Data Migration to PostgreSQL"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if command -v pg_isready &> /dev/null; then
    pg_isready -h localhost -p 5432
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
        echo -e "${RED}✗ PostgreSQL is not running. Please start PostgreSQL first.${NC}"
        echo "  On macOS: brew services start postgresql"
        echo "  On Linux: sudo systemctl start postgresql"
        exit 1
    fi
else
    echo -e "${YELLOW}Warning: pg_isready not found. Assuming PostgreSQL is running.${NC}"
fi

# Navigate to backend directory
cd "$(dirname "$0")/../backend" || exit 1

# Clean and compile the backend
echo -e "${YELLOW}Building backend application...${NC}"
./mvnw clean compile

# Run the backend with PostgreSQL profile
echo -e "${GREEN}Starting backend with PostgreSQL profile...${NC}"
echo ""
echo "=========================================="
echo "IMPORTANT: Set your PostgreSQL password"
echo "=========================================="
echo "Either:"
echo "1. Set environment variable: export DB_PASSWORD=your_password"
echo "2. Or use default password 'password'"
echo ""
echo "The application will:"
echo "- Connect to PostgreSQL at localhost:5432/project1"
echo "- Create tables automatically"
echo "- Migrate mock user data to the database"
echo ""

# Run with PostgreSQL profile
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run

# Alternative: Run with custom password
# DB_PASSWORD=your_password SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
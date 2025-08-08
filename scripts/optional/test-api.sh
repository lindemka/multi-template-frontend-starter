#!/bin/bash

echo "=== Testing Foundersbase API Endpoints ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    response=$(curl -s "$url" | wc -c)
    if [ "$response" -gt "$expected" ]; then
        echo -e "${GREEN}✓${NC} $name - Response size: $response bytes"
        return 0
    else
        echo -e "${RED}✗${NC} $name - Response size: $response bytes (expected > $expected)"
        return 1
    fi
}

# Test database status
echo "1. Database Status:"
curl -s http://localhost:8080/api/db/status | jq '.'
echo ""

# Test startups endpoints
echo "2. Startups API Tests:"
test_endpoint "All Startups" "http://localhost:8080/api/startups" 100
test_endpoint "Startup Details (ID 1)" "http://localhost:8080/api/startups/1" 50
test_endpoint "Hiring Startups" "http://localhost:8080/api/startups/hiring" 100
test_endpoint "Fundraising Startups" "http://localhost:8080/api/startups/fundraising" 100
echo ""

# Test members endpoints  
echo "3. Members API Tests:"
test_endpoint "All Members" "http://localhost:8080/api/members" 100
echo ""

# Show sample data
echo "4. Sample Data:"
echo "   Startups:"
curl -s http://localhost:8080/api/startups | jq '.content[] | {id, name, stage, isHiring, isFundraising}'
echo ""
echo "   Members with Profiles:"
curl -s http://localhost:8080/api/members | jq '.[] | {name, isFounder, isInvestor}'
echo ""

echo "=== Test Complete ===="
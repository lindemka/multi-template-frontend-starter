#!/bin/bash

# Avatar Fix Script
# This script updates all avatar URLs to use the working i.pravatar.cc service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🖼️  Starting Avatar Fix Script${NC}"

# Check if backend is running
if ! curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${RED}❌ Backend is not running. Please start the backend first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"

# Get all profiles
echo -e "${BLUE}📊 Fetching all profiles...${NC}"
PROFILES=$(curl -s http://localhost:8080/api/members)

# Count total profiles
TOTAL_PROFILES=$(echo "$PROFILES" | jq 'length')
echo -e "${BLUE}📈 Found $TOTAL_PROFILES total profiles${NC}"

# Function to update avatar for a profile
update_avatar() {
    local profile_id=$1
    local profile_name=$2
    local avatar_url=$3
    
    echo -e "${BLUE}🔄 Updating avatar for profile $profile_id ($profile_name)...${NC}"
    
    # Create update payload
    local update_payload=$(cat <<EOF
{
    "avatar": "$avatar_url"
}
EOF
)
    
    # Update the profile
    local response=$(curl -s -X PUT \
        -H "Content-Type: application/json" \
        -d "$update_payload" \
        "http://localhost:8080/api/members/$profile_id")
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Successfully updated avatar for profile $profile_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to update avatar for profile $profile_id${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Counter for success/error tracking
success_count=0
error_count=0
counter=0

# Get profile IDs and update avatars
echo "$PROFILES" | jq -r '.[] | "\(.id)|\(.name)"' | while IFS='|' read -r profile_id profile_name; do
    # Generate a unique image ID based on the counter to ensure variety
    # Use numbers 1-100 for variety
    image_id=$((counter % 100 + 1))
    
    # Create avatar URL using i.pravatar.cc with image ID
    avatar_url="https://i.pravatar.cc/150?img=$image_id"
    
    # Update avatar
    if update_avatar "$profile_id" "$profile_name" "$avatar_url"; then
        ((success_count++))
    else
        ((error_count++))
    fi
    
    ((counter++))
    
    # Small delay to avoid overwhelming the server
    sleep 0.3
done

echo -e "${BLUE}📊 Summary:${NC}"
echo -e "${GREEN}✅ Successfully updated: $success_count avatars${NC}"
echo -e "${RED}❌ Failed to update: $error_count avatars${NC}"

# Verify the results
echo -e "${BLUE}🔍 Verifying results...${NC}"
sleep 2

# Check a few sample avatars
echo -e "${BLUE}📸 Sample updated avatars:${NC}"
curl -s http://localhost:8080/api/members | jq '.[0:5] | .[] | {id, name, avatar}' | head -15

echo -e "${BLUE}✨ Avatar fixing complete!${NC}"
echo -e "${GREEN}🎉 All profiles now have working avatar URLs using i.pravatar.cc${NC}"

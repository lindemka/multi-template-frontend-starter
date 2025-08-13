#!/bin/bash

# Profile Filler Script
# This script fills incomplete user profiles with realistic goals, interests, and skills

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Profile Filler Script${NC}"

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

# Count incomplete profiles
INCOMPLETE_PROFILES=$(echo "$PROFILES" | jq '[.[] | select((.goals | length) == 0 and (.skills | length) == 0 and (.interests | length) == 0)] | length')
echo -e "${YELLOW}⚠️  Found $INCOMPLETE_PROFILES incomplete profiles${NC}"

# Get incomplete profile IDs
INCOMPLETE_IDS=$(echo "$PROFILES" | jq -r '[.[] | select((.goals | length) == 0 and (.skills | length) == 0 and (.interests | length) == 0)] | .[].id')

# Define profile templates based on the complete profiles we found
declare -a GOAL_TEMPLATES=(
    '["Find co-founder", "Raise Series A"]'
    '["Join a startup", "Build network"]'
    '["Find clients", "Share knowledge"]'
    '["Build MVP", "Find investors"]'
    '["Scale business", "Hire team"]'
    '["Learn new skills", "Find mentor"]'
    '["Launch product", "Get feedback"]'
    '["Expand network", "Find partners"]'
)

declare -a INTEREST_TEMPLATES=(
    '["AI & Machine Learning", "SaaS", "Enterprise Software"]'
    '["Web3", "Developer Tools", "Open Source"]'
    '["Marketing", "Growth", "Analytics"]'
    '["Mobile Apps", "UI/UX", "Product Design"]'
    '["Cloud Computing", "DevOps", "Infrastructure"]'
    '["Data Science", "Machine Learning", "Analytics"]'
    '["E-commerce", "Retail Tech", "Consumer Apps"]'
    '["Fintech", "Blockchain", "Digital Payments"]'
)

declare -a SKILL_TEMPLATES=(
    '["Leadership", "Fundraising", "Product Strategy"]'
    '["Full-Stack Development", "Cloud Architecture", "DevOps"]'
    '["Growth Marketing", "SEO/SEM", "Content Strategy"]'
    '["Mobile Development", "UI/UX Design", "Product Management"]'
    '["System Architecture", "Database Design", "Security"]'
    '["Data Analysis", "Statistical Modeling", "Business Intelligence"]'
    '["Customer Acquisition", "Sales Strategy", "Market Research"]'
    '["Financial Modeling", "Risk Management", "Compliance"]'
)

# Function to update a profile
update_profile() {
    local profile_id=$1
    local goals=$2
    local interests=$3
    local skills=$4
    
    echo -e "${BLUE}🔄 Updating profile $profile_id...${NC}"
    
    # Create update payload
    local update_payload=$(cat <<EOF
{
    "goals": $goals,
    "interests": $interests,
    "skills": $skills
}
EOF
)
    
    # Update the profile
    local response=$(curl -s -X PUT \
        -H "Content-Type: application/json" \
        -d "$update_payload" \
        "http://localhost:8080/api/members/$profile_id")
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Successfully updated profile $profile_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to update profile $profile_id${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Counter for template selection
template_counter=0
success_count=0
error_count=0

# Update each incomplete profile
for profile_id in $INCOMPLETE_IDS; do
    # Select template based on counter
    goal_index=$((template_counter % ${#GOAL_TEMPLATES[@]}))
    interest_index=$((template_counter % ${#INTEREST_TEMPLATES[@]}))
    skill_index=$((template_counter % ${#SKILL_TEMPLATES[@]}))
    
    # Get templates
    goals="${GOAL_TEMPLATES[$goal_index]}"
    interests="${INTEREST_TEMPLATES[$interest_index]}"
    skills="${SKILL_TEMPLATES[$skill_index]}"
    
    # Update profile
    if update_profile "$profile_id" "$goals" "$interests" "$skills"; then
        ((success_count++))
    else
        ((error_count++))
    fi
    
    ((template_counter++))
    
    # Small delay to avoid overwhelming the server
    sleep 0.5
done

echo -e "${BLUE}📊 Summary:${NC}"
echo -e "${GREEN}✅ Successfully updated: $success_count profiles${NC}"
echo -e "${RED}❌ Failed to update: $error_count profiles${NC}"

# Verify the results
echo -e "${BLUE}🔍 Verifying results...${NC}"
sleep 2

FINAL_PROFILES=$(curl -s http://localhost:8080/api/members)
FINAL_INCOMPLETE=$(echo "$FINAL_PROFILES" | jq '[.[] | select((.goals | length) == 0 and (.skills | length) == 0 and (.interests | length) == 0)] | length')
FINAL_COMPLETE=$(echo "$FINAL_PROFILES" | jq '[.[] | select((.goals | length) > 0 or (.skills | length) > 0 or (.interests | length) > 0)] | length')

echo -e "${BLUE}📈 Final Results:${NC}"
echo -e "${GREEN}✅ Complete profiles: $FINAL_COMPLETE${NC}"
echo -e "${YELLOW}⚠️  Incomplete profiles: $FINAL_INCOMPLETE${NC}"

if [ "$FINAL_INCOMPLETE" -eq 0 ]; then
    echo -e "${GREEN}🎉 All profiles are now complete!${NC}"
else
    echo -e "${YELLOW}⚠️  Some profiles are still incomplete. You may need to run this script again.${NC}"
fi

echo -e "${BLUE}✨ Profile filling complete!${NC}"

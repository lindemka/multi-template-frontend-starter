#!/bin/bash

echo "Testing login with sarah.chen..."

# Test login
response=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sarah.chen","password":"password123"}' \
  -s -w "\nHTTP_STATUS:%{http_code}")

# Extract HTTP status
http_status=$(echo "$response" | tail -n 1 | cut -d: -f2)
body=$(echo "$response" | head -n -1)

echo "HTTP Status: $http_status"
echo "Response Body:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"

if [ "$http_status" = "200" ]; then
  echo "✅ Login successful!"
  # Extract token
  token=$(echo "$body" | jq -r '.token' 2>/dev/null)
  if [ -n "$token" ] && [ "$token" != "null" ]; then
    echo "Token starts with: ${token:0:50}..."
  fi
else
  echo "❌ Login failed"
fi
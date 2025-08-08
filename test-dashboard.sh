#!/bin/bash

echo "🧪 Dashboard Testing Script"
echo "=========================="
echo ""

# Test 1: Check if services are running
echo "1. Checking services..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is NOT running"
    exit 1
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend is NOT running"
    exit 1
fi

# Test 2: Check dashboard page
echo ""
echo "2. Testing dashboard page..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard)
if [ "$RESPONSE" == "200" ]; then
    echo "   ✅ Dashboard returns 200"
else
    echo "   ❌ Dashboard returns $RESPONSE"
fi

# Test 3: Check for React errors in HTML
echo ""
echo "3. Checking for React errors..."
if curl -s http://localhost:3000/dashboard | grep -q "React.Children"; then
    echo "   ❌ React.Children error found!"
else
    echo "   ✅ No React.Children error in HTML"
fi

if curl -s http://localhost:3000/dashboard | grep -q "Something went wrong"; then
    echo "   ❌ Error boundary triggered!"
else
    echo "   ✅ No error boundary message"
fi

# Test 4: Open in browser
echo ""
echo "4. Opening dashboard in browser..."
open http://localhost:3000/dashboard

echo ""
echo "⚠️  IMPORTANT: Check the browser console!"
echo "   Press F12 and look for any red errors"
echo ""
echo "Dashboard URL: http://localhost:3000/dashboard"
echo ""
echo "If you see a login page, that's normal (authentication required)"
echo "If you see 'Something went wrong' - the React error is NOT fixed"
echo ""
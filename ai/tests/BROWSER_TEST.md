# 🌐 Browser Testing Instructions

## Quick Browser Test

### Step 1: Open Login Page
The browser should now have opened to: **http://localhost:3000/login**

### Step 2: Login with These Credentials
Use one of these existing accounts:

**Admin Account:**
- Username: `admin`
- Password: `password123`

**Alternative Accounts:**
- Username: `john` / Password: `password123`
- Username: `jane` / Password: `password123`

### Step 3: After Login
You should be redirected to the dashboard at: **http://localhost:3000/dashboard**

### Step 4: Test Navigation
Click these items in the sidebar:
1. **Feed** - Dashboard home page
2. **Members** - List of all members
3. **Startups** - List of startups with filters

### Step 5: Test Collapsible Sidebar
- Click the arrow icon at the bottom of sidebar to collapse it
- Hover over icons to see tooltips when collapsed
- Click again to expand

## Manual Browser Test Commands

```bash
# Open login page
open http://localhost:3000/login

# After logging in, these pages should be accessible:
open http://localhost:3000/dashboard
open http://localhost:3000/dashboard/members
open http://localhost:3000/dashboard/startups
```

## Testing Login via Script

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

## Current System Status

✅ **Frontend**: Running on http://localhost:3000
✅ **Backend API**: Running on http://localhost:8080
✅ **Database**: Connected with 3 users (admin, john, jane)
✅ **Login Page**: Open in your browser now

## What You Should See

1. **Login Page**: Clean login form with username and password fields
2. **After Login**: Dashboard with:
   - Foundersbase logo (F icon)
   - Sidebar with Feed, Members, Startups
   - User menu at bottom showing logged-in user
   - Collapsible sidebar functionality

## If Login Fails

The most common issues:
1. **Wrong credentials** - Use exactly: username `admin`, password `password123`
2. **Backend not running** - Check if http://localhost:8080/health returns data
3. **Frontend not running** - Check if http://localhost:3000 loads

## Browser is Now Open!

The login page should be open in your default browser. Please:
1. Enter username: `admin`
2. Enter password: `password123`
3. Click "Sign In"
4. You should now see the dashboard!

---

**Note**: The browser has been opened to the login page. Please login manually to access the dashboard.
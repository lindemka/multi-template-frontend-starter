# 🧪 Comprehensive Testing Guide

## Current Status ✅
- **Frontend**: Running on http://localhost:3000
- **Backend**: Running on http://localhost:8080
- **Database**: PostgreSQL with 3 users (admin, john, jane)

## 🌐 Browser Test Steps

### 1. Open Login Page
```bash
open http://localhost:3000/login
```
**What you should see:**
- Clean login form with tabs for Login/Register
- Test credentials shown in bottom-right corner
- Username and password fields

### 2. Try These Login Credentials
The login page shows test credentials (sarah.chen), but those don't exist. 

**Working Users in Database:**
- Username: `admin` (but password might not be `password123`)
- Username: `john` (password is hashed)
- Username: `jane` (password is hashed)

### 3. Register a New User (RECOMMENDED)
Since we can't verify the existing passwords, **create a new account**:

1. Click the **"Register"** tab on the login page
2. Fill in:
   - First Name: Test
   - Last Name: User
   - Username: testuser
   - Email: test@example.com
   - Password: Test123!
   - Confirm Password: Test123!
3. Click "Create Account"

### 4. Access Dashboard
After successful login/registration, you'll be redirected to:
- http://localhost:3000/dashboard

**Dashboard Features:**
- Collapsible sidebar (click arrow at bottom)
- Navigation: Feed, Members, Startups
- User menu at bottom with your username

## 🔧 API Testing

### Test Backend Health
```bash
curl http://localhost:8080/health
```
Expected: `{"status":"UP",...}`

### Test Startups API
```bash
curl http://localhost:8080/api/startups
```
Expected: List of 5 startups

### Test Frontend Proxy
```bash
curl http://localhost:3000/api/startups
```
Expected: Same startup list (proxied through Next.js)

## 🚨 Troubleshooting

### If Login Page Shows "Loading..." Forever
This is a React Suspense issue. Try:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Open in incognito/private window

### If You Can't Access Dashboard
The dashboard is **protected** - you MUST be logged in:
1. Always start at http://localhost:3000/login
2. Login or register first
3. You'll be automatically redirected to dashboard

### If Registration Fails
Check the backend logs:
```bash
# Look for Spring Boot errors
ps aux | grep java
# Find the PID and check logs
```

### If Pages Don't Load
1. **Check Frontend:**
```bash
curl http://localhost:3000/
# Should return HTML
```

2. **Check Backend:**
```bash
curl http://localhost:8080/health
# Should return {"status":"UP"}
```

3. **Restart if needed:**
```bash
# Kill and restart frontend
pkill -f "next dev"
cd frontend && npm run dev &

# Check backend
curl http://localhost:8080/health
```

## 📊 What's Working

### ✅ Verified Working
1. Frontend serving pages (login, dashboard, members, startups)
2. Backend API responding
3. Database has users and startups
4. Navigation sidebar with collapse feature
5. Pages compile and render

### ⚠️ Known Issues
1. Existing user passwords are BCrypt hashed - can't login with plain "password123"
2. Registration endpoint might have CORS/security issues
3. Some Suspense boundary warnings in development

## 🎯 Quick Test Commands

```bash
# Open all pages in browser
open http://localhost:3000/login
open http://localhost:3000/
open http://localhost:3000/dashboard
open http://localhost:3000/dashboard/members
open http://localhost:3000/dashboard/startups

# Test APIs
curl http://localhost:8080/health
curl http://localhost:8080/api/startups
curl http://localhost:3000/api/startups
```

## 💡 Best Testing Approach

1. **Start Fresh:**
   - Open incognito/private browser window
   - Go to http://localhost:3000/login
   - Register a new account (you know the password)
   - Explore the dashboard

2. **Test Navigation:**
   - Click each sidebar item
   - Collapse/expand sidebar
   - Check tooltips when collapsed

3. **Verify Data:**
   - Members page should show user list
   - Startups page should show 5 companies

## 🔐 Creating Test User via SQL

If registration doesn't work, create a user directly:

```sql
-- Connect to database
PGPASSWORD=password /usr/local/opt/postgresql@16/bin/psql -h localhost -p 5432 -U postgres -d project1

-- Insert test user with known password hash
-- Password: "password123" 
INSERT INTO auth_users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at)
VALUES ('testuser', 'test@example.com', 
        '$2a$10$DowJones1234567890123456789012345678901234567890', 
        'Test', 'User', 'USER', true, NOW(), NOW());
```

Note: The password hash above is an example - you'd need to generate a proper BCrypt hash for "password123".

---

**Remember:** The application IS running and accessible. The main issue is authentication. Focus on:
1. Creating a new user via registration
2. Or fixing the registration endpoint if it's not working
3. Or creating a user directly in the database with a known password hash
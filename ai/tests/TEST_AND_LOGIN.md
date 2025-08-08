# 🔐 Login and Test Instructions

## Quick Access URLs

1. **Login Page**: http://localhost:3000/login
2. **Dashboard**: http://localhost:3000/dashboard (requires login)
3. **Startups**: http://localhost:3000/dashboard/startups
4. **Members**: http://localhost:3000/dashboard/members

## Default Test Credentials

Based on the database initialization, try these credentials:

### Admin Account
- **Username**: `admin`
- **Password**: `password123`

### Test User Accounts
- **Username**: `user1`
- **Password**: `password123`

- **Username**: `founder1`
- **Password**: `password123`

### If these don't work, create a new user:

```bash
# Register via API
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## Testing Flow

### 1. Open Login Page
```bash
open http://localhost:3000/login
```

### 2. Login with Credentials
- Enter username: `admin`
- Enter password: `password123`
- Click "Sign In"

### 3. You Should See
- Redirect to dashboard
- Sidebar with:
  - Foundersbase logo
  - Feed
  - Members
  - Startups
- Collapsible sidebar (click arrows at bottom)

### 4. Test Navigation
- Click "Members" - should show member list
- Click "Startups" - should show 5 startups
- Click logo "F" - should go to home page

## Troubleshooting

### If Login Fails:
1. Check backend is running:
```bash
curl http://localhost:8080/health
```

2. Check frontend is running:
```bash
curl http://localhost:3000/
```

3. Try registering a new user via the registration page:
```bash
open http://localhost:3000/test-registration
```

### If Dashboard Shows "Loading..." Forever:
1. Check browser console for errors (F12)
2. Clear localStorage:
```javascript
localStorage.clear()
```
3. Refresh the page

### If Can't Access Dashboard:
The dashboard is protected. You MUST login first at:
http://localhost:3000/login

## Current System Status

✅ Backend API: Running on port 8080
✅ Frontend: Running on port 3000
✅ Database: 14 users, 5 startups
✅ Authentication: JWT-based

## Browser Testing Commands

```bash
# Open login page
open http://localhost:3000/login

# After login, test these pages:
open http://localhost:3000/dashboard
open http://localhost:3000/dashboard/members
open http://localhost:3000/dashboard/startups
```

## API Testing (After Login)

Once logged in, your browser will have the JWT token. You can then access:
- Members data at `/dashboard/members`
- Startups at `/dashboard/startups`
- Profile pages at `/dashboard/profile/[id]`

---

**Note**: The dashboard requires authentication. If you see a blank page or "Loading...", you need to login first!
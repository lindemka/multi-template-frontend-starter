# 🚀 Quick Deploy Guide

## Most Common Commands

### 1️⃣ Daily Development
```bash
./deploy-simple.sh
```
Opens: http://localhost:3000

### 2️⃣ Test Production Build
```bash
./deploy-production.sh
```
Opens: http://localhost:8080

### 3️⃣ Check What's Running
```bash
./scripts/status.sh
```

### 4️⃣ Test APIs
```bash
./test-api.sh
```

## Login Credentials
- **Username**: `sarah.chen`
- **Password**: `password123`

## Port Guide
| Mode | Frontend | Backend | Database |
|------|----------|---------|----------|
| Dev | 3000 | 8080 | 5432 |
| Prod | 8080 (unified) | 8080 | 5432 |

## If Something Goes Wrong

### Kill Everything and Start Fresh
```bash
pkill -f java
pkill -f node
./deploy-simple.sh
```

### PostgreSQL Not Running?
```bash
brew services start postgresql@16
```

### Port Already in Use?
```bash
kill $(lsof -ti:3000)  # Kill frontend
kill $(lsof -ti:8080)  # Kill backend
```

## Docker Deployment (Production Ready)

### Build for Docker
```bash
# Backend Dockerfile already exists
docker build -t fbase-backend ./backend

# Frontend (needs Dockerfile)
docker build -t fbase-frontend ./frontend
```

### Deploy to Digital Ocean
```bash
# 1. Build production image
docker build -t registry.digitalocean.com/YOUR_REGISTRY/fbase ./backend

# 2. Push to registry
docker push registry.digitalocean.com/YOUR_REGISTRY/fbase

# 3. Deploy via DO App Platform
doctl apps create --spec .do/app.yaml
```

## Golden Rules
✅ **ALWAYS use scripts** - Never run manual commands
✅ **Check PostgreSQL first** - Must be running
✅ **Use deploy-simple.sh** for development
✅ **Use deploy-production.sh** for production testing

## File Locations
- **Scripts**: `./` (root) and `./scripts/`
- **Backend logs**: `backend/production.log`
- **Frontend logs**: `frontend.log`
- **Database**: PostgreSQL on localhost:5432

## Need Help?
1. Run `./scripts/status.sh` to see what's running
2. Check logs: `tail -f backend/production.log`
3. Restart everything: `./deploy-simple.sh`
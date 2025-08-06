# Simple Development Guide

## 🚀 Essential Commands

### Start Development Servers
```bash
./scripts/dev.sh
```
**What it does:**
- Starts backend (Spring Boot) on port 8080
- Starts frontend (Next.js) on port 3000
- Both run in background with hot reload
- Automatically waits for servers to be ready

**Access points:**
- Dashboard: http://localhost:3000/dashboard/
- API: http://localhost:8080/api/users

### Stop All Servers
```bash
./scripts/dev.sh stop
```

### Check Server Status
```bash
./scripts/status.sh
```

### Build for Production
```bash
./scripts/build.sh    # Complete production build
./scripts/deploy.sh   # Build while keeping dev servers running
```

## 📋 Available Scripts (Only 4!)

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `dev.sh` | Start/stop development | Daily development |
| `status.sh` | Check what's running | When confused about server state |
| `build.sh` | Production build | Final deployment |
| `deploy.sh` | Build without stopping dev | Test production while developing |

## 🎯 Typical Workflow

1. **Morning**: `./scripts/dev.sh`
2. **Work on code** (servers auto-reload)
3. **Check status**: `./scripts/status.sh` (if needed)
4. **End of day**: `./scripts/dev.sh stop`

## 🛠️ Manual Commands (if needed)

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
mvn spring-boot:run
```

### Production JAR
```bash
cd backend
java -jar target/multi-template-demo-0.0.1-SNAPSHOT.jar
```

## 🔍 Troubleshooting

### Servers won't start?
```bash
./scripts/dev.sh stop  # Force stop everything
./scripts/dev.sh       # Start fresh
```

### Port conflicts?
```bash
# Kill anything on port 3000 or 8080
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

### Check logs
```bash
tail -f backend/backend.log
tail -f frontend/frontend.log
```

## 🎉 What We Removed

**Removed confusing scripts:**
- ❌ `dev-frontend.sh` (redundant - dev.sh starts both)
- ❌ `backend-restart.sh` (confusing - just restart dev.sh)
- ❌ `backend-dev.sh` (redundant - dev.sh has hot reload)
- ❌ `run.sh` (confusing - overlapped with build.sh)

**Result:** Simple, clear process with just 4 essential scripts!

---

**Bottom line:** Just use `./scripts/dev.sh` for 95% of your development needs!
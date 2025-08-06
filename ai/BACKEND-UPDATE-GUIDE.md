# 🔄 Backend Update Guide - Without Disrupting Frontend

## 🚀 Quick Commands

### Option 1: Manual Backend Restart (Recommended)
```bash
./scripts/backend-restart.sh
```
- ✅ Frontend keeps running
- ✅ Backend restarts in ~10 seconds
- ✅ No lost frontend state

### Option 2: Auto-Restart on Code Changes
```bash
./scripts/backend-dev.sh
```
- ✅ Auto-restarts when Java files change
- ✅ Uses Spring Boot DevTools
- ⚠️ Run in separate terminal from frontend

### Option 3: Just Kill Backend
```bash
pkill -f "java.*multi-template-demo"
# Then restart manually
```

## 📋 Step-by-Step Workflows

### Workflow 1: Backend Code Changes (Manual)
1. **Keep frontend running** in Terminal 1
2. **Make backend changes** in your editor
3. **Run** `./scripts/backend-restart.sh` in Terminal 2
4. **Wait ~10 seconds** for backend to restart
5. **Continue working** - frontend never stopped!

### Workflow 2: Backend with Auto-Restart
1. **Terminal 1**: `./scripts/dev-frontend.sh` (frontend only)
2. **Terminal 2**: `./scripts/backend-dev.sh` (backend with auto-restart)
3. **Edit Java files** - backend restarts automatically
4. **Frontend stays running** throughout

### Workflow 3: Full Control
```bash
# Terminal 1: Frontend only
cd frontend && npm run dev:turbo

# Terminal 2: Backend only
cd backend && mvn spring-boot:run

# When you need to restart backend:
# Ctrl+C in Terminal 2, then run mvn spring-boot:run again
```

## 🛠️ What Changes Require Backend Restart?

### ✅ NEED Restart:
- Java code changes (controllers, services, models)
- application.properties changes
- New dependencies in pom.xml
- Database schema changes

### ❌ DON'T Need Restart:
- Frontend changes (React, CSS, etc.)
- Static resource changes
- Log level changes (if using actuator)

## 💡 Pro Tips

### 1. Use Two Terminals
```bash
# Terminal 1 - Frontend (never stop this)
./scripts/dev-frontend.sh

# Terminal 2 - Backend (restart as needed)
./scripts/backend-restart.sh
```

### 2. Check Backend Status
```bash
# Is backend running?
curl http://localhost:8080/api/users

# Check backend process
ps aux | grep "multi-template-demo"
```

### 3. View Backend Logs
```bash
# Live logs
tail -f backend/backend.log

# Or if using manual start
cd backend && mvn spring-boot:run
# Logs appear in terminal
```

### 4. Database Persistence
- H2 in-memory database resets on restart
- Data is lost when backend restarts
- For persistent data, configure file-based H2 or use PostgreSQL

## 🔥 With Spring Boot DevTools

DevTools is now added to your project! Benefits:
- **Automatic restart** on classpath changes
- **Faster startup** with restart vs cold start
- **LiveReload** integration possible

To use DevTools effectively:
```bash
# Run backend with DevTools
./scripts/backend-dev.sh

# Or manually:
cd backend
mvn spring-boot:run -Dspring-boot.run.fork=false
```

## 🚨 Common Issues

### Backend won't restart?
```bash
# Force kill all Java processes
pkill -f java
# Then start fresh
./scripts/backend-restart.sh
```

### Port 8080 already in use?
```bash
lsof -ti:8080 | xargs kill -9
```

### Frontend lost connection?
- Check if backend is running: `curl http://localhost:8080/api/users`
- Frontend will auto-reconnect when backend is back

## 📊 Architecture Benefits

Your setup now supports:
1. **Independent scaling** - Frontend and backend separate
2. **No downtime** for frontend during backend updates
3. **Faster development** - Update only what changed
4. **Better debugging** - Isolate frontend vs backend issues

## 🎯 Best Practice Workflow

1. **Morning**: Start both with `./scripts/dev.sh`
2. **Frontend work**: Just keep going, hot reload handles it
3. **Backend change**: Run `./scripts/backend-restart.sh` in new terminal
4. **End of day**: `./scripts/dev.sh stop` to clean up

---

Remember: **Your frontend NEVER needs to restart for backend changes!** 🎉
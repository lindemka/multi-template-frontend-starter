# 🔄 Backend Update Guide - Modern Next.js + Spring Boot Workflow

## 🚀 Quick Commands

### Option 1: Use Unified Development Script (Recommended)
```bash
./scripts/dev.sh
```
- ✅ Starts both Next.js frontend and Spring Boot backend
- ✅ Both have hot reload enabled
- ✅ Integrated development experience

### Option 2: Manual Backend Restart
```bash
# Stop backend only
pkill -f "java.*fbase"
# Restart backend
cd backend && mvn spring-boot:run
```
- ✅ Frontend (Next.js) keeps running on port 3000
- ✅ Backend restarts quickly
- ✅ No lost frontend state

### Option 3: Development with Production Build
```bash
./scripts/deploy.sh
# Then access via http://localhost:8080/nextjs/dashboard/
```

## 📋 Step-by-Step Workflows

### Workflow 1: Unified Development (Recommended)
1. **Start both servers**: `./scripts/dev.sh`
2. **Make backend changes** in your editor
3. **Spring Boot DevTools** auto-restarts backend
4. **Next.js** auto-reloads frontend
5. **Access**: http://localhost:3000/dashboard/ (development)

### Workflow 2: Separate Development
```bash
# Terminal 1: Next.js frontend
cd frontend-nextjs && npm run dev

# Terminal 2: Spring Boot backend
cd backend && mvn spring-boot:run
```

### Workflow 3: Production Testing
```bash
# Build and test production deployment
./scripts/deploy.sh

# Access production build via Spring Boot
# http://localhost:8080/nextjs/dashboard/
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

### 1. Modern Development Setup
```bash
# Single command for both (recommended)
./scripts/dev.sh

# Or separate terminals for more control
# Terminal 1 - Next.js frontend
cd frontend-nextjs && npm run dev

# Terminal 2 - Spring Boot backend
cd backend && mvn spring-boot:run
```

### 2. Check Backend Status
```bash
# Is backend running?
curl http://localhost:8080/api/users

# Check backend process
ps aux | grep "fbase"

# Use status script
./scripts/status.sh
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

## 🔥 Next.js + Spring Boot Integration

Modern development setup with integrated hot reload:
- **Next.js**: Automatic rebuild on file changes
- **Spring Boot DevTools**: Automatic restart on Java changes
- **Integrated deployment**: Next.js builds export to Spring Boot static resources

Development workflow:
```bash
# Start integrated development
./scripts/dev.sh

# Next.js dev server: http://localhost:3000/dashboard/
# Spring Boot API: http://localhost:8080/api/users
# Production build: http://localhost:8080/nextjs/dashboard/
```

## 🚨 Common Issues

### Backend won't restart?
```bash
# Force kill all processes
./scripts/dev.sh stop
# Then start fresh
./scripts/dev.sh
```

### Port 8080 already in use?
```bash
lsof -ti:8080 | xargs kill -9
```

### Frontend/Backend connection issues?
- Check servers: `./scripts/status.sh`
- Check backend API: `curl http://localhost:8080/api/users`
- Next.js will auto-reconnect when backend is back
- For production build, ensure Next.js static files are built

## 📊 Modern Architecture Benefits

Your Next.js + Spring Boot setup provides:
1. **Modern frontend** - Next.js 15 with shadcn/ui components
2. **Type-safe development** - TypeScript integration
3. **Flexible deployment** - Development and production builds
4. **Component-driven UI** - shadcn/ui with Tailwind CSS v4
5. **Seamless integration** - Next.js exports to Spring Boot static resources

## 🎯 Best Practice Workflow

1. **Morning**: Start both with `./scripts/dev.sh`
2. **Frontend work**: Next.js hot reload handles changes automatically
3. **Backend changes**: Spring Boot DevTools restarts automatically
4. **Component updates**: Use shadcn/ui components for consistent design
5. **Testing**: Use `./scripts/deploy.sh` for production build testing
6. **End of day**: `./scripts/dev.sh stop` to clean up

---

Remember: **Modern development with Next.js + shadcn/ui + Spring Boot DevTools handles restarts automatically!** 🎉
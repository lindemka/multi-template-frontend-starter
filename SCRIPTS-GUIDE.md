# 📚 Scripts Guide - When to Use Each Script

## 🚀 Development Scripts (Keep Servers Running)

### `./dev.sh` - Main Development Script
- **Purpose**: Start BOTH frontend and backend for development
- **When to use**: Every morning when you start working
- **What it does**:
  - Starts backend on http://localhost:8080
  - Starts frontend on http://localhost:3000 with hot reload
  - Both servers stay running until you stop them
- **To stop**: Run `./dev.sh stop`

### `./dev-frontend.sh` - Frontend Only Development
- **Purpose**: Start ONLY the frontend dev server
- **When to use**: When backend is already running and you only need frontend
- **What it does**:
  - Checks if backend is running
  - Starts frontend on http://localhost:3000
  - Uses Turbopack for ultra-fast hot reload
- **Stays running**: Yes

### `./backend-restart.sh` - Restart Backend Only
- **Purpose**: Restart backend without touching frontend
- **When to use**: After making Java code changes
- **What it does**:
  - Kills existing backend process
  - Starts new backend on http://localhost:8080
  - Frontend keeps running on :3000
- **Frontend stays running**: Yes!

### `./backend-dev.sh` - Backend with Auto-Restart
- **Purpose**: Backend development with auto-restart on code changes
- **When to use**: When actively developing backend code
- **What it does**:
  - Uses Spring Boot DevTools
  - Auto-restarts when Java files change
  - Frontend can run separately
- **Requires**: Spring Boot DevTools in pom.xml

## 📦 Deployment Scripts

### `./deploy.sh` - Deploy Without Stopping Dev Servers ✨
- **Purpose**: Build and deploy while keeping dev servers running
- **When to use**: When you want to test production build without stopping development
- **What it does**:
  - Builds frontend production bundle
  - Copies to Spring Boot resources
  - Builds Spring Boot JAR
  - Dev servers keep running!
- **Result**: 
  - Dev still on :3000 and :8080
  - Production JAR ready at `backend/target/*.jar`

### `./build.sh` - Full Production Build & Run
- **Purpose**: Complete production build and run (STOPS dev servers)
- **When to use**: Testing full production deployment
- **What it does**:
  - Stops all dev servers
  - Builds everything from scratch
  - Starts production server on :8080
  - Opens browser automatically
- **Warning**: This stops your dev servers!

## 🔍 Utility Scripts

### `./status.sh` - Check What's Running
- **Purpose**: See status of all servers
- **When to use**: To check what's currently running
- **Shows**:
  - Frontend status (port 3000)
  - Backend status (port 8080)
  - Process IDs
  - Number of users in database

## 💡 Common Workflows

### Morning Start
```bash
./dev.sh
# Both servers start, you're ready to code!
```

### Frontend Changes Only
```bash
# Just save your files - hot reload handles it!
# No need to restart anything
```

### Backend Changes
```bash
# Option 1: Manual restart
./backend-restart.sh

# Option 2: Auto-restart mode
./backend-dev.sh  # In separate terminal
```

### Deploy for Testing (Keep Dev Running)
```bash
./deploy.sh
# Creates production build without stopping dev
# Test with: java -jar backend/target/*.jar
```

### Full Production Test
```bash
./build.sh
# Warning: Stops dev servers!
# Runs production on :8080
```

### Check Status
```bash
./status.sh
# See what's running
```

### Stop Everything
```bash
./dev.sh stop
# Stops all dev servers
```

## 🎯 Best Practices

1. **Use `./dev.sh` for daily development** - It's the fastest way to get started
2. **Use `./deploy.sh` for deployments** - Keeps your dev environment running
3. **Use `./backend-restart.sh` for Java changes** - Frontend stays up
4. **Use `./status.sh` when confused** - Shows what's actually running

## ⚡ Speed Tips

- Frontend hot reload is instant (Turbopack)
- Backend restart takes ~10 seconds
- Use two terminals: one for frontend logs, one for backend commands
- The deploy script lets you test production without stopping development!
# 📚 Scripts Guide - Simplified Development

## 🎯 Only 4 Scripts (Cleaned Up!)

We removed confusing and redundant scripts. Here's what remains:

## 🚀 Essential Scripts

### `./scripts/dev.sh` - Development Environment
- **Purpose**: Start both frontend and backend for development
- **Usage**: 
  - `./scripts/dev.sh` - Start servers
  - `./scripts/dev.sh stop` - Stop servers
- **What it does**:
  - Starts Spring Boot backend on port 8080
  - Starts Next.js frontend on port 3000
  - Both run in background with hot reload
  - Waits for servers to be ready
- **When to use**: 95% of your development time

### `./scripts/status.sh` - Check Server Status
- **Purpose**: See what's currently running
- **Usage**: `./scripts/status.sh`
- **Shows**:
  - Frontend status (port 3000)
  - Backend status (port 8080)
  - Process IDs
  - Database user count
  - Quick commands
- **When to use**: When you're confused about server state

### `./scripts/build.sh` - Production Build
- **Purpose**: Complete production build and run
- **Usage**: `./scripts/build.sh`
- **What it does**:
  - Stops development servers
  - Builds Next.js for production
  - Builds Spring Boot JAR
  - Runs production server
- **When to use**: Final deployment testing
- **Warning**: Stops dev servers!

### `./scripts/deploy.sh` - Build While Developing
- **Purpose**: Build production without stopping dev servers
- **Usage**: `./scripts/deploy.sh`
- **What it does**:
  - Builds Next.js for production
  - Builds Spring Boot JAR
  - Keeps dev servers running
- **When to use**: Test production build while keeping development running

## 🧹 What We Removed (And Why)

### ❌ Removed Scripts
- **`dev-frontend.sh`** - Redundant (dev.sh starts both)
- **`backend-restart.sh`** - Confusing (just restart dev.sh)
- **`backend-dev.sh`** - Redundant (dev.sh has hot reload)
- **`run.sh`** - Confusing (overlapped with build.sh)

### ✅ Why This Is Better
- **Simpler**: Just use dev.sh for daily work
- **Less confusing**: No more "which script should I use?"
- **More reliable**: One script that always works
- **Cleaner**: Focused on essential tasks only

## 🎯 Decision Tree

```
Need to develop? → ./scripts/dev.sh
Need to stop? → ./scripts/dev.sh stop
Confused about status? → ./scripts/status.sh
Need production build? → ./scripts/build.sh
Need to test prod while developing? → ./scripts/deploy.sh
```

## 📋 Common Workflows

### Daily Development
```bash
# Morning
./scripts/dev.sh

# Work on code (servers auto-reload)

# End of day
./scripts/dev.sh stop
```

### Production Testing
```bash
# Keep dev running, build prod
./scripts/deploy.sh

# Test prod JAR
cd backend
java -jar target/multi-template-demo-0.0.1-SNAPSHOT.jar
```

### When Things Go Wrong
```bash
# Force stop everything
./scripts/dev.sh stop

# Check what's running
./scripts/status.sh

# Start fresh
./scripts/dev.sh
```

## 🎉 Benefits of Simplified Approach

1. **Less cognitive load** - Only 4 scripts to remember
2. **Clearer purpose** - Each script has a distinct, obvious use case
3. **More reliable** - Fewer edge cases and conflicts
4. **Better for teams** - Everyone uses the same simple workflow
5. **Easier onboarding** - New developers aren't confused by options

---

**Bottom line: Just use `./scripts/dev.sh` for daily development!**
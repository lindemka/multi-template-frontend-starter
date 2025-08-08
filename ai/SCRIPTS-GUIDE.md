# 📚 Scripts Guide - Simplified Development

## 🎯 Scripts Overview

All scripts live in `scripts/`. Use the essential ones for day-to-day; optional ones are for specific tasks.

## 🚀 Essential Scripts

### `./scripts/dev.sh` - Development Environment
- **Purpose**: Start both frontend and backend for development
- **Usage**: 
  - `./scripts/dev.sh` - Start both
  - `./scripts/dev.sh --backend-only` - Start backend only
  - `./scripts/dev.sh --frontend-only` - Start frontend only
  - `./scripts/dev.sh --no-wait` - Do not wait for readiness
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
  - Backend status (port 8080) via `/health`
  - Process IDs
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

## 🛠️ Optional Scripts (under `scripts/optional/`)

- `dev-clean.sh`: remove caches, restart fresh
- `migrate-to-postgres.sh`: run backend with Postgres profile
- `test-api.sh`: quick API smoke tests
- `test-dashboard.sh`: quick UI smoke steps
- `create-test-user.sh`: helper for seeding a user

## ❌ Removed Scripts

- `deploy-isolated.sh`, `deploy-safe.sh`, `deploy-optimized.sh` (redundant)

## 🎯 Decision Tree

```
Need to develop? → ./scripts/dev.sh
Need to stop? → ./scripts/dev.sh stop
Confused about status? → ./scripts/status.sh
Need production build? → ./scripts/build.sh
Need to test prod while developing? → ./scripts/deploy.sh
Need cleanup/migration/tests? → scripts/optional/*
Before pushing CI or larger changes? → ./scripts/checks.sh
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
java -jar target/fbase-0.0.1-SNAPSHOT.jar
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

## 🗄️ Database & Data Scripts

- `./scripts/db.sh`:
  - `up`/`down` Postgres + Adminer
  - `psql` shell
  - Example: `./scripts/db.sh up` then open Adminer at http://localhost:8081

- `./scripts/sql.sh` (via `/api/db/*` endpoints):
  - Query: `echo "SELECT COUNT(*) FROM users" | ./scripts/sql.sh`
  - DML: `./scripts/sql.sh -t dml "UPDATE users SET enabled=false WHERE id=42"`
  - DDL: `./scripts/sql.sh -t ddl "ALTER TABLE users ADD COLUMN bio text"`
  - Batch: `./scripts/sql.sh -t batch -f statements.sql`

- `./scripts/db-actions.sh` quick actions:
  - Users: `user add|rename|delete` (e.g., `./scripts/db-actions.sh user rename --old alice --new alice2`)
  - Profiles: `profile add|update` (e.g., `./scripts/db-actions.sh profile add --user-id 12 --name "Alice"`)
  - Startups: `startup add` (e.g., `./scripts/db-actions.sh startup add --name "Acme AI" ...`)
  - Tables: `table add-column|drop` (e.g., `./scripts/db-actions.sh table add-column --table users --column bio --type text`)

Notes:
- In production, `/api/db/**` endpoints must be ADMIN-only (see `SecurityConfig`).
- For full context and examples, see `ai/OPERATIONS-RUNBOOK.md` (Database sections).
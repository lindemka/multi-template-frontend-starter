# Operations Runbook: Develop, Build, Deploy, Test

This is the authoritative guide for running the app in development and production, building artifacts, deploying, and testing after changes.

## Environments & Requirements

- Java via jenv: Java 21 (run `eval "$(jenv init -)" && jenv local 21 && jenv shell 21`)
- Node.js: v22.x (see `frontend/package.json` engines)
- Ports: frontend 3000, backend 8080
- Env vars:
  - `DB_PASSWORD` (backend; defaults to `password` for local)
  - Optional: `SPRING_PROFILES_ACTIVE=postgres` if using Postgres

## Daily Development

- Start: `./scripts/dev.sh`
- Status: `./scripts/status.sh`
- Stop: `./scripts/dev.sh stop`

What it does:
- Backend: Spring Boot on 8080 with hot reload
- Frontend: Next.js dev on 3000 with HMR; API requests proxy to 8080

## Production Build & Local Verification

- Build both apps (artifacts only, dev keeps running): `./scripts/deploy.sh`
- Full stop-and-run production (local): `./scripts/build.sh`

Artifacts:
- Backend JAR: `backend/target/fbase-0.0.1-SNAPSHOT.jar`

Run backend JAR manually:
```bash
cd backend
java -jar target/fbase-0.0.1-SNAPSHOT.jar
```

Note: We do not use static export; Next runs as a server in development and its build artifacts are used by the backend in production.

## Testing After Changes

Always verify these after meaningful edits:

- Servers:
  - `./scripts/status.sh`
  - Frontend at `http://localhost:3000/` and `http://localhost:3000/dashboard`
  - Backend health: `curl -s http://localhost:8080/health | cat`

- API connectivity:
  - Unauthed endpoints (if any) respond
  - Auth flow at `/login` works; token is stored; dashboard loads

- Navigation & assets:
  - All pages load without console errors
  - Static assets load (icons, fonts)

- Build verification:
  - `./scripts/deploy.sh` completes without errors
  - Optionally run the JAR and spot-check key routes

## Automated Tests

- Backend (JUnit):
  - Run: `cd backend && mvn -q -DskipITs test`
  - Example: `HealthControllerTest` asserts `/health` returns `status=UP`

- Frontend (Vitest + RTL):
  - Run: `cd frontend && npm run test`
  - Watch: `cd frontend && npm run test:watch`

## Troubleshooting

- Port in use: stop with `./scripts/dev.sh stop`, or kill processes on 3000/8080
- Java mismatch: ensure `jenv local 21` and `mvn -v` shows Java 21
- DB password: export `DB_PASSWORD=password` (or your value)
- Frontend proxy: `frontend/next.config.ts` rewrites `/api/*` → `http://localhost:8080`

## CI/CD Notes

- Build steps should mirror `./scripts/deploy.sh`:
  1) `npm ci` in `frontend` and `npm run build`
  2) `mvn -q -DskipTests package` in `backend`

## Quick Commands

```bash
# Dev
./scripts/dev.sh
./scripts/status.sh
./scripts/dev.sh stop

# Build (no stop)
./scripts/deploy.sh

# Full prod run locally
./scripts/build.sh

# Backend JAR
cd backend && java -jar target/fbase-0.0.1-SNAPSHOT.jar
```


# ⚡ FAST Frontend Development Guide

## 🚀 Quickstart Commands

### Fastest Frontend-Only Development (Backend must be running)
```bash
./scripts/dev-frontend.sh
```

### Full Stack Development
```bash
./scripts/dev.sh        # Both frontend and backend
./scripts/dev.sh stop   # Stop all servers
```

### Frontend-Only in Terminal
```bash
cd frontend
npm run dev:turbo   # Uses Turbopack for FAST hot reload
```

## 🔥 Hot Reload is Optimized For:

1. **Component Changes** - Instant updates
2. **Style Changes** - Immediate reflection
3. **API Integration** - Proxied to backend automatically
4. **TypeScript** - Incremental checking for speed

## ⚡ Performance Tips

### 1. Use Turbopack (Already configured)
- `npm run dev:turbo` or `./scripts/dev-frontend.sh` uses Turbopack
- 10x faster than standard Webpack

### 2. Skip Type Checking During Dev
- Types are checked separately
- Run `npm run typecheck` in another terminal if needed

### 3. Use the Right Command for Your Task

| Task | Command | Speed |
|------|---------|--------|
| Frontend only (fastest) | `./scripts/dev-frontend.sh` | ⚡⚡⚡ |
| Full stack | `./scripts/dev.sh` | ⚡⚡ |
| Production test | `./scripts/build.sh` | ⚡ |

## 🛠️ Available NPM Scripts

```bash
# Development
npm run dev:turbo      # Fastest with Turbopack
npm run dev:frontend   # Frontend only with env optimizations

# Code Quality (Run in separate terminal)
npm run typecheck      # Check types
npm run lint:fix       # Fix linting issues
npm run check:fix      # Fix all issues

# Clean Start
npm run clean          # Remove all caches and reinstall
```

## 🎯 Common Development Workflows

### 1. Making UI Changes
```bash
# Terminal 1: Start backend (once)
cd backend && mvn spring-boot:run

# Terminal 2: Start frontend with hot reload
./scripts/dev-frontend.sh

# Make changes - they appear instantly!
```

### 2. Full Stack Development
```bash
./scripts/dev.sh  # Starts everything
# Make changes to frontend or backend
# Frontend: instant reload
# Backend: restart required
```

### 3. Quick Iteration Cycle
1. Use `./scripts/dev-frontend.sh` for frontend work
2. Keep backend running separately
3. Changes appear in < 1 second
4. No manual refresh needed!

## 📁 Important Files

- `/frontend/src/app/page.tsx` - Landing page
- `/frontend/src/app/dashboard/page.tsx` - Dashboard
- `/frontend/src/components/` - All components
- `/frontend/src/lib/api.ts` - API client

## 🔧 Troubleshooting

### Frontend not updating?
1. Check if using `--turbo` flag
2. Clear `.next` folder: `rm -rf frontend/.next`
3. Restart with `./scripts/dev-frontend.sh`

### Backend connection issues?
1. Ensure backend is on port 8080
2. Check `frontend/next.config.ts` has proxy setup
3. API calls should use `/api/*` not `http://localhost:8080/api/*`

### Port already in use?
```bash
./scripts/dev.sh stop  # Kills all project processes
# Or manually:
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Backend
```

## 💡 Pro Tips

1. **Use Two Terminals**: One for backend, one for frontend
2. **Browser DevTools**: Keep React DevTools open
3. **Error Overlay**: Next.js shows errors in browser
4. **Fast Refresh**: Works with React Hooks!
5. **API Proxy**: No CORS issues in development

## 🚨 CRITICAL for Fast Iteration

1. **ALWAYS use Turbopack** (`--turbo` flag)
2. **Keep backend running** separately
3. **Don't restart unless necessary**
4. **Use `./scripts/dev-frontend.sh`** for UI work

---

Remember: **Speed is critical!** Use the fastest tool for your current task.
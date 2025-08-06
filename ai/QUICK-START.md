# Quick Start for fbase (Next.js + shadcn/ui)

## Essential Commands

```bash
# Start development environment (both frontend and backend)
./scripts/dev.sh

# Check server status
./scripts/status.sh

# Production build
./scripts/build.sh

# Development build without stopping servers
./scripts/deploy.sh

# Quick Tests
curl -s http://localhost:3000/dashboard/ | grep -c "Dashboard"
curl -s http://localhost:8080/api/users
```

## Project Structure

### Frontend (Next.js + shadcn/ui)
- `frontend-nextjs/` - Modern Next.js application
- `frontend-nextjs/src/app/dashboard/` - Dashboard pages
- `frontend-nextjs/src/components/ui/` - shadcn/ui components
- `frontend-nextjs/src/components/dashboard/` - Custom dashboard components
- `frontend-nextjs/src/lib/` - Utilities and configurations

### Backend (Spring Boot)
- `backend/src/main/java/` - Java application code
- `backend/src/main/resources/static/` - Static resources and Next.js build output

### Build Config
- `frontend-nextjs/next.config.ts` - Next.js configuration
- `backend/pom.xml` - Maven configuration

## Common Tasks

### Add New Page
1. **Create page** in `frontend-nextjs/src/app/dashboard/[page]/`
2. **Use shadcn/ui components** from `src/components/ui/`
3. **Follow existing patterns** in dashboard components
4. **Add navigation** to sidebar component
5. **Use TypeScript** for type safety

### Add shadcn/ui Component
1. Run `npx shadcn@canary add [component-name]`
2. Components install to `src/components/ui/`
3. Import and use in your pages

### Modify Styles
1. Edit component-specific styles using Tailwind CSS
2. Global styles in `frontend-nextjs/src/app/globals.css`
3. Changes auto-reload in dev mode

### Update Navigation
- Dashboard: Edit `frontend-nextjs/src/components/dashboard/sidebar.tsx`
- Mobile: Edit `frontend-nextjs/src/components/dashboard/mobile-nav.tsx`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Servers won't start | Run `./scripts/dev.sh stop` then `./scripts/dev.sh` |
| Port conflicts | Kill processes: `lsof -ti:3000 \| xargs kill -9` |
| Build fails | Check both Next.js and Spring Boot logs |
| shadcn/ui component issues | Ensure using canary version for Tailwind v4 |
| API connection failed | Verify backend is running on port 8080 |
| **Production build issues** | **Run `./scripts/build.sh` for complete rebuild** |
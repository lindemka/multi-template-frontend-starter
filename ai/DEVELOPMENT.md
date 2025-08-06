# Development Guide - Fast Frontend Development

## 🚀 Quick Start

### For Fast Frontend Development (Recommended)
```bash
./scripts/dev.sh
```
This starts both backend (port 8080) and frontend (port 3000) with **hot reloading**.

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/users
- Changes reload instantly!

### Manual Commands
```bash
# Frontend only (port 3000)
cd frontend-nextjs && npm run dev

# Backend only (port 8080)
cd backend && mvn spring-boot:run

# Both together
cd frontend-nextjs && npm run dev:all
```

## 🎯 Best Practices

### 1. **Fast Development Workflow**
- Use `./scripts/dev.sh` for development
- Frontend changes reload instantly (< 1 second)
- No need to rebuild for frontend changes
- API calls automatically proxy to backend

### 2. **Code Quality**
```bash
# Run before committing
cd frontend-nextjs
npm run check  # Runs lint + typecheck in parallel
```

### 3. **Component Development**
- Use Shadcn/ui components from `@/components/ui`
- Follow existing patterns in `src/components`
- TypeScript is enforced - no `any` types

### 4. **API Integration**
```typescript
// Development: Calls http://localhost:8080/api/users
// Production: Calls /api/users (same domain)
const response = await axios.get('/api/users');
```

## 📁 Project Structure

```
frontend-nextjs/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/
│   │   ├── ui/          # Shadcn/ui components
│   │   ├── dashboard/   # Dashboard components
│   │   └── layouts/     # Layout components
│   ├── lib/
│   │   ├── api.ts       # API client
│   │   └── utils/       # Utilities
│   └── styles/          # Global styles
├── public/              # Static assets
└── next.config.ts       # Next.js configuration
```

## 🔧 Development vs Production

### Development Mode
- No basePath - runs on http://localhost:3000
- API proxy to backend on port 8080
- Hot Module Replacement (HMR)
- React Strict Mode enabled
- Source maps for debugging

### Production Mode
- BasePath `/nextjs` for Spring Boot integration
- Static export to backend resources
- Optimized bundle size
- No API proxy (same domain)

## 🛠️ Common Tasks

### Adding a New Page
```bash
# Create new page in app directory
touch src/app/my-page/page.tsx
```

### Adding Shadcn/ui Component
```bash
npx shadcn@canary add button
npx shadcn@canary add card
# etc.
```

### Updating API Client
Edit `src/lib/api.ts` - changes reflect immediately.

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Dependencies Out of Sync
```bash
cd frontend-nextjs
rm -rf node_modules
npm install
```

### Type Errors
```bash
cd frontend-nextjs
npm run typecheck
```

## 🏃‍♂️ Performance Tips

1. **Use Turbopack** (already configured)
   - 10x faster than Webpack
   - Incremental compilation

2. **Component Lazy Loading**
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

3. **API Response Caching**
   - React Query handles caching automatically
   - Configure stale time in `QueryClient`

## 📝 VS Code Setup

Recommended extensions:
- **ESLint** - For linting
- **Prettier** - For formatting
- **Tailwind CSS IntelliSense** - For Tailwind classes
- **TypeScript Error Lens** - See errors inline

Settings (.vscode/settings.json):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🎉 Ready to Code!

Start with `./scripts/dev.sh` and enjoy instant reloading! Make changes in `src/` and see them immediately in your browser.
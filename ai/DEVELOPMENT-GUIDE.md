# Development Guide - Unified Quick Start

## 🚀 Essential Commands

### Start Development Environment
```bash
# Recommended: Start both servers with hot reloading
./scripts/dev.sh

# Access points:
# Next.js Dashboard: http://localhost:3000/dashboard/
# Production Dashboard: http://localhost:8080/nextjs/dashboard/
# API: http://localhost:8080/api/users

# Stop all servers:
./scripts/dev.sh stop
```

### Check Server Status
```bash
./scripts/status.sh
```

### Production Build
```bash
# Build production while keeping dev servers running
./scripts/deploy.sh

# Full production build (stops dev servers)
./scripts/build.sh
```

## ⚡ Frontend Development

### Fast Frontend-Only Development
```bash
# Frontend with Turbopack (fastest hot reload)
cd frontend
npm run dev:turbo

# Or use the script
./scripts/dev-frontend.sh
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build (exports to Spring Boot)
npm run build

# Run tests
npm test

# Linting
npm run lint

# Type checking
npm run typecheck
```

## 🗄️ Backend Development

### Backend Commands
```bash
cd backend

# Development server (localhost:8080)
mvn spring-boot:run

# Production build
mvn clean package -DskipTests

# Run built JAR
java -jar target/fbase-0.0.1-SNAPSHOT.jar

# Run with tests
mvn clean test
mvn clean verify
```

## 📁 Project Structure

```
project1/
├── frontend/               # Next.js app with Shadcn/ui
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Shadcn/ui components
│   │   │   └── dashboard/ # Dashboard features
│   │   ├── lib/           # Utilities and API
│   │   └── types/         # TypeScript definitions
│   └── next.config.ts     # Next.js configuration
├── backend/               # Spring Boot API
│   ├── src/main/
│   │   ├── java/          # Java source code
│   │   └── resources/
│   │       └── static/    # Deployed frontend files
│   └── pom.xml            # Maven configuration
└── scripts/               # Development scripts
    ├── dev.sh             # Start both servers
    ├── build.sh           # Production build
    ├── deploy.sh          # Deploy without stopping
    └── status.sh          # Check server status
```

## 🔥 Hot Reload Optimizations

1. **Component Changes** - Instant updates
2. **Style Changes** - Immediate reflection  
3. **API Integration** - Proxied to backend automatically
4. **TypeScript** - Incremental checking for speed

## 🎯 Best Practices

### Development Workflow
1. Use `./scripts/dev.sh` for full-stack development
2. Keep both servers running during development
3. Use `deploy.sh` to test production builds without stopping dev
4. Frontend changes reflect instantly with hot reload
5. Backend changes require restart (Spring Boot DevTools helps)

### Component Development
- Use existing Shadcn/ui patterns from `components/ui/`
- Follow TypeScript conventions in `types/`
- Keep components modular and reusable
- Use React Query for API data fetching

### API Integration
- API endpoints: `http://localhost:8080/api/`
- Use React Query hooks in `lib/api.ts`
- TypeScript types in `types/api.ts`
- Handle loading and error states properly

## 🧪 Testing

### Quick Tests
```bash
# Test UI deployment
curl -s http://localhost:3000/dashboard/ | grep -c "Dashboard"

# Test API
curl -s http://localhost:8080/api/users

# Test production build
curl -s http://localhost:8080/nextjs/dashboard/ | grep -c "min-h-screen"
```

### Component Testing
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Integration Testing
```bash
cd backend
mvn test                 # Unit tests
mvn verify               # Integration tests
```

## 🚨 Common Issues

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :3000           # Find process
kill -9 <PID>           # Kill process

# Or use the stop command
./scripts/dev.sh stop
```

### Build Not Updating
- Clear Next.js cache: `rm -rf frontend/.next`
- Rebuild JAR: `./scripts/build.sh`
- Clear browser cache

### API Connection Issues
- Ensure backend is running: `./scripts/status.sh`
- Check CORS configuration in Spring Boot
- Verify proxy settings in Next.js config

### Component Not Found
- Run `npm install` in frontend directory
- Check Shadcn/ui installation: `npx shadcn-ui@latest add <component>`
- Verify imports match file structure

## 📚 Additional Resources

- **Shadcn/ui Docs**: https://ui.shadcn.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Project AI Context**: `/ai/AI-CONTEXT.md`
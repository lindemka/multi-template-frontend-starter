# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 AI Documentation Location

**IMPORTANT**: All comprehensive AI documentation is located in the `/ai/` folder:
- **Start here**: `/ai/AI-CONTEXT.md` - Complete project context and technology stack
- **Current status**: `/ai/PROJECT-STATUS.md` - What's completed and working
- **Architecture**: `/ai/ARCHITECTURE.md` - System design overview
- **Components**: `/ai/COMPONENT-GUIDE.md` - Shadcn/ui usage patterns
- Make sure all ai docs are in the ai folder

## Build and Development Commands

### 🚀 Quick Start - Development (SIMPLE & RELIABLE)
```bash
# Start both servers with hot reloading
./scripts/dev.sh

# Access points:
# Dashboard: http://localhost:3000/dashboard/
# API: http://localhost:8080/api/users

# Stop servers:
./scripts/dev.sh stop
```

### 📦 Production Build & Deploy

#### Deploy WITHOUT Stopping Dev Servers (Recommended)
```bash
# Build production while keeping dev servers running
./scripts/deploy.sh

# Dev servers stay on :3000 and :8080
# Production JAR created at backend/target/*.jar
```

#### Full Production Build & Run
```bash
# Complete build and run (STOPS dev servers)
./scripts/build.sh

# Access at: http://localhost:8080/
```

### Frontend (Next.js with Shadcn/ui)
```bash
cd frontend

# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build (exports to Spring Boot)
npm run build
```

### Backend (Spring Boot)
```bash
cd backend

# Development server (localhost:8080)
mvn spring-boot:run

# Production build
mvn clean package -DskipTests

# Run built JAR
java -jar target/multi-template-demo-0.0.1-SNAPSHOT.jar
```

### Clean Build Process
The `scripts/build.sh` script handles the complete build process:
1. Cleans old builds
2. Builds Next.js (exports to Spring Boot)
3. Creates root redirect to Next.js app
4. Packages everything into Spring Boot JAR

### Integration Testing
```bash
# Test Shadcn UI deployment
curl -s http://localhost:8080/nextjs/dashboard/ | grep -c "min-h-screen bg-background"

# Test API functionality  
curl -s http://localhost:8080/api/users | jq 'length'

# Test component loading
curl -I http://localhost:8080/nextjs/_next/static/css/
```

## Current Architecture (Updated August 2025)

This is a **modern React-based system** with Next.js frontend and Spring Boot backend:

### 🚀 Primary System: Next.js + Shadcn/ui
- **Frontend**: Next.js 15 with TypeScript and App Router
- **UI Library**: Shadcn/ui components with Tailwind CSS v4
- **Backend**: Spring Boot 3.4.2 with RESTful API
- **Database**: H2 in-memory for development
- **Deployment**: Next.js static export to Spring Boot resources

### 📦 Legacy System: Gulp Templates (Archived)
- **Status**: Maintained in `/archive/` for reference only
- **Usage**: Original dashboard and multipurpose templates
- **Note**: Replaced by modern Shadcn/ui implementation

### 🏗️ File Structure

```
project1/
├── frontend/               # 🚀 Primary Next.js app  
│   ├── src/
│   │   ├── app/                    # Next.js pages
│   │   ├── components/ui/          # Shadcn/ui components
│   │   ├── components/dashboard/   # Dashboard features
│   │   └── components/layouts/     # Layout components
│   └── next.config.ts              # Exports to Spring Boot
├── backend/                # 🗄️ Spring Boot API
│   ├── src/main/java/             # Java source
│   └── src/main/resources/static/ # Deployed frontend
└── ai/                     # 🤖 AI documentation
    └── CLAUDE.md          # This file - build commands
```

### 🔄 Build Process

1. **Frontend Build**: `npm run build` in `frontend/`
2. **Static Export**: Files copied to `backend/src/main/resources/static/nextjs/`
3. **Backend Build**: `mvn clean package -DskipTests` in `backend/`
4. **Deployment**: JAR includes both frontend and API

### 🎯 Key Components

- **UserTableShadcn**: Modern data table with sorting, filtering
- **DashboardLayoutShadcn**: Responsive layout with mobile drawer
- **Shadcn UI**: Button, Avatar, Badge, Table, Sheet, Input components
- **React Query**: API data fetching with loading states
- **TypeScript**: Full type safety across frontend

## Development Workflow

1. **Start here**: Read `/ai/AI-CONTEXT.md` for complete understanding
2. **Component development**: Use existing Shadcn/ui patterns
3. **API integration**: Ensure React Query compatibility
4. **Testing**: Verify both frontend dev server and Spring Boot deployment
5. **Documentation**: Update `/ai/` folder for any architectural changes

## Common Issues and Solutions

- **Build not updating**: Rebuild Spring Boot JAR after frontend changes
- **API not loading**: Check Spring Boot server is running on port 8080  
- **Components not working**: Verify Shadcn/ui canary version for Tailwind v4
- **Mobile layout**: Ensure Sheet component properly configured for drawer
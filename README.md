# fbase

A full-stack application: Spring Boot backend + Next.js frontend using shadcn/ui.

## Prerequisites

- Java 21 (via jenv recommended): `eval "$(jenv init -)" && jenv local 21 && jenv shell 21`
- Node.js 22.x and npm
- Maven 3.9+

## Quick Start (Development)

```bash
# From project root
./scripts/dev.sh           # start backend (8080) + frontend (3000)
./scripts/status.sh        # check what's running
./scripts/dev.sh stop      # stop both
```

## Available Pages (Dev)

- **Home**: `http://localhost:3000/` - Landing page
- **Dashboard**: `http://localhost:3000/dashboard` - Dashboard with shadcn/ui components
- **Test**: `http://localhost:3000/test` - Component testing page

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query for server state
- **Type Safety**: Full TypeScript support

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.4.2 with Java 21
- **Database**: H2 (development) with JPA/Hibernate
- **API**: RESTful endpoints with JSON responses
- **Development**: Hot reload with Spring DevTools

## Project Structure

```
fbase/
├── frontend/                       # Next.js frontend
│   ├── src/
│   │   ├── app/                   # Next.js app router pages
│   │   ├── components/            # React components with shadcn/ui
│   │   ├── lib/                   # Utilities and API client
│   │   └── types/                 # TypeScript definitions
│   └── package.json
├── backend/                       # Spring Boot backend
│   ├── src/main/java/            # Java source code
│   └── pom.xml
├── scripts/                       # Build and deployment scripts (essential + optional/legacy)
├── archive/                       # Legacy template files
└── ai/                           # Documentation
```

## Features

- ✅ **Modern Stack**: Next.js 15 + Spring Boot 3.4.2 + Java 21
- ✅ **shadcn/ui Components**: Professional UI component library
- ✅ **Type Safety**: Full TypeScript support throughout
- ✅ **Hot Reload**: Both frontend and backend development servers
- ✅ **Production Ready**: Optimized builds and deployment scripts
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **API Integration**: RESTful backend with React Query client
- ✅ **Development Tools**: ESLint, TypeScript checking, and more

## Builds & Deployment (Local)

```bash
# Build artifacts only (keep dev running)
./scripts/deploy.sh

# Full production build + run (stops dev servers)
./scripts/build.sh
```

## Documentation

All detailed documentation is available in the `/ai` folder:

- `ai/AI-INDEX.md` - Single source of truth for all docs
- `ai/OPERATIONS-RUNBOOK.md` - Run, build, deploy, and testing guide
- `ai/SCRIPTS-GUIDE.md` - Script usage (dev, status, build, deploy)
- `ai/ARCHITECTURE.md` - Technical architecture details
 - Database quick actions and SQL helpers documented in `ai/OPERATIONS-RUNBOOK.md` and `ai/SCRIPTS-GUIDE.md`
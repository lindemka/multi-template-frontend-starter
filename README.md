# fbase

A full-stack application built with Spring Boot backend and Next.js frontend using shadcn/ui components.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Available Pages

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
├── scripts/                       # Build and deployment scripts
├── archive/                       # Legacy template files (to be removed)
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

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Clean build directory
npm run clean
```

## Documentation

All detailed documentation is available in the `/ai` folder:

- `ai/README.md` - Comprehensive project overview
- `ai/COMPONENT-GUIDE.md` - **Navigation guide for template components**
- `ai/ARCHITECTURE.md` - Technical architecture details
- `ai/QUICK-START.md` - Essential commands and workflows for AI 
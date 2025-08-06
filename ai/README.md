# Multi-Template Frontend with Shadcn/ui Integration

A production-ready frontend system integrating modern Shadcn/ui components with Spring Boot backend.

## 🎯 Architecture Overview

### Next.js Frontend (Primary)
- **Framework**: Next.js 15 with App Router and TypeScript
- **UI Library**: Shadcn/ui components with Tailwind CSS v4
- **Purpose**: Modern dashboard with user management, responsive design
- **Key Features**: React Query integration, mobile-first responsive layout
- **Deployment**: Static export to Spring Boot resources

### Spring Boot Backend
- **Framework**: Spring Boot 3.4.2 with Java 21
- **Database**: H2 in-memory database
- **API**: RESTful user management endpoints
- **Integration**: Serves Next.js frontend and provides API data

### Legacy Template System (Archive)
- **Dashboard Template**: Original admin interface (archived)
- **Multipurpose Template**: Original marketing pages (archived)
- **Status**: Maintained for reference, replaced by Shadcn/ui implementation

## Project Structure

```
project1/
├── frontend-nextjs/     # 🚀 Primary Next.js app with Shadcn/ui
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Shadcn/ui components
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   └── layouts/            # Layout components
│   │   ├── lib/                    # Utilities and API functions
│   │   ├── types/                  # TypeScript definitions
│   │   └── providers/              # React context providers
│   ├── components.json             # Shadcn/ui configuration
│   └── next.config.ts              # Next.js configuration
├── backend/             # 🗄️ Spring Boot API server
│   ├── src/main/
│   │   ├── java/                   # Java source code
│   │   └── resources/
│   │       └── static/             # Deployed frontend files
│   │           ├── nextjs/         # Next.js build output
│   │           └── assets/         # Legacy template assets
│   └── pom.xml                     # Maven configuration
├── ai/                  # 🤖 AI documentation (all AI docs here)
│   ├── AI-CONTEXT.md               # Comprehensive AI context
│   ├── PROJECT-STATUS.md           # Current status
│   ├── ARCHITECTURE.md             # System architecture
│   ├── COMPONENT-GUIDE.md          # Component usage guide
│   └── CLAUDE.md                   # Build commands and instructions
└── archive/             # 📦 Original templates (reference only)
```

## Development Workflow

```bash
# Frontend Development (Next.js with Shadcn/ui)
cd frontend-nextjs
npm install
npm run dev              # http://localhost:3000

# Backend Development (Spring Boot)
cd backend
mvn spring-boot:run      # http://localhost:8080

# Production Build & Deploy
cd frontend-nextjs
npm run build            # Exports to backend/src/main/resources/static/nextjs/
cd ../backend
mvn clean package -DskipTests
java -jar target/*.jar   # Serves both frontend and API
```

## Access Points

- **Dashboard**: http://localhost:8080/nextjs/dashboard/
- **API**: http://localhost:8080/api/users
- **H2 Console**: http://localhost:8080/h2-console

## Testing

```bash
# Verify Shadcn UI deployment
curl -s http://localhost:8080/nextjs/dashboard/ | grep -c "min-h-screen bg-background"

# Verify API functionality
curl -s http://localhost:8080/api/users | jq 'length'

# Check component loading
curl -I http://localhost:8080/nextjs/_next/static/css/
```

## AI Development Guidelines

### 📚 Documentation First
1. **Reference AI-CONTEXT.md** - Start here for comprehensive project understanding
2. **Check PROJECT-STATUS.md** - Understand current implementation status
3. **Use COMPONENT-GUIDE.md** - Find existing Shadcn/ui component patterns
4. **ALL AI docs go in `/ai/` folder** - Never place AI documentation elsewhere

### 🎨 UI Development Rules  
1. **Use Shadcn/ui components** - Modern, accessible, well-documented components
2. **Follow existing patterns** - Reference implemented components in `frontend-nextjs/src/components/`
3. **Maintain responsiveness** - Mobile-first design with desktop enhancements
4. **Test integration** - Ensure components work with React Query and API data

### 🔄 Build & Deploy Process
1. **Frontend changes**: Build with `npm run build` in `frontend-nextjs/`
2. **Backend integration**: Rebuild JAR with `mvn clean package -DskipTests`
3. **Test deployment**: Verify at `http://localhost:8080/nextjs/dashboard/`
4. **API validation**: Confirm data loading from Spring Boot endpoints

### 🎯 Key Implementation Areas
- **User Management**: Table with CRUD operations, filtering, sorting
- **Dashboard Layout**: Responsive sidebar, mobile drawer, header navigation  
- **Component Library**: Consistent Shadcn/ui usage across all features
- **API Integration**: React Query for data fetching, error handling, loading states

### 🚨 Critical Notes
- **Tailwind v4**: Use Shadcn canary version for compatibility
- **Static Export**: Next.js builds to Spring Boot static directory
- **Asset Paths**: Use `/nextjs/` base path for all frontend assets
- **Database**: H2 in-memory, data resets on server restart
# AI Documentation Index

## 📖 Complete Documentation Guide for AI Assistants

This index provides a roadmap to all project documentation, organized by use case and priority.

## 🚀 Quick Start for AI Assistants

### Essential Reading (Start Here)
1. **[AI-CONTEXT.md](./AI-CONTEXT.md)** - Complete project context, technology stack, and implementation details
2. **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Current project status, completed features, and next steps
3. **[/ai/CLAUDE.md](./CLAUDE.md)** - Build commands and immediate development instructions

### Implementation Guides
4. **[COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md)** - Shadcn/ui component usage patterns and examples
5. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
6. **[backend-integration-guide.md](./backend-integration-guide.md)** - Backend integration specifics
7. **[QUICK-START.md](./QUICK-START.md)** - Development environment setup

### Development Workflow Guides
8. **[SIMPLE-DEV-GUIDE.md](./SIMPLE-DEV-GUIDE.md)** - Simple development workflow (START HERE)
9. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Detailed frontend development guide
10. **[FAST-DEV-GUIDE.md](./FAST-DEV-GUIDE.md)** - Advanced performance tips
11. **[BACKEND-UPDATE-GUIDE.md](./BACKEND-UPDATE-GUIDE.md)** - Backend-specific workflows
12. **[SCRIPTS-GUIDE.md](./SCRIPTS-GUIDE.md)** - Complete scripts reference
13. **[MCP-SETUP.md](./MCP-SETUP.md)** - Shadcn MCP integration for faster UI development

## 📁 Documentation Organization

### Core AI Documentation (`/ai/` folder)
```
ai/
├── AI-CONTEXT.md              # 🎯 Primary AI context document
├── PROJECT-STATUS.md          # ✅ Current implementation status  
├── DOCUMENTATION-INDEX.md     # 📖 This navigation guide
├── COMPONENT-GUIDE.md         # 🎨 UI component patterns
├── ARCHITECTURE.md            # 🏗️ System architecture
├── backend-integration-guide.md # 🔌 API integration details
├── QUICK-START.md             # ⚡ Setup instructions
├── CLAUDE.md                  # 🔧 Build commands and quick reference
├── DEVELOPMENT.md             # 💻 Development guide
├── BACKEND-UPDATE-GUIDE.md    # 🔄 Backend update workflows
├── SIMPLE-DEV-GUIDE.md        # ⚡ Simple development workflow (RECOMMENDED)
├── FAST-DEV-GUIDE.md          # ⚡ Advanced frontend development tips
├── SCRIPTS-GUIDE.md           # 📚 Detailed scripts reference
├── MCP-SETUP.md               # 🔌 Model Context Protocol integration
└── README.md                  # 📋 AI development guidelines
```

### Root Level Files
```
/
├── ai/                        # 🤖 All AI documentation (this folder)
├── README.md                  # 📄 General project README
├── frontend/                  # 🚀 Next.js app with Shadcn/ui
├── backend/                   # 🗄️ Spring Boot API
├── scripts/                   # 🛠️ Development scripts
└── archive/                   # 📦 Legacy templates (reference only)
```

## 🎯 Documentation by Use Case

### For Understanding the Project
1. **Start with**: [AI-CONTEXT.md](./AI-CONTEXT.md) - Complete overview
2. **Then read**: [PROJECT-STATUS.md](./PROJECT-STATUS.md) - What's implemented
3. **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - How it's built

### For Development Tasks
1. **Build commands**: [CLAUDE.md](./CLAUDE.md) - Immediate reference
2. **Component work**: [COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md) - UI patterns
3. **API integration**: [backend-integration-guide.md](./backend-integration-guide.md) - Backend details
4. **Setup**: [QUICK-START.md](./QUICK-START.md) - Environment configuration
5. **Development workflow**: [DEVELOPMENT.md](./DEVELOPMENT.md) - Fast development tips
6. **Backend updates**: [BACKEND-UPDATE-GUIDE.md](./BACKEND-UPDATE-GUIDE.md) - Update backend safely
7. **Scripts usage**: [SCRIPTS-GUIDE.md](./SCRIPTS-GUIDE.md) - Which script to use when

### For Project Planning
1. **Current status**: [PROJECT-STATUS.md](./PROJECT-STATUS.md) - What's done
2. **Next steps**: [AI-CONTEXT.md](./AI-CONTEXT.md#-active-development-areas) - Future enhancements
3. **Guidelines**: [README.md](./README.md) - Development rules

## 🔍 Quick Reference Lookup

### Technology Stack Questions
**File**: [AI-CONTEXT.md](./AI-CONTEXT.md#-current-technology-stack)
- Next.js 15, TypeScript, Tailwind CSS v4
- Shadcn/ui (canary), React Query, Radix UI
- Spring Boot 3.4.2, Java 21, H2 Database

### Component Implementation
**File**: [COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md)  
- Shadcn/ui component examples
- Layout patterns and responsive design
- Form handling and data integration

### Build and Deployment
**File**: [CLAUDE.md](./CLAUDE.md#build-and-development-commands)
- Frontend: `npm run build` in `frontend-nextjs/`
- Backend: `mvn clean package -DskipTests` in `backend/`
- Testing: API and UI verification commands

### API Integration
**File**: [backend-integration-guide.md](./backend-integration-guide.md)
- User management endpoints
- React Query setup and patterns
- Error handling and loading states

### Project Structure
**File**: [AI-CONTEXT.md](./AI-CONTEXT.md#-project-structure--ai-documentation-location)
- Frontend: Next.js app with Shadcn/ui components
- Backend: Spring Boot API with static resource serving
- Build: Automated deployment pipeline

## 🚨 Critical Information for AI Assistants

### Documentation Rules
- **ALL AI documentation goes in `/ai/` folder** - Never place elsewhere
- **Update this index** when adding new documentation
- **Reference existing docs** before creating new ones
- **Keep docs current** with implementation changes

### Development Guidelines
- **Use Shadcn/ui components** - Modern, accessible, well-documented
- **Follow existing patterns** - Reference implemented components
- **Test integration** - Ensure frontend and backend work together
- **Maintain responsiveness** - Mobile-first design approach

### Common Patterns
- **Component structure**: TypeScript with proper type definitions
- **API integration**: React Query for data fetching and state management
- **Styling**: Tailwind CSS v4 with Shadcn design tokens
- **Layout**: Responsive sidebar with mobile drawer fallback

---

**Last Updated**: August 6, 2025
**Status**: Complete - Shadcn/ui integration fully implemented
**Next Review**: When adding new major features or architectural changes
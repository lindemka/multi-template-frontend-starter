# AI Documentation Index - Single Source of Truth

## 📖 Essential Documentation (Start Here)

### Core Context Files
1. **[AI-CONTEXT.md](./AI-CONTEXT.md)** - Complete project context, technology stack, and implementation details
2. **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Current project status, completed features, and next steps
3. **[CLAUDE.md](./CLAUDE.md)** - Build commands and immediate development instructions
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions

### Development Guides (Consolidated)
5. **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** - Unified development guide (frontend & full-stack)
6. **[BACKEND-GUIDE.md](./BACKEND-GUIDE.md)** - Backend API development and integration
7. **[MCP-GUIDE.md](./MCP-GUIDE.md)** - Model Context Protocol for Shadcn/ui assistance

### Component & UI
8. **[COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md)** - Shadcn/ui component usage patterns and examples
9. **[SCRIPTS-GUIDE.md](./SCRIPTS-GUIDE.md)** - Development scripts reference
10. **[OPERATIONS-RUNBOOK.md](./OPERATIONS-RUNBOOK.md)** - Dev/Prod run, build, deploy, testing

### Project Management
10. **[PROJECT-CLEANUP-SUMMARY.md](./PROJECT-CLEANUP-SUMMARY.md)** - Recent cleanup and improvements

## 📁 Directory Structure

```
ai/
├── Core Documentation (This folder)
│   ├── AI-INDEX.md              # 📖 This file - navigation hub
│   ├── AI-CONTEXT.md            # 🎯 Primary AI context
│   ├── PROJECT-STATUS.md        # ✅ Implementation status
│   ├── CLAUDE.md                # 🔧 Build commands
│   ├── ARCHITECTURE.md          # 🏗️ System design
│   ├── DEVELOPMENT-GUIDE.md     # 💻 Dev workflow (NEW - consolidated)
│   ├── BACKEND-GUIDE.md         # 🔌 Backend guide (NEW - consolidated)
│   ├── MCP-GUIDE.md             # 🤖 MCP integration (NEW - consolidated)
│   ├── COMPONENT-GUIDE.md       # 🎨 UI patterns
│   └── SCRIPTS-GUIDE.md         # 📚 Scripts reference
│
├── planning/                     # Strategic planning documents
│   ├── FBASE_VISION.md
│   └── archive/                 # Historical planning docs
│
├── questions/                    # Information gaps tracking
│   └── QUESTIONS_LOG.md
│
├── coordination/                 # Swarm patterns
│   └── SWARM_PATTERNS.md
│
├── prompts/                      # System prompts
│   └── feature-planning-and-prd-creation.md
│
├── vision/                       # Platform vision documents
│   └── FOUNDERSBASE_*.md
│
├── architecture/                 # Architecture decisions
│   ├── decisions/
│   ├── diagrams/
│   ├── infrastructure/
│   ├── security/
│   └── services/
│
└── archive/                      # Deprecated/archived docs
    ├── QUICK-START.md           # → Merged into DEVELOPMENT-GUIDE.md
    ├── SIMPLE-DEV-GUIDE.md      # → Merged into DEVELOPMENT-GUIDE.md
    ├── FAST-DEV-GUIDE.md        # → Merged into DEVELOPMENT-GUIDE.md
    ├── DEVELOPMENT.md           # → Merged into DEVELOPMENT-GUIDE.md
    ├── backend-integration-guide.md # → Merged into BACKEND-GUIDE.md
    ├── BACKEND-UPDATE-GUIDE.md  # → Merged into BACKEND-GUIDE.md
    ├── MCP-SETUP.md             # → Merged into MCP-GUIDE.md
    ├── MCP-QUICK-REFERENCE.md   # → Merged into MCP-GUIDE.md
    ├── DOCUMENTATION-INDEX.md   # → Replaced by this file
    └── README.md                # → Replaced by this file
```

## 🚀 Quick Navigation

### For New Development
- Start with [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
- Review [AI-CONTEXT.md](./AI-CONTEXT.md) for project understanding
- Check [PROJECT-STATUS.md](./PROJECT-STATUS.md) for current state

### For Backend Work
- Read [BACKEND-GUIDE.md](./BACKEND-GUIDE.md)
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check API endpoints and integration patterns

### For UI Development
- Study [COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md)
- Setup [MCP-GUIDE.md](./MCP-GUIDE.md) for AI assistance
- Use components from `/frontend/src/components/ui/`

### For Deployment
- Start with [OPERATIONS-RUNBOOK.md](./OPERATIONS-RUNBOOK.md)
- Use [SCRIPTS-GUIDE.md](./SCRIPTS-GUIDE.md) for automation
- Reference [ARCHITECTURE.md](./ARCHITECTURE.md) for system context

## 📋 Document Status

| Document | Status | Purpose | Last Updated |
|----------|--------|---------|--------------|
| AI-INDEX.md | ✅ Active | Navigation hub (this file) | Today |
| AI-CONTEXT.md | ✅ Active | Complete project context | Current |
| PROJECT-STATUS.md | ✅ Active | Implementation tracking | Current |
| CLAUDE.md | ✅ Active | Build commands | Current |
| ARCHITECTURE.md | ✅ Active | System design | Current |
| DEVELOPMENT-GUIDE.md | ✅ NEW | Consolidated dev guide | Today |
| BACKEND-GUIDE.md | ✅ NEW | Consolidated backend guide | Today |
| MCP-GUIDE.md | ✅ NEW | Consolidated MCP guide | Today |
| COMPONENT-GUIDE.md | ✅ Active | UI patterns | Current |
| SCRIPTS-GUIDE.md | ✅ Active | Script reference | Current |
| OPERATIONS-RUNBOOK.md | ✅ NEW | Dev/Prod run, build, deploy, test | Today |

## 🗂️ Archived Documents

The following documents have been consolidated and archived to reduce redundancy:

- **Development Guides** → Merged into [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
  - QUICK-START.md
  - SIMPLE-DEV-GUIDE.md
  - FAST-DEV-GUIDE.md
  - DEVELOPMENT.md

- **Backend Guides** → Merged into [BACKEND-GUIDE.md](./BACKEND-GUIDE.md)
  - backend-integration-guide.md
  - BACKEND-UPDATE-GUIDE.md

- **MCP Guides** → Merged into [MCP-GUIDE.md](./MCP-GUIDE.md)
  - MCP-SETUP.md
  - MCP-QUICK-REFERENCE.md

- **Index Files** → Replaced by this file
  - DOCUMENTATION-INDEX.md
  - README.md (in /ai folder)

## 🎯 Key Principles

1. **Single Source of Truth** - This index is the primary navigation
2. **No Duplication** - Each topic has one authoritative document
3. **Clear Organization** - Logical grouping by function
4. **Active Maintenance** - Regular updates to keep current
5. **Archive Strategy** - Old docs preserved but clearly marked

## 🔍 Finding Information

### By Topic
- **Setup & Development** → DEVELOPMENT-GUIDE.md
- **Backend API** → BACKEND-GUIDE.md
- **UI Components** → COMPONENT-GUIDE.md
- **Build & Deploy** → CLAUDE.md
- **Architecture** → ARCHITECTURE.md
- **AI Assistance** → MCP-GUIDE.md

### By Task
- **Start coding** → DEVELOPMENT-GUIDE.md
- **Add API endpoint** → BACKEND-GUIDE.md
- **Create UI component** → COMPONENT-GUIDE.md
- **Deploy to production** → CLAUDE.md + SCRIPTS-GUIDE.md
- **Understand system** → AI-CONTEXT.md + ARCHITECTURE.md

## 📝 Notes

- All AI documentation should be placed in the `/ai/` folder
- Use this index to navigate to specific documentation
- Archived files are kept for historical reference only
- When in doubt, check the consolidated guides first
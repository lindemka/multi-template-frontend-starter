# AI Directory Index - Central Documentation Hub

## 📁 Directory Structure

```
ai/
├── planning/           # Strategic planning documents
├── questions/          # Information gaps and assumptions
├── prompts/           # System prompts and agent instructions
├── coordination/      # Swarm configurations and orchestration
├── memory/            # Persistent memory and context
└── [existing docs]    # Architecture, guides, and references
```

## 📋 Planning Documents (`/ai/planning/`)

### Core Planning Files
- **PLATFORM_VISION.md** - High-level platform vision and goals
- **ARCHITECTURE_DECISIONS.md** - Key technical decisions (ADRs)
- **BOILERPLATE_CORE.md** - Essential 5 layers for MVP
- **IMPLEMENTATION_PRIORITIES.md** - Week-by-week implementation plan
- **MIGRATION_STRATEGY.md** - Plan for migrating 2,000 existing users

### Requirements & Specifications
- **BOILERPLATE_REQUIREMENTS.md** - Detailed component requirements
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide
- **I18N_TECHNICAL_SPEC.md** - Internationalization specifications

### Feature Planning (Folders)
- Each feature has its own folder with detailed PRDs
- 16 feature folders documenting future capabilities

## ❓ Questions & Assumptions (`/ai/questions/`)

- **QUESTIONS_LOG.md** - Tracks all information gaps
  - Critical questions that block development
  - Assumptions made to continue work
  - Priority levels: CRITICAL, HIGH, MEDIUM, LOW

## 🤖 Prompts & Instructions (`/ai/prompts/`)

System prompts and agent-specific instructions for:
- Development agents
- Code review agents
- Architecture agents
- Testing agents

## 🎯 Coordination (`/ai/coordination/`)

Swarm configurations and orchestration:
- Swarm topology configurations
- Agent coordination patterns
- Task orchestration templates
- Performance benchmarks

## 💾 Memory (`/ai/memory/`)

Persistent context and knowledge:
- Session memory
- Pattern recognition data
- Historical decisions
- Performance metrics

## 📚 Existing Documentation

### Architecture & Design
- **ARCHITECTURE.md** - System architecture overview
- **AI-CONTEXT.md** - AI agent context and capabilities
- **COMPONENT-GUIDE.md** - Frontend component patterns

### Development Guides
- **DEVELOPMENT.md** - Development workflow
- **FAST-DEV-GUIDE.md** - Quick development tips
- **SIMPLE-DEV-GUIDE.md** - Simplified development guide
- **backend-integration-guide.md** - Backend integration patterns
- **BACKEND-UPDATE-GUIDE.md** - Backend update procedures

### Setup & Configuration
- **CLAUDE.md** - Claude configuration (SPARC environment)
- **MCP-SETUP.md** - MCP server setup
- **MCP-QUICK-REFERENCE.md** - MCP commands reference
- **QUICK-START.md** - Quick start guide
- **SCRIPTS-GUIDE.md** - Build scripts documentation

### Project Management
- **PROJECT-STATUS.md** - Current project status
- **PROJECT-CLEANUP-SUMMARY.md** - Cleanup history
- **DOCUMENTATION-INDEX.md** - Documentation overview
- **README.md** - Main readme

## 🚀 Quick Navigation

### For Planning & Strategy
→ Start with `/ai/planning/PLATFORM_VISION.md`
→ Review `/ai/planning/ARCHITECTURE_DECISIONS.md`
→ Check `/ai/planning/IMPLEMENTATION_PRIORITIES.md`

### For Development
→ Read `/ai/planning/BOILERPLATE_CORE.md`
→ Follow `/ai/planning/IMPLEMENTATION_GUIDE.md`
→ Check `/ai/questions/QUESTIONS_LOG.md` for blockers

### For Coordination
→ Use `/ai/coordination/` for swarm configs
→ Reference `/ai/memory/` for context
→ Check `/ai/prompts/` for agent instructions

## 📝 Important Notes

1. **All planning documents** are now in `/ai/planning/`
2. **All questions** should be logged in `/ai/questions/QUESTIONS_LOG.md`
3. **Swarm configurations** go in `/ai/coordination/`
4. **System prompts** belong in `/ai/prompts/`
5. **Persistent memory** is stored in `/ai/memory/`

## 🔄 Migration Completed

The following folders have been moved to `/ai/`:
- ✅ `/planning/` → `/ai/planning/`
- ✅ `/questions/` → `/ai/questions/`
- ✅ Created `/ai/prompts/`
- ✅ Created `/ai/coordination/`
- ✅ Created `/ai/memory/`

All references in CLAUDE.md have been updated to reflect new paths.
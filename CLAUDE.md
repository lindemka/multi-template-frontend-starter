# Claude Code Configuration - SPARC Development Environment

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

This project uses SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology with Claude-Flow orchestration for systematic Test-Driven Development.

## SPARC Commands

### Core Commands
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

### Migration & Planning
`migration-planner`, `swarm-init`

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL:
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY:
- Coordination and planning
- Memory management
- Neural features
- Performance tracking
- Swarm orchestration
- GitHub integration

**KEY**: MCP coordinates, Claude Code executes.

## 🚀 Quick Setup

```bash
# Add Claude Flow MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

## 📋 Agent Coordination Protocol

### Every Agent MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT (Single Message):
```javascript
[BatchTool]:
  // Initialize swarm
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }
  
  // Spawn agents with Task tool
  Task("Research agent: Analyze requirements...")
  Task("Coder agent: Implement features...")
  Task("Tester agent: Create test suite...")
  
  // Batch todos
  TodoWrite { todos: [
    {id: "1", content: "Research", status: "in_progress", priority: "high"},
    {id: "2", content: "Design", status: "pending", priority: "high"},
    {id: "3", content: "Implement", status: "pending", priority: "high"},
    {id: "4", content: "Test", status: "pending", priority: "medium"},
    {id: "5", content: "Document", status: "pending", priority: "low"}
  ]}
  
  // File operations
  Bash "mkdir -p app/{src,tests,docs}"
  Write "app/src/index.js"
  Write "app/tests/index.test.js"
  Write "app/docs/README.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## Integration Tips

1. Start with basic swarm init
2. Scale agents gradually
3. Use memory for context
4. Monitor progress regularly
5. Train patterns from success
6. Enable hooks automation
7. Use GitHub tools first

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

---

Remember: **Claude Flow coordinates, Claude Code creates!**

## ✅ CORRECT DEVELOPMENT SETUP

### Port Usage (Based on Standard Full-Stack Architecture)

**Development Environment:**
- **Port 3000**: Next.js Frontend (User Interface) - THIS IS WHERE USERS GO
- **Port 8080**: Spring Boot Backend (API Only) - FOR API TESTING ONLY

**What to Open in Browser:**
👉 **ALWAYS open http://localhost:3000** - This is your application
❌ **NEVER expect port 8080 to show UI** - It's API-only

### How It Works:
1. **Frontend (3000)** serves the user interface
2. **Next.js proxy** forwards `/api/*` requests to backend (8080)
3. **Backend (8080)** provides JSON API responses
4. **Same PostgreSQL database** used by both

### API Flow:
```
Browser → localhost:3000/dashboard/startups
  ↓
Next.js renders page
  ↓  
Page calls /api/startups
  ↓
Next.js proxy forwards to localhost:8080/api/startups
  ↓
Spring Boot returns JSON data
```

### Test Commands:
- **Frontend**: `curl http://localhost:3000/` → Returns HTML page
- **API Direct**: `curl http://localhost:8080/api/startups` → Returns JSON
- **API via Proxy**: `curl http://localhost:3000/api/startups` → Returns JSON

### Production Notes:
- Both services run behind reverse proxy (nginx/cloud)
- Domain serves frontend, `/api/*` routes to backend
- No raw port exposure (no :3000 or :8080 in URLs)

## 🚨 CRITICAL TESTING LESSONS LEARNED

### Backend Testing Must Include User-Visible Verification

**MISTAKE**: Assuming backend works because API endpoints respond
**REALITY**: User opens http://localhost:8080 and sees 403 Forbidden/blank page
**CONSEQUENCE**: User thinks backend is broken even when APIs work

### CORRECT Backend Testing Protocol:

1. **In Development - Backend is API-only:**
   - Port 8080 should NOT serve HTML pages
   - Port 8080 is for API testing only
   - Users should NEVER visit port 8080 directly

2. **ALWAYS verify backend with:**
   ```bash
   # Test API endpoints (what backend actually does)
   curl http://localhost:8080/api/startups
   curl http://localhost:8080/health
   
   # Test user experience (via frontend)
   open http://localhost:3000
   curl http://localhost:3000/api/startups  # Tests proxy
   ```

3. **IMPLEMENT user-friendly endpoints:**
   - Add `/health` or `/` endpoint that returns HTML status page
   - Show "Backend is running" message
   - List available API endpoints
   - Display application version/status

4. **CONSEQUENCES for future behavior:**
   - Always test from USER perspective, not just technical
   - Implement visible health checks before claiming "it works"
   - Add user-friendly root page to all Spring Boot apps
   - Test by opening in browser, not just curl commands
   - Document that 403 on root means "API-only backend"
   - **USE EXISTING SCRIPTS FIRST** - don't reinvent deployment
   - Check for deploy-production.sh, deploy-simple.sh before manual steps
   - Production should serve frontend from backend (8080), not separate ports
   - Frontend static files should be built and copied to backend/resources/static

### Deployment Scripts Priority:

**ALWAYS use existing deployment scripts FIRST:**

#### Primary Scripts (Root Directory):
1. `./deploy-simple.sh` - **MOST USED** - Quick dev deployment (backend + optional frontend)
2. `./deploy-production.sh` - Full production build (static frontend + backend on 8080)
3. `./deploy-unified.sh` - Alternative production deployment
4. `./test-api.sh` - Test API endpoints

#### Additional Scripts (/scripts directory):
- `./scripts/status.sh` - Check system status
- `./scripts/dev.sh` - Start development
- `./scripts/dev-clean.sh` - Clean development start
- `./scripts/build.sh` - Build both frontend and backend
- `./scripts/deploy-optimized.sh` - Optimized production deployment

**NEVER manually run `mvn`, `npm`, or `java` commands directly**

**Production Pattern:**
- Frontend builds to `out/` directory 
- Copy `out/*` to `backend/src/main/resources/static/`
- Spring Boot serves frontend + API on single port (8080)
- No separate frontend server needed in production

### Example Health Controller to Add:
```java
@RestController
public class HealthController {
    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("""
            <h1>Backend API is Running</h1>
            <p>Available endpoints:</p>
            <ul>
                <li>/api/members</li>
                <li>/api/auth/login</li>
                <li>/api/auth/register</li>
            </ul>
            """);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString()
        ));
    }
}
```

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.

## Questions Management

- Questions are tracked in `/ai/questions/` folder
- Continue working based on assumptions in most cases
- Ask critical questions immediately if they are crucial to progress
- Log ALL questions in `/ai/questions/QUESTIONS_LOG.md` with context and assumptions
- Priority levels: CRITICAL (blocks work), HIGH (next sprint), MEDIUM (2-4 weeks), LOW (nice to know)

## Swarm Usage Instructions - ALWAYS USE FOR COMPLEX TASKS

### MANDATORY: Use Claude Flow swarm for:
1. **Complex multi-step tasks** - Tasks requiring coordination across multiple files
2. **Architecture planning** - System design and technical decisions  
3. **Large refactoring** - Changes affecting multiple components
4. **Performance optimization** - Analyzing and improving system performance
5. **Migration tasks** - Database migrations, framework updates
6. **Security audits** - Comprehensive security reviews
7. **Test creation** - Building comprehensive test suites
8. **Feature implementation** - Any feature touching 3+ files

### Swarm Initialization Pattern:
```bash
# ALWAYS start complex sessions with:
mcp__claude-flow__swarm_init topology="hierarchical" maxAgents=8

# For development tasks
mcp__claude-flow__sparc_mode mode="dev" task_description="[detailed task]"

# For complex orchestration  
mcp__claude-flow__task_orchestrate task="[task]" strategy="adaptive" priority="high"

# Check status before continuing
mcp__claude-flow__task_status taskId="[id]" detailed=true
```

### Default Assumptions When Information Missing:
- **Database**: PostgreSQL 14+ (not MySQL/MongoDB)
- **Cache**: Redis (not Memcached)
- **Storage**: S3-compatible (AWS S3 or MinIO)
- **Auth**: JWT with refresh tokens
- **Deploy**: Docker + Kubernetes
- **Email**: SMTP-compatible service
- **Search**: PostgreSQL FTS initially, Elasticsearch later
- **Monitoring**: Prometheus + Grafana

### Critical Questions (ASK IMMEDIATELY):
- Security decisions affecting user data
- Migration approach for existing 2,000 users
- Fundamental architecture changes
- Production environment specifics
- Compliance requirements (GDPR, etc)

## Development Best Practices

- **Always use the scripts to start the application**
- The main scripts for building and deploying the application are in ./scripts

## Project Development Best Practices

- **Backend Development Reminder**: after build backend always test if its actually running
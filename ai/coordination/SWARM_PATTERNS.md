# Swarm Coordination Patterns

## Standard Swarm Configurations

### 1. Development Swarm (Most Common)
```javascript
// For feature development
mcp__claude-flow__swarm_init { 
  topology: "hierarchical", 
  maxAgents: 8,
  strategy: "balanced"
}

// Spawn specialized agents
mcp__claude-flow__agent_spawn { type: "architect", name: "System Designer" }
mcp__claude-flow__agent_spawn { type: "coder", name: "Implementation" }
mcp__claude-flow__agent_spawn { type: "tester", name: "Test Creator" }
mcp__claude-flow__agent_spawn { type: "reviewer", name: "Code Review" }
```

### 2. Migration Swarm
```javascript
// For database/system migrations
mcp__claude-flow__swarm_init { 
  topology: "mesh", 
  maxAgents: 6,
  strategy: "specialized"
}

// Migration-specific agents
mcp__claude-flow__agent_spawn { type: "coordinator", name: "Migration Lead" }
mcp__claude-flow__agent_spawn { type: "analyst", name: "Data Analyzer" }
mcp__claude-flow__agent_spawn { type: "optimizer", name: "Performance Check" }
```

### 3. Security Audit Swarm
```javascript
// For security reviews
mcp__claude-flow__swarm_init { 
  topology: "star", 
  maxAgents: 5,
  strategy: "adaptive"
}

// Security-focused agents
mcp__claude-flow__agent_spawn { type: "security-auditor", name: "Vulnerability Scanner" }
mcp__claude-flow__agent_spawn { type: "code-analyzer", name: "Static Analysis" }
mcp__claude-flow__agent_spawn { type: "documenter", name: "Security Report" }
```

### 4. Performance Optimization Swarm
```javascript
// For performance improvements
mcp__claude-flow__swarm_init { 
  topology: "hierarchical", 
  maxAgents: 6,
  strategy: "adaptive"
}

// Performance agents
mcp__claude-flow__agent_spawn { type: "perf-analyzer", name: "Bottleneck Finder" }
mcp__claude-flow__agent_spawn { type: "performance-benchmarker", name: "Metrics" }
mcp__claude-flow__agent_spawn { type: "optimizer", name: "Code Optimizer" }
```

## Task Orchestration Patterns

### Complex Feature Implementation
```javascript
mcp__claude-flow__task_orchestrate {
  task: "Implement complete authentication system with JWT, OAuth, and email verification",
  strategy: "adaptive",
  priority: "high",
  maxAgents: 8
}
```

### Parallel Independent Tasks
```javascript
mcp__claude-flow__task_orchestrate {
  task: "Create API endpoints for profiles, organizations, and permissions",
  strategy: "parallel",
  priority: "medium",
  maxAgents: 6
}
```

### Sequential Dependent Tasks
```javascript
mcp__claude-flow__task_orchestrate {
  task: "Migrate database from H2 to PostgreSQL with zero downtime",
  strategy: "sequential",
  priority: "critical",
  maxAgents: 4
}
```

## SPARC Mode Patterns

### Development Mode
```javascript
mcp__claude-flow__sparc_mode {
  mode: "dev",
  task_description: "Build complete boilerplate with auth, profiles, and permissions",
  options: {
    framework: "spring-boot",
    approach: "tdd",
    focus: "security"
  }
}
```

### API Development
```javascript
mcp__claude-flow__sparc_mode {
  mode: "api",
  task_description: "Create RESTful API with OpenAPI documentation",
  options: {
    style: "rest",
    docs: "swagger",
    versioning: "url"
  }
}
```

### UI Development
```javascript
mcp__claude-flow__sparc_mode {
  mode: "ui",
  task_description: "Build responsive dashboard with Shadcn components",
  options: {
    framework: "nextjs",
    components: "shadcn",
    styling: "tailwind"
  }
}
```

### Testing Mode
```javascript
mcp__claude-flow__sparc_mode {
  mode: "test",
  task_description: "Create comprehensive test suite with 80% coverage",
  options: {
    type: "integration",
    framework: "jest",
    coverage: 80
  }
}
```

### Refactoring Mode
```javascript
mcp__claude-flow__sparc_mode {
  mode: "refactor",
  task_description: "Refactor monolith into modular architecture",
  options: {
    pattern: "modular",
    preserve: "api",
    testing: "continuous"
  }
}
```

## Memory Patterns

### Store Context
```javascript
mcp__claude-flow__memory_usage {
  action: "store",
  key: "boilerplate/architecture/decisions",
  value: JSON.stringify({
    database: "PostgreSQL",
    cache: "Redis",
    auth: "JWT with refresh",
    storage: "S3"
  }),
  namespace: "project",
  ttl: 2592000 // 30 days
}
```

### Retrieve Context
```javascript
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "boilerplate/architecture/decisions",
  namespace: "project"
}
```

### Search Patterns
```javascript
mcp__claude-flow__memory_search {
  pattern: "boilerplate/*",
  namespace: "project",
  limit: 20
}
```

## Monitoring Patterns

### Check Swarm Health
```javascript
// Status check
mcp__claude-flow__swarm_status { verbose: true }

// List active agents
mcp__claude-flow__agent_list { filter: "active" }

// Check specific task
mcp__claude-flow__task_status { 
  taskId: "task_id_here",
  detailed: true
}

// Get task results
mcp__claude-flow__task_results {
  taskId: "task_id_here",
  format: "detailed"
}
```

### Performance Monitoring
```javascript
// Run benchmarks
mcp__claude-flow__benchmark_run {
  type: "all",
  iterations: 10
}

// Check metrics
mcp__claude-flow__agent_metrics {
  metric: "all"
}

// Real-time monitoring
mcp__claude-flow__swarm_monitor {
  duration: 30,
  interval: 5
}
```

## Best Practices

### 1. Always Initialize Before Complex Tasks
```javascript
// Good
mcp__claude-flow__swarm_init → spawn agents → orchestrate task

// Bad
Direct task orchestration without swarm
```

### 2. Use Appropriate Topology
- **Hierarchical**: For structured tasks with clear dependencies
- **Mesh**: For collaborative tasks requiring peer communication
- **Star**: For centralized coordination
- **Ring**: For sequential processing

### 3. Monitor Progress
```javascript
// Always check task status
mcp__claude-flow__task_status { taskId: "...", detailed: true }

// Don't assume completion
// Wait for results before proceeding
```

### 4. Clean Up After Completion
```javascript
// Destroy swarm when done
mcp__claude-flow__swarm_destroy { swarmId: "..." }
```

### 5. Use Memory for Context
```javascript
// Store important decisions
mcp__claude-flow__memory_usage { 
  action: "store",
  key: "decision/...",
  value: "..."
}

// Retrieve before starting related work
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "decision/..."
}
```

## Common Task Patterns

### Boilerplate Implementation
1. Initialize hierarchical swarm (8 agents)
2. Spawn architect, coder, tester, reviewer agents
3. Orchestrate with adaptive strategy
4. Monitor progress every 5 seconds
5. Store results in memory

### Database Migration
1. Initialize mesh swarm (6 agents)
2. Spawn coordinator, analyst, optimizer agents
3. Use sequential strategy for safety
4. Create backups before starting
5. Validate after each step

### Feature Development
1. Initialize hierarchical swarm (6 agents)
2. Spawn specialized agents per feature
3. Use parallel strategy for independent parts
4. Sequential for dependent parts
5. Review and test continuously

### Performance Optimization
1. Initialize star swarm (5 agents)
2. Run benchmarks first
3. Identify bottlenecks
4. Optimize in parallel
5. Benchmark again to verify

## Error Recovery

### If Swarm Fails
```javascript
// Check status
mcp__claude-flow__swarm_status { verbose: true }

// Attempt recovery
mcp__claude-flow__daa_fault_tolerance {
  agentId: "failed_agent_id",
  strategy: "restart"
}

// Or destroy and restart
mcp__claude-flow__swarm_destroy { swarmId: "..." }
// Then initialize new swarm
```

### If Task Hangs
```javascript
// Check task status
mcp__claude-flow__task_status { taskId: "..." }

// Get partial results
mcp__claude-flow__task_results { 
  taskId: "...",
  format: "raw"
}

// Restart with different strategy
```

## Integration with Claude Code

Remember: 
- MCP tools coordinate and plan
- Claude Code tools execute and implement
- Use both together for best results

Example workflow:
1. MCP: Initialize swarm
2. MCP: Orchestrate planning task
3. Claude: Read files with Read/Grep
4. Claude: Write code with Write/Edit
5. Claude: Test with Bash
6. MCP: Store results in memory
7. MCP: Generate performance report
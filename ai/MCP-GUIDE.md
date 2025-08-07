# MCP (Model Context Protocol) Guide

## 🔌 MCP Overview

MCP (Model Context Protocol) enhances AI assistants with additional capabilities through server integrations. This project uses MCP for Shadcn/ui component assistance.

## 🚀 Quick Setup

### Install Shadcn MCP Server
```bash
# Install globally
npm install -g @shadcn/mcp-server

# Or add to project
npm install --save-dev @shadcn/mcp-server
```

### Configure MCP
```bash
# Add to Claude configuration
claude mcp add shadcn npx @shadcn/mcp-server start

# Verify installation
claude mcp list
```

## 📋 Available MCP Commands

### Component Information
```bash
# Get component details
mcp shadcn component <name>

# List all components
mcp shadcn list

# Search components
mcp shadcn search <query>
```

### Component Generation
```bash
# Add new component
mcp shadcn add <component>

# Update existing component
mcp shadcn update <component>

# Remove component
mcp shadcn remove <component>
```

## 🎨 Shadcn/ui Integration

### Benefits for AI Development
1. **Component Awareness** - AI knows available components
2. **Usage Examples** - Provides implementation patterns
3. **Props Documentation** - Understands component APIs
4. **Style Variants** - Knows available variations
5. **Accessibility** - Ensures ARIA compliance

### Supported Components
- **Layout**: Container, Grid, Stack, Box
- **Navigation**: Navbar, Sidebar, Breadcrumb, Tabs
- **Data Display**: Table, Card, Badge, Avatar
- **Forms**: Input, Select, Checkbox, Radio, Switch
- **Feedback**: Alert, Toast, Dialog, Sheet
- **Actions**: Button, Dropdown, Context Menu

## 🤖 AI Assistant Benefits

### Enhanced Capabilities
```typescript
// AI can understand component usage
<Button variant="outline" size="lg">
  Click me
</Button>

// AI knows available props
<Card className="p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// AI suggests best practices
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## 🔧 Configuration

### MCP Settings (mcp.json)
```json
{
  "servers": {
    "shadcn": {
      "command": "npx",
      "args": ["@shadcn/mcp-server", "start"],
      "env": {
        "PROJECT_PATH": "./frontend"
      }
    }
  }
}
```

### Environment Variables
```bash
# Set project path
export MCP_PROJECT_PATH=/path/to/frontend

# Enable debug logging
export MCP_DEBUG=true

# Set component library version
export SHADCN_VERSION=latest
```

## 📊 MCP Features

### 1. Component Discovery
- Lists all available components
- Shows component dependencies
- Identifies unused components
- Suggests related components

### 2. Code Generation
- Generates component boilerplate
- Creates TypeScript interfaces
- Adds proper imports
- Handles component composition

### 3. Documentation Access
- Inline prop documentation
- Usage examples
- Best practices
- Accessibility guidelines

### 4. Style Management
- Theme configuration
- CSS variable management
- Tailwind class suggestions
- Dark mode support

## 🎯 Usage Patterns

### For New Features
```bash
# AI workflow with MCP
1. mcp shadcn list           # See available components
2. mcp shadcn add dialog     # Add needed component
3. Generate feature code     # AI uses component correctly
4. mcp shadcn verify         # Verify implementation
```

### For Refactoring
```bash
# Modernize old code
1. Identify legacy UI code
2. mcp shadcn search <functionality>
3. Replace with Shadcn component
4. Update imports and styles
```

### For Consistency
```bash
# Ensure UI consistency
1. mcp shadcn audit          # Check component usage
2. Identify inconsistencies
3. Standardize implementations
4. Update documentation
```

## 🚨 Troubleshooting

### MCP Server Not Starting
```bash
# Check installation
npm list -g @shadcn/mcp-server

# Reinstall if needed
npm install -g @shadcn/mcp-server

# Check permissions
sudo npm install -g @shadcn/mcp-server
```

### Components Not Found
```bash
# Verify project path
echo $MCP_PROJECT_PATH

# Check components.json
cat frontend/components.json

# Rebuild component index
mcp shadcn rebuild
```

### AI Not Using MCP
- Ensure MCP is configured in AI settings
- Restart AI session after MCP changes
- Check MCP server logs for errors
- Verify network connectivity

## 🔄 Integration with Development

### Development Workflow
1. Start MCP server with dev environment
2. AI assistant has real-time component awareness
3. Changes to components reflected immediately
4. AI suggests components based on context

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Setup MCP
  run: |
    npm install -g @shadcn/mcp-server
    mcp shadcn verify

- name: Component Audit
  run: mcp shadcn audit --strict
```

## 📚 Advanced Features

### Custom Component Templates
```javascript
// mcp-templates/custom-component.tsx
export const template = {
  name: 'CustomComponent',
  props: ['variant', 'size'],
  imports: ['cn', 'useState'],
  body: '// Component implementation'
}
```

### Component Aliases
```json
{
  "aliases": {
    "btn": "button",
    "card": "card",
    "modal": "dialog"
  }
}
```

### AI Hints
```typescript
// @ai-hint: Use Sheet for mobile, Dialog for desktop
// @ai-prefer: Button variant="outline" for secondary actions
// @ai-context: This component handles user authentication
```

## 🎉 Benefits Summary

1. **Faster Development** - AI knows components instantly
2. **Better Quality** - Consistent component usage
3. **Reduced Errors** - Correct prop types and imports
4. **Modern Patterns** - Latest Shadcn/ui best practices
5. **Accessibility** - Built-in ARIA compliance

## 📖 Resources

- **Shadcn/ui Docs**: https://ui.shadcn.com/
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Component Examples**: `/frontend/src/components/ui/`
- **Project Setup**: `/ai/AI-CONTEXT.md`
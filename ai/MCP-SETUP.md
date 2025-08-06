# Shadcn MCP (Model Context Protocol) Integration

## 🎯 Overview

This project is configured to use the Shadcn MCP server, which provides AI assistants with comprehensive access to shadcn/ui components, blocks, demos, and metadata. This enables faster UI development by giving Claude Code and Cursor instant access to component information.

## 🚀 Features Available

- **Component Source Code**: Get the latest shadcn/ui v4 component TypeScript source
- **Component Demos**: Access example implementations and usage patterns  
- **Blocks Support**: Retrieve complete block implementations (dashboards, calendars, login forms, etc.)
- **Metadata Access**: Get component dependencies, descriptions, and configuration details
- **GitHub API Integration**: Efficient caching and intelligent rate limit handling

## 📦 Project Configuration

### Local MCP Configuration (Already Set Up)

The project includes a `.cursor/mcp.json` file that configures the Shadcn MCP server:

```json
{
  "mcpServers": {
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--framework", "react"]
    }
  }
}
```

This configuration:
- Uses the React framework (matches our Next.js setup)
- Automatically downloads the latest version via npx
- Provides access to shadcn/ui v4 components

## 🔧 IDE Integration

### Cursor IDE (Primary)

The project is already configured with `.cursor/mcp.json`. Cursor will automatically detect and use this configuration.

### Global Cursor Setup (Optional)

For system-wide access, add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--framework", "react"]
    }
  }
}
```

### Claude Desktop Integration

Add to your Claude Desktop config file:
- **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["@jpisnice/shadcn-ui-mcp-server", "--framework", "react"]
    }
  }
}
```

### Claude Code CLI Integration

```bash
claude mcp add-json "shadcn-ui-server" '{"command":"npx","args":["-y","@jpisnice/shadcn-ui-mcp-server","--framework","react"]}'
```

## 🔑 GitHub Token Setup (Recommended)

For better rate limits (5000 requests/hour instead of 60), set up a GitHub token:

### Option 1: Environment Variable
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

### Option 2: Update MCP Config
```json
{
  "mcpServers": {
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--framework", "react", "--github-api-key", "ghp_your_token_here"]
    }
  }
}
```

## 🛠️ Available MCP Tools

The Shadcn MCP server provides these tools for AI assistants:

- **`list_shadcn_components`**: Get a list of all available shadcn/ui components
- **`get_component_details`**: Get detailed information about a specific component

## 💡 Usage Examples

### For AI Assistants

Once configured, AI assistants can:

1. **List available components**:
   - "Show me all available shadcn components"
   - "What shadcn components are available for forms?"

2. **Get component details**:
   - "Show me the implementation of the shadcn Button component"
   - "Get the source code for the shadcn Table component"
   - "What are the props for the shadcn Dialog component?"

3. **Access blocks and demos**:
   - "Show me dashboard block examples"
   - "Get the calendar block implementation"
   - "Show me login form examples"

### For Developers

With MCP integration, you can ask AI assistants to:
- Generate components using the exact shadcn/ui patterns
- Suggest the right component for a specific use case
- Help with component customization and theming
- Provide complete implementation examples

## 🧪 Testing the Integration

### Verify MCP Server

Test if the MCP server is working:

```bash
npx @jpisnice/shadcn-ui-mcp-server --help
```

### Check Available Components

Ask your AI assistant:
"List all available shadcn components and show me the Button component details"

## 🔍 Troubleshooting

### Common Issues

1. **Server not starting**: Ensure Node.js v18+ is installed
2. **Rate limiting**: Set up GitHub token for higher limits
3. **Network issues**: Check internet connection to GitHub

### Debug Mode

For debugging, use the MCP Inspector at: http://127.0.0.1:6274

## 📚 Resources

- [Shadcn MCP GitHub](https://github.com/Jpisnice/shadcn-ui-mcp-server)
- [Model Context Protocol Docs](https://modelcontextprotocol.io)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

## 🚨 Important Notes

- The MCP server requires internet access to fetch component data from GitHub
- Component data is cached for performance
- The server supports both React (shadcn/ui) and Svelte (shadcn-svelte) frameworks
- This project uses React framework configuration

---

**Status**: Ready to use - MCP configuration is set up and ready for AI assistants
**Last Updated**: August 6, 2025
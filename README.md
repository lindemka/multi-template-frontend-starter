# Multi-Template Project

A production-ready template system with proper build architecture and scalable development workflow.

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

- **Home**: `http://localhost:3002/` - Index page (multipurpose template)
- **Dashboard**: `http://localhost:3002/dashboard.html` - Dashboard template (with sidebar)
- **Multipurpose**: `http://localhost:3002/multipurpose.html` - Multipurpose template (header navigation)

## Template Architecture

### Dashboard Template
- **Use for**: Admin panels, dashboards, management interfaces
- **Features**: Vertical sidebar navigation, fixed header, compact layout
- **Assets**: `./assets/dashboard/` - Isolated dashboard template assets

### Multipurpose Template  
- **Use for**: Landing pages, marketing sites, public-facing pages
- **Features**: Header navigation, full-width layout, responsive design
- **Assets**: `./assets/multipurpose/` - Isolated multipurpose template assets

## Project Structure

```
project1/
├── src/
│   └── pages/
│       ├── index.html              # Home page (multipurpose template)
│       ├── dashboard.html          # Dashboard template page
│       └── multipurpose.html       # Multipurpose template page
├── dist/                           # Built files
├── archive/                        # Archived original templates
│   ├── template-front-dashboard/   # Original dashboard template
│   └── template-front-multipurpose/ # Original multipurpose template
├── ai/                            # Documentation
└── .gitignore                     # Git ignore rules
```

## Features

- ✅ **Dual Template System**: Dashboard and Multipurpose templates
- ✅ **Asset Isolation**: Each template uses its own CSS/JS assets
- ✅ **Hot Reload Development**: `npm run dev` for live development
- ✅ **Production Build**: `npm run build` for optimized assets
- ✅ **Responsive Design**: Works on all devices
- ✅ **Professional Architecture**: Clean, maintainable code structure
- ✅ **Archive Management**: Original templates archived in `/archive/` folder
- ✅ **Git Configuration**: Comprehensive `.gitignore` excludes build artifacts and archive

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
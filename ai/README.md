# Multi-Template Frontend Starter

A production-ready frontend starter with two isolated template systems.

## Templates

### Dashboard Template
- **Purpose**: Admin panels, dashboards, management interfaces
- **Structure**: Sidebar + header + main content
- **Key Classes**: `has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset`
- **Assets**: `./assets/dashboard/`
- **Required JS**: `hs-navbar-vertical-aside.min.js` for sidebar functionality

### Multipurpose Template
- **Purpose**: Landing pages, marketing sites, public-facing pages
- **Structure**: Header + main content (no sidebar)
- **Key Classes**: `navbar navbar-expand-lg navbar-end navbar-absolute-top`
- **Assets**: `./assets/multipurpose/`

## Project Structure

```
project1/
├── src/
│   ├── pages/           # HTML pages
│   │   ├── index.html              # Home (multipurpose)
│   │   ├── dashboard-proper.html   # Dashboard template
│   │   └── multipurpose-proper.html # Multipurpose template
│   ├── scss/           # Custom styles
│   ├── js/             # Custom scripts
│   └── assets/         # Pre-built template assets
│       ├── dashboard/  # Dashboard CSS/JS/vendor
│       └── multipurpose/ # Multipurpose CSS/JS/vendor
├── dist/               # Built files (gitignored)
├── archive/            # Original templates (gitignored)
└── ai/                # Documentation
```

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run clean      # Clean dist directory
```

## Build System

- **Gulp** with file-include for HTML templating
- **SCSS** compilation with autoprefixer
- **JavaScript** bundling and minification
- **BrowserSync** for hot reload
- **Asset optimization** in production

## Testing

```bash
# Verify pages load
curl -s http://localhost:3000/ | grep -c "Multi-Template Project"
curl -s http://localhost:3000/dashboard-proper.html | grep -c "Dashboard Template"
curl -s http://localhost:3000/multipurpose-proper.html | grep -c "Multipurpose Template"

# Verify assets (200 OK expected)
curl -I http://localhost:3000/assets/dashboard/css/theme.min.css
curl -I http://localhost:3000/assets/multipurpose/css/theme.min.css
```

## Critical Rules

1. **Never mix template assets** - each template uses isolated CSS/JS
2. **Use correct file extensions** - `.min.css` and `.min.js` for production assets
3. **Maintain asset paths** - `./assets/dashboard/` vs `./assets/multipurpose/`
4. **Test both templates** after any modifications
5. **ALWAYS use existing designs from archived templates** - Reference `archive/template-front-dashboard/` and `archive/template-front-multipurpose/` for all UI components, layouts, and styling patterns. Never create new designs from scratch.
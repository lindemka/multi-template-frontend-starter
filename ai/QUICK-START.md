# Quick Start for AI

## Essential Commands

```bash
# Setup
npm install

# Development
npm run dev         # Start on localhost:3000

# Production
npm run build       # Build to dist/
npm run clean       # Clean dist/

# Quick Tests
curl -s http://localhost:3000/ | grep -c "Multi-Template Project"
curl -I http://localhost:3000/assets/dashboard/css/theme.min.css
```

## File Locations

### Pages
- `src/pages/index.html` - Home (multipurpose)
- `src/pages/dashboard.html` - Dashboard
- `src/pages/multipurpose.html` - Multipurpose


### Custom Code
- `src/scss/main.scss` - Custom styles
- `src/js/main.js` - Custom scripts

### Build Config
- `gulpfile.js` - Build configuration

## Common Tasks

### Add New Page
1. **Check COMPONENT-GUIDE.md** for the component you need
2. **Find reference design** in archived template folders using the guide's quick reference
3. Create HTML in `src/pages/` using the archived template structure
4. Copy component HTML from archived templates, adapting asset paths to current structure
5. Use dashboard body classes for admin pages, none for public pages

### Modify Styles
1. Edit `src/scss/main.scss`
2. Changes auto-compile in dev mode

### Update Navigation
- Dashboard: Edit sidebar in dashboard pages
- Multipurpose: Edit header in multipurpose pages

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on assets | Check `.min.css`/`.min.js` extension |
| Sidebar broken | Verify dashboard JS files loaded |
| Build fails | Run `npm run clean` first |
| Port in use | Check gulpfile.js for port config |
| **Stale files after rename** | **CRITICAL: Always run `npm run build` after renaming files** |
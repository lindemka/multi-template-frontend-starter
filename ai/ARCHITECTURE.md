# Technical Architecture

## HTML Structure

### Dashboard Template
```html
<body class="has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset">
  <script src="./assets/dashboard/vendor/hs-navbar-vertical-aside/dist/hs-navbar-vertical-aside-mini-cache.js"></script>
  
  <header class="navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-white">
    <!-- Fixed header with navigation -->
  </header>
  
  <aside class="js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered bg-white">
    <!-- Collapsible sidebar -->
  </aside>
  
  <main id="content" role="main" class="main">
    <!-- Page content with sidebar offset -->
  </main>
</body>
```

### Multipurpose Template
```html
<body>
  <header class="navbar navbar-expand-lg navbar-end navbar-absolute-top navbar-light navbar-show-hide">
    <!-- Responsive header navigation -->
  </header>
  
  <main id="content" role="main" class="main">
    <!-- Full-width content -->
  </main>
</body>
```

## Asset Loading Order

### Dashboard
1. Bootstrap Icons: `./assets/dashboard/vendor/bootstrap-icons/font/bootstrap-icons.css`
2. Theme CSS: `./assets/dashboard/css/theme.min.css`
3. jQuery: `./assets/dashboard/vendor/jquery/dist/jquery.min.js`
4. Bootstrap: `./assets/dashboard/vendor/bootstrap/dist/js/bootstrap.bundle.min.js`
5. Sidebar: `./assets/dashboard/vendor/hs-navbar-vertical-aside/dist/hs-navbar-vertical-aside.min.js`
6. Theme JS: `./assets/dashboard/js/theme.min.js`

### Multipurpose
1. Bootstrap Icons: `./assets/multipurpose/vendor/bootstrap-icons/font/bootstrap-icons.css`
2. Theme CSS: `./assets/multipurpose/css/theme.min.css`
3. jQuery: `./assets/multipurpose/vendor/jquery/dist/jquery.min.js`
4. Bootstrap: `./assets/multipurpose/vendor/bootstrap/dist/js/bootstrap.bundle.min.js`
5. Theme JS: `./assets/multipurpose/js/theme.min.js`

## Gulp Build Pipeline

### HTML Processing
- Uses `gulp-file-include` for potential includes
- Replaces variables: `@@autopath`, `@@vars.themeFont`, `@@vars.version`
- Each page is self-contained HTML

### Asset Processing
- SCSS → CSS with autoprefixer and minification
- JS concatenation and uglification
- Direct copy of vendor assets maintaining structure

### Development Features
- BrowserSync on port 3000
- File watching for instant reload
- Source maps for debugging

## Key Differences

| Feature | Dashboard | Multipurpose |
|---------|-----------|--------------|
| Layout | Sidebar + Header | Header only |
| Body Classes | Multiple layout classes | None |
| JavaScript | Sidebar management | Standard navigation |
| Use Case | Admin interfaces | Public pages |
| Responsive | Collapsible sidebar | Mobile menu |

## Design System Reference

**CRITICAL**: All frontend changes must reference the archived template folders:

- **Dashboard designs**: `archive/template-front-dashboard/src/` - Contains complete pages, components, and layouts
- **Multipurpose designs**: `archive/template-front-multipurpose/src/` - Contains complete pages, components, and layouts

### Finding Components
1. Browse archived template folders for existing UI patterns
2. Copy HTML structure and adapt for your use case  
3. Ensure asset paths point to current template assets
4. Never create new designs - always use existing template patterns
const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();

// Configuration
const config = {
  src: {
    pages: 'src/pages/**/*.html',
    partials: 'src/partials/**/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    assets: 'src/assets/**/*',
    templates: 'src/templates/**/*.html'
  },
  dist: {
    root: 'dist',
    css: 'dist/assets/css',
    js: 'dist/assets/js',
    assets: 'dist/assets'
  },
  watch: 'dist/**/*',
  port: 3000
};

// Clean dist folder
function clean() {
  return del([config.dist.root]);
}

// Process HTML templates with proper includes
function html() {
  return gulp.src(config.src.pages)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      context: {
        autopath: './assets',
        themeFont: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
        version: '?v=1.0',
        languageDirection: { lang: 'en' },
        template: 'multipurpose', // Default template
        vars: {
          themeFont: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
          version: '?v=1.0'
        }
      }
    }))
    .pipe(replace('@@autopath', './assets'))
    .pipe(replace('@@vars.themeFont', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap'))
    .pipe(replace('@@languageDirection.lang', 'en'))
    .pipe(replace('@@vars.version', '?v=1.0'))
    // Fix @@if conditions by removing them if variables aren't defined
    .pipe(replace(/@@if\(page === 'index'\)\{active\}/g, ''))
    .pipe(replace(/@@if\(page === 'dashboard'\)\{active\}/g, ''))
    .pipe(replace(/@@if\(page === 'multipurpose'\)\{active\}/g, ''))
    .pipe(gulp.dest(config.dist.root))
    .pipe(browserSync.stream());
}

// Process SCSS to CSS
function styles() {
  return gulp.src(config.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.dist.css))
    .pipe(browserSync.stream());
}

// Process JavaScript
function scripts() {
  return gulp.src(config.src.js)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.dist.js))
    .pipe(browserSync.stream());
}

// Copy assets
function assets() {
  return gulp.src(config.src.assets, { base: 'src' })
    .pipe(gulp.dest(config.dist.root))
    .pipe(browserSync.stream());
}

// Watch for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: config.dist.root
    },
    port: config.port,
    open: true,
    notify: false
  });

  gulp.watch(config.src.pages, html);
  gulp.watch(config.src.partials, html);
  gulp.watch(config.src.templates, html);
  gulp.watch(config.src.scss, styles);
  gulp.watch(config.src.js, scripts);
  gulp.watch(config.src.assets, assets);
}

// Development server
function serve() {
  browserSync.init({
    server: {
      baseDir: config.dist.root
    },
    port: config.port,
    open: true,
    notify: false
  });
}

// Build for production
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, assets));

// Development workflow
const dev = gulp.series(build, watch);

// Export tasks
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.assets = assets;
exports.watch = watch;
exports.serve = serve;
exports.build = build;
exports.dev = dev;
exports.default = dev; 
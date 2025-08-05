# Template Component Guide

**CRITICAL**: Always use existing components from archived templates. Never create new designs from scratch.

## Quick Reference

### 🚀 Most Commonly Used Components

| Component | Dashboard Template | Multipurpose Template |
|-----------|-------------------|----------------------|
| **User Tables** | `users.html`, `ecommerce-customers.html` | - |
| **Login Forms** | `authentication-login-basic.html` | `page-login.html`, `page-login-simple.html` |
| **Data Tables** | `ecommerce-products.html`, `ecommerce-orders.html` | - |
| **Hero Sections** | - | `landing-classic-*.html` (8 variations) |
| **Contact Forms** | - | `page-contacts-*.html` |
| **Error Pages** | `error-404.html`, `error-500.html` | `page-error-404.html` |

---

## Dashboard Template (`archive/template-front-dashboard/src/`)

### 📊 Tables & Data Management
- **`users.html`** - User management with avatars, filters, bulk actions
- **`ecommerce-customers.html`** - Customer database (used for our user table)
- **`ecommerce-products.html`** - Product catalog with search/filters
- **`ecommerce-orders.html`** - Order management with status tracking
- **`ecommerce-manage-reviews.html`** - Review moderation interface

### 📝 Forms & Authentication
- **`authentication-login-basic.html`** - Login with social auth, password toggle
- **`authentication-signup-basic.html`** - Registration form
- **`authentication-reset-password-basic.html`** - Password reset workflow
- **`authentication-2-step-verification-basic.html`** - 2FA interface
- **`ecommerce-add-product.html`** - Complex product creation form
- **`ecommerce-add-customers.html`** - Customer onboarding form

### 🔧 Applications
- **`apps-kanban.html`** - Project Kanban board with drag-drop
- **`apps-calendar.html`** - Event calendar interface
- **`apps-file-manager.html`** - File browser with upload/download
- **`apps-invoice-generator.html`** - Invoice creation tool

### 👤 User Management
- **`user-profile.html`** - Complete user profile dashboard
- **`user-profile-teams.html`** - Team management interface
- **`user-profile-my-profile.html`** - Personal profile editor
- **`account-invoice.html`** - Billing/invoice history

### 📁 Project Management
- **`projects.html`** - Project overview dashboard
- **`projects-timeline.html`** - Timeline/milestone tracker
- **`project-teams.html`** - Team assignment interface
- **`project-files.html`** - Document management
- **`project-settings.html`** - Project configuration
- **`project-activity.html`** - Activity feed/audit trail

### ⚠️ Status Pages
- **`error-404.html`** - Not found page
- **`error-500.html`** - Server error page
- **`welcome-page.html`** - Onboarding/welcome screen

---

## Multipurpose Template (`archive/template-front-multipurpose/src/`)

### 🎯 Landing Pages (Hero Sections)
- **`landing-classic-corporate.html`** - Business landing with animations
- **`landing-classic-software.html`** - SaaS product showcase
- **`landing-classic-portfolio.html`** - Creative portfolio
- **`landing-classic-analytics.html`** - Data/analytics platform
- **`landing-classic-studio.html`** - Design agency
- **`landing-classic-advertisement.html`** - Marketing agency

### 🛒 E-commerce Components
- **`demo-shop/index.html`** - Shop homepage with hero slider
- **`demo-shop/products-list.html`** - Product catalog (list view)
- **`demo-shop/products-grid.html`** - Product catalog (grid view)
- **`demo-shop/checkout.html`** - Shopping cart checkout
- **`demo-shop/order-completed.html`** - Order confirmation
- **`demo-shop/empty-cart.html`** - Empty state handling

### 📰 Content & Blog
- **`blog-newsroom.html`** - News/press section
- **`blog-metro.html`** - Magazine-style blog
- **`blog-journal.html`** - Personal blog layout
- **`blog-article.html`** - Article detail page
- **`blog-author-profile.html`** - Author bio/portfolio

### 🔐 Authentication Pages
- **`page-login.html`** - Split-screen login with testimonials
- **`page-login-simple.html`** - Minimal login form
- **`page-signup.html`** - Registration with benefits showcase
- **`page-signup-simple.html`** - Basic signup
- **`page-reset-password.html`** - Password recovery

### 📄 Informational Pages
- **`page-about.html`** - Company/team overview
- **`page-services.html`** - Service offerings
- **`page-faq.html`** - Frequently asked questions
- **`page-privacy.html`** - Privacy policy
- **`page-terms.html`** - Terms of service
- **`page-contacts-agency.html`** - Contact page for agencies
- **`page-contacts-startup.html`** - Contact page for startups

### 💼 Business Pages
- **`page-careers.html`** - Job listings
- **`page-careers-overview.html`** - Company culture page
- **`page-customer-stories.html`** - Case studies overview
- **`page-customer-story.html`** - Individual case study
- **`page-hire-us.html`** - Services/consultation page

### 👥 Account Management
- **`account-teams.html`** - Team collaboration
- **`account-preferences.html`** - User settings
- **`account-notifications.html`** - Notification preferences
- **`account-address.html`** - Address book

### 🎨 Portfolio & Showcase
- **`portfolio-grid.html`** - Work gallery
- **`portfolio-case-studies-product.html`** - Product case study
- **`portfolio-case-studies-branding.html`** - Branding project showcase
- **`portfolio-product-article.html`** - Detailed project writeup

---

## 🔍 How to Find Components

### 1. **By Use Case**
- Need a user table? → `ecommerce-customers.html`
- Need a login form? → `authentication-login-basic.html` (dashboard) or `page-login.html` (multipurpose)  
- Need a hero section? → `landing-classic-*.html` files
- Need a contact form? → `page-contacts-*.html` files

### 2. **By File Naming Pattern**
- `authentication-*` = Auth/login related
- `ecommerce-*` = Business/data management
- `landing-*` = Hero sections and landing pages
- `page-*` = Standalone informational pages
- `user-*` = User profile and account pages
- `project-*` = Project management features

### 3. **By Template Type**
- **Dashboard**: Admin panels, data tables, business apps
- **Multipurpose**: Marketing sites, portfolios, e-commerce

---

## 🛠️ Implementation Steps

### 1. **Find Your Component**
```bash
# Browse archived templates
ls archive/template-front-dashboard/src/
ls archive/template-front-multipurpose/src/
```

### 2. **Copy Structure**
- Open the relevant HTML file
- Copy the HTML structure you need
- Adapt asset paths to current project structure

### 3. **Update Asset Paths**
```html
<!-- Original archived path -->
src="@@autopath/assets/img/160x160/img3.jpg"

<!-- Updated for current project -->
src="./assets/dashboard/img/160x160/img3.jpg"
```

### 4. **Maintain Template Consistency**
- Dashboard components → Use dashboard assets (`./assets/dashboard/`)
- Multipurpose components → Use multipurpose assets (`./assets/multipurpose/`)

---

## 💡 Pro Tips

### **Component Mixing Rules**
- ✅ **Dashboard + Dashboard components** = Professional admin interfaces
- ✅ **Multipurpose + Multipurpose components** = Marketing/public sites
- ❌ **Never mix dashboard and multipurpose assets**

### **Common Patterns**
- **Tables**: Always include search, filters, pagination
- **Forms**: Include validation, loading states, success messages
- **Cards**: Use consistent spacing and shadow patterns
- **Buttons**: Follow established color schemes (primary, secondary, etc.)

### **Performance Tips**
- Copy only the HTML you need, not entire pages
- Keep existing CSS class names for proper styling
- Test responsive behavior on different screen sizes
- Verify all asset paths are correct after copying

---

## 🎯 Example Usage

### Adding a Contact Form (Multipurpose)
1. **Find component**: `page-contacts-agency.html`
2. **Copy form section**: Lines with `<form>` elements
3. **Update paths**: Change `@@autopath/` to `./assets/multipurpose/`
4. **Test**: Verify styling and responsiveness

### Adding a Data Table (Dashboard)  
1. **Find component**: `ecommerce-products.html` or `users.html`
2. **Copy table structure**: `<table>` with headers and sample rows
3. **Update paths**: Change `@@autopath/` to `./assets/dashboard/`
4. **Customize**: Replace sample data with your content

This guide ensures you can quickly find and implement any component while maintaining design consistency!
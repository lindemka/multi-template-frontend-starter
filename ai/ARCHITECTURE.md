# fbase Architecture

## Modern Next.js + shadcn/ui + Spring Boot Architecture

### System Overview

fbase is a modern full-stack application built with:
- **Frontend**: Next.js 15 with App Router + shadcn/ui components + Tailwind CSS v4
- **Backend**: Spring Boot 3.4 + Java 21
- **Integration**: Static export deployment with REST API communication

---

## Frontend Architecture (Next.js + shadcn/ui)

### Application Structure
```
frontend-nextjs/
├── src/
│   ├── app/                    # App Router structure
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── users/          # User management
│   │   │   └── layout.tsx      # Dashboard layout
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── table.tsx
│   │   │   ├── button.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ...
│   │   └── dashboard/          # Custom dashboard components
│   │       ├── sidebar.tsx
│   │       ├── mobile-nav.tsx
│   │       ├── user-table-shadcn.tsx
│   │       └── header.tsx
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   └── react-query.ts     # React Query setup
│   └── types/
│       └── user.ts            # TypeScript interfaces
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS v4 config
└── package.json
```

### Component Architecture

#### shadcn/ui Foundation
```tsx
// Base UI components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
```

#### Custom Dashboard Components
```tsx
// Dashboard-specific components built with shadcn/ui
import UserTableShadcn from '@/components/dashboard/user-table-shadcn';
import Sidebar from '@/components/dashboard/sidebar';
import MobileNav from '@/components/dashboard/mobile-nav';
```

#### Layout Structure
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64">
        <Sidebar />
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Backend Architecture (Spring Boot)

### Application Structure
```
backend/
├── src/main/java/com/fbase/
│   ├── FbaseApplication.java      # Main application class
│   ├── controller/                # REST API endpoints
│   │   └── UserController.java    # User management API
│   ├── service/                   # Business logic
│   │   └── UserService.java       # User service layer
│   ├── model/                     # Data models
│   │   └── User.java              # User entity
│   ├── repository/                # Data access
│   │   └── UserRepository.java    # User repository
│   └── config/                    # Configuration
│       └── WebConfig.java         # CORS & static resources
├── src/main/resources/
│   ├── static/
│   │   ├── nextjs/               # Next.js build output
│   │   └── assets/               # Legacy template assets
│   └── application.properties    # Spring Boot configuration
└── pom.xml                      # Maven dependencies
```

### API Design

#### REST Endpoints
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
```

#### Data Models
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, EDITOR, VIEWER, MODERATOR
    
    @Enumerated(EnumType.STRING)
    private Status status; // ACTIVE, INACTIVE, PENDING
    
    private String avatar;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors...
}
```

---

## Integration Architecture

### Build Integration

#### Next.js Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',           // Static export
  trailingSlash: true,        // Required for Spring Boot
  distDir: '../backend/src/main/resources/static/nextjs',
  basePath: '/nextjs',        // Prefix for production
  images: { unoptimized: true } // No Next.js image optimization
};
```

#### Spring Boot Static Resources
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve Next.js static files
        registry.addResourceHandler("/nextjs/**")
                .addResourceLocations("classpath:/static/nextjs/");
                
        // Serve legacy template assets
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowCredentials(true);
    }
}
```

### Development vs Production

#### Development Mode
- **Frontend**: Next.js dev server on `localhost:3000`
- **Backend**: Spring Boot on `localhost:8080`
- **API Calls**: Direct to backend with CORS enabled
- **Hot Reload**: Both frontend and backend auto-reload

#### Production Mode
- **Build**: Next.js exports static files to Spring Boot resources
- **Deployment**: Single Spring Boot JAR file
- **Access**: All traffic through Spring Boot
- **URLs**:
  - Dashboard: `http://localhost:8080/nextjs/dashboard/`
  - API: `http://localhost:8080/api/users`

---

## Data Flow Architecture

### API Communication Pattern
```tsx
// React Query integration for state management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch users
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
});

// Create user mutation
const queryClient = useQueryClient();
const createUserMutation = useMutation({
  mutationFn: (user) => 
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(res => res.json()),
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  }
});
```

### State Management Flow
1. **Component mounts** → React Query fetches data
2. **Loading state** → Skeleton components shown
3. **Data received** → Components render with data
4. **User action** → Optimistic updates + API call
5. **Success/Error** → Cache invalidation + UI updates

---

## Responsive Design Architecture

### Breakpoint System
- **Mobile**: `< 768px` (default)
- **Tablet**: `md: 768px+`
- **Desktop**: `lg: 1024px+`
- **Large**: `xl: 1280px+`

### Layout Responsiveness
```tsx
// Desktop: Fixed sidebar + main content
// Mobile: Sheet drawer + full-width content
<div className="flex min-h-screen">
  {/* Desktop Sidebar - Hidden on mobile */}
  <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0">
    <Sidebar />
  </div>
  
  {/* Mobile Navigation - Hidden on desktop */}
  <div className="lg:hidden">
    <Sheet>
      <SheetTrigger>Menu</SheetTrigger>
      <SheetContent side="left" className="w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  </div>
  
  {/* Main Content - Responsive margins */}
  <div className="flex-1 lg:ml-64">
    <main className="p-4 md:p-6">
      {children}
    </main>
  </div>
</div>
```

---

## Performance Architecture

### Frontend Optimizations
- **Code Splitting**: Next.js automatic route-based splitting
- **Static Generation**: Next.js static export for production
- **Component Lazy Loading**: Dynamic imports for heavy components
- **Bundle Optimization**: Tree-shaking and minification
- **React Query Caching**: Intelligent API response caching

### Backend Optimizations
- **JPA Optimizations**: Efficient database queries
- **Connection Pooling**: Database connection management
- **Static Resource Caching**: Browser cache headers
- **Compression**: Gzip compression for responses

---

## Security Architecture

### Frontend Security
- **TypeScript**: Compile-time type checking
- **Input Validation**: Client-side validation with server-side verification
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and CSRF tokens

### Backend Security
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Bean validation annotations
- **SQL Injection Prevention**: JPA parameterized queries
- **Error Handling**: Secure error responses

---

## Deployment Architecture

### Development Deployment
```bash
# Start development servers
./scripts/dev.sh

# Frontend: localhost:3000 (Next.js dev server)
# Backend: localhost:8080 (Spring Boot)
# Database: H2 in-memory
```

### Production Deployment
```bash
# Build and deploy
./scripts/build.sh

# Creates: backend/target/fbase-0.0.1-SNAPSHOT.jar
# Contains: Next.js static files + Spring Boot application
# Deploy: java -jar fbase-0.0.1-SNAPSHOT.jar
```

### Production URLs
- **Dashboard**: `http://localhost:8080/nextjs/dashboard/`
- **API**: `http://localhost:8080/api/*`
- **Static Assets**: `http://localhost:8080/nextjs/_next/*`

---

## Migration from Legacy Architecture

### Previous Architecture (Archived)
- **Frontend**: Static HTML + jQuery + Bootstrap + Gulp
- **Templates**: Separate dashboard and multipurpose templates
- **Build**: Gulp-based asset pipeline
- **Deployment**: Static file serving

### Current Architecture Benefits
- **Modern Stack**: Next.js 15 + React + TypeScript
- **Component System**: shadcn/ui with design system consistency
- **Type Safety**: End-to-end TypeScript
- **Performance**: React Query caching + Next.js optimizations
- **Maintainability**: Component-driven architecture
- **Developer Experience**: Hot reload + modern tooling
- **Accessibility**: Built-in ARIA support in shadcn/ui
- **Responsive**: Mobile-first design patterns

This modern architecture provides a scalable, maintainable, and performant foundation for building complex web applications with excellent developer and user experiences.
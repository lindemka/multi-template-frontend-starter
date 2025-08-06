# Backend Integration Guide

## Spring Boot + Next.js (shadcn/ui) Integration

Based on the fbase project structure, here's how the modern Next.js frontend integrates with Spring Boot:

### 1. Project Structure
```
project1/
├── frontend-nextjs/                   # Modern Next.js frontend
│   ├── src/app/dashboard/            # Dashboard pages with App Router
│   ├── src/components/ui/            # shadcn/ui components
│   ├── src/components/dashboard/     # Custom dashboard components
│   ├── src/lib/                      # Utilities and API clients
│   ├── next.config.ts               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS v4 config
│   └── package.json
├── backend/                          # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/fbase/
│   │       ├── FbaseApplication.java
│   │       ├── controller/           # REST API controllers
│   │       ├── service/              # Business logic
│   │       ├── model/                # Data models
│   │       └── config/               # Configuration
│   ├── src/main/resources/
│   │   ├── static/nextjs/           # Next.js build output
│   │   ├── static/assets/           # Legacy template assets
│   │   └── application.properties
│   └── pom.xml
└── scripts/                         # Build and development scripts
```

### 2. Key Integration Points

#### Next.js → Spring Boot Integration Pipeline
1. **Next.js builds** to `../backend/src/main/resources/static/nextjs/`
2. **Spring Boot serves** Next.js static export from classpath
3. **API calls** from Next.js to Spring Boot REST endpoints
4. **Development**: Next.js dev server (3000) + Spring Boot (8080)
5. **Production**: Single Spring Boot JAR serving everything

#### Integration Architecture

**Modern SPA + REST API Architecture**
- Next.js handles all UI with shadcn/ui components
- Spring Boot provides REST API endpoints
- React Query manages API state and caching
- TypeScript ensures type safety across frontend
- Clean separation with defined API contracts

### 3. Implementation Details

#### Next.js Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: '../backend/src/main/resources/static/nextjs',
  basePath: '/nextjs',
  images: { unoptimized: true }
};
```

#### Spring Boot Configuration
```java
// Static resource handling
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/nextjs/**")
                .addResourceLocations("classpath:/static/nextjs/");
    }
}
```

#### API Endpoints
REST controllers provide:
- User management (`/api/users`)
- Dashboard data
- CRUD operations with JSON responses
- CORS configuration for development

### 4. Example Implementation

#### Spring Boot Controller (REST API)
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
```

#### Next.js + React Query Integration
```typescript
// hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      return response.json();
    }
  });
}

// components/UserTable.tsx
export default function UserTable() {
  const { data: users, isLoading } = useUsers();
  // Render with shadcn/ui Table component
}
```

### 5. Development Workflow

#### Development Mode
1. **Start both servers**: `./scripts/dev.sh`
2. **Next.js dev server**: http://localhost:3000/dashboard/
3. **Spring Boot backend**: http://localhost:8080/api/users
4. **Hot reload**: Both frontend and backend auto-reload on changes

#### Production Build
1. **Build and deploy**: `./scripts/build.sh`
2. **Next.js exports**: Static files to Spring Boot resources
3. **Single JAR deployment**: `java -jar target/fbase-0.0.1-SNAPSHOT.jar`
4. **Access production**: http://localhost:8080/nextjs/dashboard/

### 6. Modern Architecture Benefits

The Next.js + shadcn/ui + Spring Boot architecture provides:

#### Development Benefits
- ✅ **Modern component library**: shadcn/ui with Tailwind CSS v4
- ✅ **Type safety**: TypeScript across the entire frontend
- ✅ **Hot reload**: Both Next.js and Spring Boot DevTools
- ✅ **API state management**: React Query for caching and synchronization
- ✅ **Responsive design**: Mobile-first shadcn/ui components

#### Production Benefits
- ✅ **Single deployment**: Next.js static export + Spring Boot JAR
- ✅ **Performance**: Static files served efficiently
- ✅ **SEO friendly**: Next.js static generation
- ✅ **Scalable**: Clean API contracts and component architecture
- ✅ **Maintainable**: Modern tooling and established patterns

#### CORS Configuration
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowCredentials(true);
    }
}
```

This modern stack provides a solid foundation for building scalable web applications with excellent developer experience.
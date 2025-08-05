# Backend Integration Guide

## Creating a Minimal Spring Boot + Multi-Template Frontend Boilerplate

Based on the foundersbase project structure, here's how to integrate your multi-template frontend with Spring Boot:

### 1. Project Structure
```
project1/
├── frontend/                          # Your existing frontend
│   ├── src/pages/                    # dashboard.html, multipurpose.html, index.html
│   ├── src/assets/                   # template assets
│   ├── gulpfile.js                   # build system
│   └── package.json
├── backend/                          # New Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/demo/
│   │       ├── DemoApplication.java
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       └── config/
│   ├── src/main/resources/
│   │   ├── templates/               # Thymeleaf templates
│   │   ├── static/                  # Static assets (from frontend build)
│   │   └── application.properties
│   └── pom.xml
└── integration-build.js             # Build script to copy frontend to backend
```

### 2. Key Integration Points

#### Frontend → Backend Asset Pipeline
1. **Frontend builds** to `dist/` (existing)
2. **Integration script** copies `dist/` to `backend/src/main/resources/static/`
3. **Spring Boot serves** static assets from classpath

#### Template Integration Options

**Option A: Pure REST API (Recommended for Multi-Template)**
- Frontend remains independent
- Backend provides REST endpoints
- JavaScript fetches data from API
- Clean separation of concerns

**Option B: Thymeleaf Integration**
- Convert HTML pages to Thymeleaf templates
- Server-side rendering with Spring Boot
- More complex but better SEO

### 3. Implementation Steps

#### Step 1: Create Spring Boot Backend
Create minimal Spring Boot project with:
- Web starter
- JPA starter (for database)
- Security starter (optional)
- Thymeleaf starter (if using Option B)

#### Step 2: Frontend-Backend Bridge
Create Node.js script to:
- Build frontend (`npm run build`)
- Copy assets to Spring Boot static folder
- Optionally convert HTML to Thymeleaf templates

#### Step 3: API Endpoints
Create REST controllers for:
- User management (matching your user table)
- Authentication
- Dashboard data
- General CRUD operations

### 4. Example Implementation

#### Spring Boot Controller (REST API)
```java
@RestController
@RequestMapping("/api")
public class UserController {
    
    @GetMapping("/users")
    public List<UserDTO> getUsers() {
        // Return user data for your dashboard table
    }
    
    @PostMapping("/users")
    public UserDTO createUser(@RequestBody UserDTO user) {
        // Create new user
    }
}
```

#### Frontend JavaScript Integration
```javascript
// In your dashboard.html
async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    populateUserTable(users);
}
```

### 5. Development Workflow

#### For REST API Approach:
1. **Frontend Development**: `npm run dev` (port 3000)
2. **Backend Development**: `mvn spring-boot:run` (port 8080)
3. **Proxy Setup**: Configure frontend to proxy API calls to backend
4. **Production**: Build frontend, copy to backend, deploy Spring Boot

#### For Thymeleaf Approach:
1. **Template Conversion**: Convert HTML to Thymeleaf templates
2. **Unified Development**: Run Spring Boot with embedded frontend
3. **Asset Pipeline**: Gulp builds assets, Spring Boot serves pages

### 6. Recommended Approach: REST API + Proxy

This maintains your clean multi-template architecture while adding backend functionality:

#### Frontend `gulpfile.js` modification:
```javascript
// Add proxy configuration to BrowserSync
browserSync.init({
    proxy: "http://localhost:8080", // Spring Boot server
    port: 3000,
    ui: {
        port: 3001
    }
});
```

#### Backend CORS configuration:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*");
    }
}
```

This approach allows:
- ✅ **Independent frontend development** with hot reload
- ✅ **Clean template separation** (dashboard vs multipurpose)
- ✅ **Modern API architecture** with REST endpoints
- ✅ **Easy deployment** (build frontend → copy to backend → deploy)
- ✅ **Scalable architecture** for future features

Would you like me to create the actual boilerplate implementation?
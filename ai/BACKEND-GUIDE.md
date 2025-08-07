# Backend Integration Guide - Spring Boot API

## 🗄️ Backend Overview

### Technology Stack
- **Framework**: Spring Boot 3.4.2
- **Language**: Java 21
- **Database**: H2 (in-memory for development)
- **Build Tool**: Maven
- **API**: RESTful JSON endpoints
- **Frontend Integration**: Serves Next.js static export

## 🚀 Quick Start

### Development Server
```bash
cd backend
mvn spring-boot:run

# API available at: http://localhost:8080/api/
# Frontend served at: http://localhost:8080/nextjs/
```

### Production Build
```bash
# Build JAR with frontend included
mvn clean package -DskipTests

# Run production JAR
java -jar target/fbase-0.0.1-SNAPSHOT.jar
```

## 📁 Backend Structure

```
backend/
├── src/main/
│   ├── java/com/fbase/
│   │   ├── controller/        # REST API controllers
│   │   │   └── UserController.java
│   │   ├── model/            # Data models/entities
│   │   │   └── User.java
│   │   ├── repository/       # Data access layer
│   │   │   └── UserRepository.java
│   │   ├── service/          # Business logic
│   │   │   └── UserService.java
│   │   ├── config/           # Configuration classes
│   │   │   └── WebConfig.java
│   │   └── FbaseApplication.java  # Main application
│   └── resources/
│       ├── static/           # Static resources
│       │   ├── nextjs/       # Next.js build output
│       │   └── index.html    # Root redirect
│       └── application.properties  # Configuration
└── pom.xml                   # Maven dependencies
```

## 🔌 API Endpoints

### User Management
```bash
# Get all users
GET /api/users

# Get user by ID
GET /api/users/{id}

# Create new user
POST /api/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}

# Update user
PUT /api/users/{id}
Content-Type: application/json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "ADMIN"
}

# Delete user
DELETE /api/users/{id}
```

### Health Check
```bash
GET /actuator/health
```

## 🔧 Configuration

### application.properties
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration (H2)
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
spring.jpa.show-sql=true

# CORS Configuration
cors.allowed-origins=http://localhost:3000

# Static Resources
spring.mvc.static-path-pattern=/**
spring.web.resources.static-locations=classpath:/static/
```

## 🏗️ Frontend Integration

### Build Process
1. **Frontend Build**: Next.js exports to `out/` directory
2. **Copy to Backend**: Files copied to `backend/src/main/resources/static/nextjs/`
3. **Maven Package**: Creates JAR with embedded frontend
4. **Deployment**: Single JAR serves both API and frontend

### URL Routing
- `/api/*` → Spring Boot REST controllers
- `/nextjs/*` → Next.js static files
- `/` → Redirects to `/nextjs/dashboard/`

### CORS Configuration
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Manual API Testing
```bash
# Test user endpoint
curl http://localhost:8080/api/users

# Create user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","role":"USER"}'

# Test health endpoint
curl http://localhost:8080/actuator/health
```

## 📊 Database Access

### H2 Console
```bash
# Access H2 console (dev only)
http://localhost:8080/h2-console

# Connection details:
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (leave empty)
```

### JPA Repository Pattern
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
}
```

## 🔄 Update Workflow

### Adding New Endpoints
1. Create/update controller in `controller/`
2. Add service logic in `service/`
3. Update repository if needed in `repository/`
4. Add DTOs/models in `model/`
5. Test with curl or Postman
6. Update frontend API client in `frontend/src/lib/api.ts`

### Database Schema Changes
1. Update entity classes in `model/`
2. Spring Boot auto-updates H2 schema
3. For production, create migration scripts
4. Update repository methods as needed

### Deployment Updates
1. Build frontend: `cd frontend && npm run build`
2. Build backend: `cd backend && mvn clean package`
3. Deploy JAR: `java -jar target/fbase-0.0.1-SNAPSHOT.jar`

## 🚨 Common Issues

### Port 8080 Already in Use
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Frontend Not Updating
- Ensure frontend build completed: `npm run build`
- Check files copied to `static/nextjs/`
- Clear browser cache
- Rebuild JAR: `mvn clean package`

### CORS Errors
- Check allowed origins in `WebConfig.java`
- Verify frontend URL in CORS configuration
- Add credentials support if needed

### Database Connection Issues
- H2 is in-memory, data resets on restart
- Check JDBC URL in application.properties
- Verify H2 console is enabled for debugging

## 🔐 Security Considerations

### Current Implementation
- Basic REST API without authentication
- CORS configured for local development
- H2 console enabled (disable in production)

### Production Recommendations
1. Add Spring Security for authentication
2. Implement JWT tokens for API access
3. Use PostgreSQL or MySQL instead of H2
4. Disable H2 console
5. Configure HTTPS
6. Add rate limiting
7. Implement proper logging

## 📚 Additional Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **H2 Database**: http://www.h2database.com/
- **Frontend Integration**: `/ai/AI-CONTEXT.md`
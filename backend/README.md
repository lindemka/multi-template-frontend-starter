# Multi-Template Frontend + Spring Boot Backend

A minimal boilerplate demonstrating integration between the multi-template frontend and Spring Boot backend.

## Quick Start

### 1. Build Frontend
```bash
cd ..
npm run build
```

### 2. Integrate Frontend with Backend
```bash
cd backend
./integrate-frontend.sh
```

### 3. Run Backend
```bash
mvn spring-boot:run
```

### 4. Access Application
- **Frontend Templates**: http://localhost:8080
- **API Endpoints**: http://localhost:8080/api/users
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

## Project Structure

```
backend/
├── src/main/java/com/example/demo/
│   ├── DemoApplication.java          # Main Spring Boot application
│   ├── config/
│   │   ├── DataInitializer.java      # Demo data setup
│   │   └── WebConfig.java            # CORS configuration
│   ├── controller/
│   │   └── UserController.java       # REST API endpoints
│   ├── model/
│   │   └── User.java                 # User entity with Role/Status enums
│   ├── repository/
│   │   └── UserRepository.java       # JPA repository
│   └── service/
│       └── UserService.java          # Business logic
├── src/main/resources/
│   ├── application.properties        # Spring Boot configuration
│   └── static/                       # Frontend build files (after integration)
├── integrate-frontend.sh             # Integration script
└── pom.xml                          # Maven dependencies
```

## Demo Data

The application initializes with 5 demo users matching the frontend user table:
- John Doe (Admin, Active)
- Jane Smith (Editor, Active) 
- Mike Johnson (Viewer, Active)
- Sarah Wilson (Moderator, Pending)
- Alex Chen (Editor, Inactive)

## Integration Notes

- Frontend assets are served from `/static/` in Spring Boot
- CORS is configured for `localhost:3000` and `localhost:8080`
- H2 in-memory database for demo purposes
- Auto-generated avatars using ui-avatars.com service
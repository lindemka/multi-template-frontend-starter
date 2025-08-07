# Deployment Scripts Guide

## 🚀 Quick Start Scripts (Root Directory)

### 1. `./deploy-simple.sh`
**Purpose**: Quick development deployment (most commonly used)
**What it does**:
- Checks PostgreSQL status
- Builds backend JAR only
- Starts backend on port 8080
- Optionally starts frontend dev server on port 3000
- Opens browser automatically

**When to use**: Daily development work
```bash
./deploy-simple.sh
```

### 2. `./deploy-production.sh`
**Purpose**: Full production build and deployment
**What it does**:
- Builds frontend to static files (Next.js export)
- Copies static files to Spring Boot resources
- Builds backend JAR with embedded frontend
- Runs as single application on port 8080
- Opens browser to login page

**When to use**: Testing production build locally
```bash
./deploy-production.sh
```

### 3. `./deploy-unified.sh`
**Purpose**: Alternative production deployment
**What it does**:
- Similar to deploy-production.sh
- Single port serving (8080)
- Unified frontend + backend

**When to use**: Alternative production testing
```bash
./deploy-unified.sh
```

### 4. `./test-api.sh`
**Purpose**: Test API endpoints
**What it does**:
- Tests authentication
- Tests member endpoints
- Verifies API responses

**When to use**: API validation
```bash
./test-api.sh
```

## 📁 Scripts Directory (`/scripts`)

### Development Scripts

#### `scripts/dev.sh`
**Purpose**: Start development environment
```bash
./scripts/dev.sh
```

#### `scripts/dev-clean.sh`
**Purpose**: Clean start of development environment
- Removes old builds
- Clears caches
- Fresh start
```bash
./scripts/dev-clean.sh
```

### Build Scripts

#### `scripts/build.sh`
**Purpose**: Build both frontend and backend
```bash
./scripts/build.sh
```

### Deployment Scripts

#### `scripts/deploy.sh`
**Purpose**: Standard deployment
```bash
./scripts/deploy.sh
```

#### `scripts/deploy-safe.sh`
**Purpose**: Safe deployment with backups
```bash
./scripts/deploy-safe.sh
```

#### `scripts/deploy-isolated.sh`
**Purpose**: Isolated deployment (Docker)
```bash
./scripts/deploy-isolated.sh
```

#### `scripts/deploy-optimized.sh`
**Purpose**: Optimized production deployment
```bash
./scripts/deploy-optimized.sh
```

### Utility Scripts

#### `scripts/status.sh`
**Purpose**: Check system status
- Shows running services
- Port usage
- Database status
```bash
./scripts/status.sh
```

#### `scripts/migrate-to-postgres.sh`
**Purpose**: Database migration
```bash
./scripts/migrate-to-postgres.sh
```

## 🎯 Which Script to Use?

| Scenario | Script | Command |
|----------|--------|---------|
| **Daily Development** | deploy-simple.sh | `./deploy-simple.sh` |
| **Test Production Build** | deploy-production.sh | `./deploy-production.sh` |
| **Check System Status** | scripts/status.sh | `./scripts/status.sh` |
| **Clean Development Start** | scripts/dev-clean.sh | `./scripts/dev-clean.sh` |
| **API Testing** | test-api.sh | `./test-api.sh` |
| **Production Deploy** | scripts/deploy-optimized.sh | `./scripts/deploy-optimized.sh` |

## 🔧 Port Configuration

### Development Mode
- **Frontend**: Port 3000 (Next.js dev server)
- **Backend**: Port 8080 (Spring Boot API)
- **Database**: Port 5432 (PostgreSQL)

### Production Mode
- **Application**: Port 8080 (serves both frontend + API)
- **Database**: Port 5432 (PostgreSQL)

## 📝 Environment Variables

### Backend (.env or application.yml)
```yaml
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: project1
DB_USER: postgres
DB_PASSWORD: password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🚨 Important Notes

1. **Always use scripts** - Don't run manual commands
2. **Check PostgreSQL** - Must be running before deployment
3. **Port conflicts** - Kill existing processes if ports are in use
4. **Logs location**:
   - Backend: `backend/production.log`
   - Frontend: `frontend.log`

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
kill $(lsof -ti:3000)

# Kill process on port 8080
kill $(lsof -ti:8080)
```

### PostgreSQL Not Running
```bash
# macOS
brew services start postgresql@16

# Linux
sudo systemctl start postgresql
```

### Check Running Services
```bash
# Check all ports
lsof -i :3000
lsof -i :8080
lsof -i :5432

# Check Java processes
ps aux | grep java

# Check Node processes
ps aux | grep node
```

## 🐳 Docker Deployment (Future)

### Build Docker Images
```bash
# Backend
docker build -t fbase-backend ./backend

# Frontend  
docker build -t fbase-frontend ./frontend
```

### Run with Docker Compose
```bash
docker-compose up -d
```

### Deploy to Digital Ocean
```bash
# Build and push to registry
docker build -t registry.digitalocean.com/fbase/backend ./backend
docker push registry.digitalocean.com/fbase/backend

# Deploy via DO App Platform or Droplet
doctl apps create --spec .do/app.yaml
```

## 📊 Script Execution Flow

```
User runs script
    ↓
Check prerequisites (Node, Java, PostgreSQL)
    ↓
Stop existing services
    ↓
Build application(s)
    ↓
Start services
    ↓
Verify health
    ↓
Open browser
```

## ✅ Best Practices

1. **Development**: Use `./deploy-simple.sh`
2. **Production Test**: Use `./deploy-production.sh`
3. **Clean Start**: Use `./scripts/dev-clean.sh`
4. **Check Status**: Use `./scripts/status.sh`
5. **Never manually start services** - Always use scripts

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for secrets
- PostgreSQL password should be changed in production
- JWT secrets must be unique per environment

## 📚 Additional Resources

- Backend README: `/backend/README.md`
- Frontend README: `/frontend/README.md`
- API Documentation: http://localhost:8080/swagger-ui.html (if enabled)
- Application Logs: `tail -f backend/production.log`
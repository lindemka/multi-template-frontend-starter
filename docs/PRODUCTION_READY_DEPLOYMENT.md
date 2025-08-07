# Production-Ready Deployment Guide

## ✅ Current Deployment Options

### Local Development
```bash
./deploy-simple.sh
```

### Local Production Test
```bash
./deploy-production.sh
```

## 🐳 Docker Deployment (Production Ready)

### Prerequisites
- Docker installed
- Docker Hub or DigitalOcean Container Registry account
- PostgreSQL database (managed or self-hosted)

### 1. Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: project1
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/project1
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD:-password}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 3. Build and Run Locally with Docker
```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

## 🌊 Digital Ocean Deployment

### Option 1: App Platform (Recommended)

1. **Create .do/app.yaml**:
```yaml
name: fbase
region: nyc
services:
- name: backend
  github:
    repo: YOUR_GITHUB_REPO
    branch: main
    deploy_on_push: true
  build_command: cd backend && ./mvnw clean package
  run_command: java -jar target/fbase-0.0.1-SNAPSHOT.jar
  environment_slug: java
  instance_size_slug: basic-xxs
  instance_count: 1
  http_port: 8080
  envs:
  - key: DATABASE_URL
    scope: RUN_TIME
    value: ${db.DATABASE_URL}
databases:
- name: db
  engine: PG
  version: "16"
```

2. **Deploy**:
```bash
doctl apps create --spec .do/app.yaml
```

### Option 2: Droplet with Docker

1. **Create Droplet** (Ubuntu 22.04)

2. **SSH and Setup**:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Clone repository
git clone YOUR_REPO
cd YOUR_REPO

# Create .env file
cat > .env << EOF
DB_PASSWORD=secure_password_here
JWT_SECRET=your_jwt_secret_here
EOF

# Run
docker compose up -d
```

3. **Setup Nginx** (optional):
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/fbase
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 3: Container Registry

1. **Build and Push**:
```bash
# Login to registry
doctl registry login

# Build
docker build -t registry.digitalocean.com/YOUR_REGISTRY/fbase:latest ./backend

# Push
docker push registry.digitalocean.com/YOUR_REGISTRY/fbase:latest
```

2. **Deploy via App Platform or Kubernetes**

## 🔐 Production Environment Variables

### Required
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DB_PASSWORD=secure_password

# Security
JWT_SECRET=random_long_string_here
JWT_EXPIRATION=86400000

# Application
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# CORS (if needed)
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Optional
```env
# Monitoring
SENTRY_DSN=your_sentry_dsn
NEW_RELIC_LICENSE_KEY=your_key

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_key
```

## 📊 Monitoring & Logging

### Health Check Endpoint
```bash
curl https://yourdomain.com/health
```

### Application Logs
```bash
# Docker
docker logs container_name

# DO App Platform
doctl apps logs YOUR_APP_ID

# Droplet
journalctl -u fbase -f
```

## 🚀 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        env:
          REGISTRY: registry.digitalocean.com
          IMAGE: ${{ secrets.DO_REGISTRY }}/fbase
        run: |
          echo ${{ secrets.DO_REGISTRY_TOKEN }} | docker login $REGISTRY -u ${{ secrets.DO_REGISTRY_TOKEN }} --password-stdin
          docker build -t $IMAGE:latest -t $IMAGE:${{ github.sha }} ./backend
          docker push $IMAGE:latest
          docker push $IMAGE:${{ github.sha }}
      
      - name: Deploy to DO App Platform
        run: |
          doctl apps create-deployment ${{ secrets.DO_APP_ID }}
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS configured
- [ ] CORS settings updated
- [ ] JWT secret changed from default
- [ ] Error monitoring setup (Sentry/New Relic)
- [ ] Health checks configured
- [ ] Logging aggregation setup
- [ ] Auto-scaling configured (if needed)
- [ ] CDN for static assets (if needed)

## 📝 Quick Commands Reference

### Local Development
```bash
./deploy-simple.sh          # Start development
./scripts/status.sh         # Check status
./test-api.sh              # Test APIs
```

### Production Deployment
```bash
./deploy-production.sh      # Test production locally
docker-compose up          # Run with Docker
doctl apps create          # Deploy to DO
```

### Troubleshooting
```bash
docker logs container_name  # Check logs
docker exec -it container_name sh  # Debug container
curl http://localhost:8080/health  # Health check
```

## 🔗 Important URLs

- **Development**: http://localhost:3000
- **Production Test**: http://localhost:8080
- **Docker**: http://localhost:8080
- **Deployed**: https://yourdomain.com
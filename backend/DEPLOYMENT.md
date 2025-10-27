# 🚀 Deployment Guide - Uni App Backend

This guide covers deploying the Uni App backend to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] JWT secrets generated (strong, unique values)
- [ ] CORS origins configured
- [ ] SSL/TLS certificates ready (for production)
- [ ] Database backups configured
- [ ] Monitoring setup

## 🐳 Docker Deployment (Recommended)

### Production Deployment

1. **Prepare Environment Variables**

Create a `.env` file with production values:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_DATABASE=uni_app_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT (Generate strong secrets!)
JWT_SECRET=YOUR_PRODUCTION_JWT_SECRET_HERE
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=YOUR_PRODUCTION_REFRESH_SECRET_HERE
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_SALT_ROUNDS=12

# CORS (Update with your frontend URLs)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true
```

2. **Build and Deploy**

```bash
# Build the Docker image
docker-compose build

# Start the services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Check status
docker-compose ps
```

3. **Verify Deployment**

```bash
# Health check
curl http://localhost:3000/api/v1/auth/login

# Should return 405 Method Not Allowed (endpoint exists)
```

### Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml uni-app

# Scale backend
docker service scale uni-app_backend=3

# Check services
docker service ls
```

## ☁️ Cloud Deployment Options

### AWS (Elastic Beanstalk)

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p docker uni-app-backend
```

3. **Create Environment**
```bash
eb create uni-app-prod
```

4. **Deploy**
```bash
eb deploy
```

### AWS (ECS with Fargate)

1. **Build and Push Image**
```bash
# Tag image
docker tag uni-app-backend:latest YOUR_ECR_REPO/uni-app-backend:latest

# Push to ECR
docker push YOUR_ECR_REPO/uni-app-backend:latest
```

2. **Create Task Definition** (use AWS Console or CLI)

3. **Create Service** with desired number of tasks

### Google Cloud Platform (Cloud Run)

1. **Build Image**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/uni-app-backend
```

2. **Deploy**
```bash
gcloud run deploy uni-app-backend \
  --image gcr.io/PROJECT_ID/uni-app-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure (Container Instances)

1. **Create Resource Group**
```bash
az group create --name uni-app-rg --location eastus
```

2. **Create Container Registry**
```bash
az acr create --resource-group uni-app-rg \
  --name uniappregistry --sku Basic
```

3. **Deploy Container**
```bash
az container create --resource-group uni-app-rg \
  --name uni-app-backend \
  --image uniappregistry.azurecr.io/uni-app-backend:latest \
  --dns-name-label uni-app-backend \
  --ports 3000
```

### Heroku

1. **Create Heroku App**
```bash
heroku create uni-app-backend
```

2. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_here
# ... set all other variables
```

4. **Deploy**
```bash
git push heroku main
```

### DigitalOcean (App Platform)

1. **Create `app.yaml`**
```yaml
name: uni-app-backend
services:
  - name: backend
    github:
      repo: your-username/uni-app
      branch: main
      deploy_on_push: true
    dockerfile_path: backend/Dockerfile
    envs:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        value: ${JWT_SECRET}
    http_port: 3000
databases:
  - name: uni-app-db
    engine: PG
    version: "16"
```

2. **Deploy**
```bash
doctl apps create --spec app.yaml
```

## 🗄️ Database Setup

### PostgreSQL on Cloud

#### AWS RDS
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier uni-app-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20
```

#### Google Cloud SQL
```bash
gcloud sql instances create uni-app-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1
```

#### Azure Database for PostgreSQL
```bash
az postgres server create \
  --resource-group uni-app-rg \
  --name uni-app-db \
  --location eastus \
  --admin-user postgres \
  --admin-password YOUR_PASSWORD \
  --sku-name B_Gen5_1
```

### Apply Database Schema

```bash
# Connect to production database
psql -h YOUR_DB_HOST -U postgres -d uni_app_db

# Run schema
\i database/schema.sql

# Verify
\dt
```

## 🔒 Security Hardening

### 1. Environment Variables

**Never commit `.env` files!**

Use secret management services:
- AWS Secrets Manager
- Google Secret Manager
- Azure Key Vault
- HashiCorp Vault

### 2. SSL/TLS

Enable HTTPS using:
- Let's Encrypt (free)
- AWS Certificate Manager
- Cloudflare SSL

### 3. Rate Limiting

Add to `main.ts`:
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

// In AppModule
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
}),
```

### 4. Helmet Configuration

Already included in `main.ts`, but verify settings:
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
```

### 5. Database Connection Pooling

Update TypeORM config:
```typescript
extra: {
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
}
```

## 📊 Monitoring & Logging

### Application Monitoring

**Recommended Tools:**
- New Relic
- Datadog
- Sentry (error tracking)
- LogRocket

**Setup Sentry:**
```bash
npm install @sentry/node
```

```typescript
// main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Logging

**Winston Logger:**
```bash
npm install nest-winston winston
```

### Health Checks

Add health check endpoint:
```bash
npm install @nestjs/terminus
```

## 🔄 CI/CD Pipeline

### GitHub Actions

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
      
      - name: Build Docker Image
        run: docker build -t uni-app-backend ./backend
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push uni-app-backend:latest
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA ./backend
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - docker-compose up -d
  only:
    - main
```

## 🔧 Performance Optimization

### 1. Enable Compression
Already included in `main.ts`

### 2. Database Indexing
Already included in `schema.sql`

### 3. Caching
```bash
npm install @nestjs/cache-manager cache-manager
```

### 4. Connection Pooling
Configure in TypeORM settings

## 📈 Scaling Strategies

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Run multiple backend instances
- Session management with Redis

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Use database read replicas

## 🆘 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check environment variables
docker-compose config
```

### Database Connection Issues
```bash
# Test connection
docker-compose exec backend node -e "require('pg').Client({...}).connect()"

# Check network
docker network inspect uni-app-network
```

### High Memory Usage
```bash
# Check container stats
docker stats

# Limit memory
docker-compose.yml:
  services:
    backend:
      deploy:
        resources:
          limits:
            memory: 512M
```

## 📝 Post-Deployment

1. **Verify all endpoints work**
2. **Test authentication flow**
3. **Check database connectivity**
4. **Monitor logs for errors**
5. **Set up automated backups**
6. **Configure monitoring alerts**
7. **Document any custom configurations**

---

**Deployment Complete! 🎉**

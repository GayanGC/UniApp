# 🚀 Quick Setup Guide - Uni App Backend

This guide will help you get the Uni App backend up and running quickly.

## 📋 Prerequisites Checklist

- [ ] Node.js 20.x or higher installed
- [ ] PostgreSQL 16 or higher installed (or Docker)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update these critical values:
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (generate a random string)
# - JWT_REFRESH_SECRET (generate another random string)
```

**Generate secure secrets:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 3: Setup Database

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL with Docker
docker-compose -f docker-compose.dev.yml up -d postgres

# The schema will be automatically applied
```

**Option B: Using Local PostgreSQL**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE uni_app_db;"

# Apply schema
psql -U postgres -d uni_app_db -f database/schema.sql
```

### Step 4: Run the Application

```bash
# Development mode with hot reload
npm run start:dev
```

The API will be available at: **http://localhost:3000/api/v1**

## 🧪 Test the API

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "fullName": "Test User",
    "role": "student",
    "university": "Test University",
    "faculty": "Computer Science",
    "academicYear": "2024"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

Save the `accessToken` from the response.

### 3. Get Current User Profile

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐳 Docker Setup (Alternative)

### Full Stack with Docker

```bash
# Start everything (PostgreSQL + Backend + pgAdmin)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

Access:
- **API**: http://localhost:3000/api/v1
- **pgAdmin**: http://localhost:5050 (email: admin@uniapp.com, password: admin)

## 🔧 Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Issue: Database connection failed
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Or for local PostgreSQL
sudo service postgresql status  # Linux
brew services list              # Mac
```

### Issue: JWT errors
```bash
# Make sure JWT_SECRET is set in .env
# Generate a new secret if needed
```

### Issue: TypeORM synchronize errors
```bash
# Set DB_SYNCHRONIZE=false in .env
# Use the schema.sql file instead
```

## 📊 Database Management

### Using pgAdmin (Docker)

1. Start pgAdmin:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d pgadmin
   ```

2. Open http://localhost:5050
3. Login with:
   - Email: `admin@uniapp.com`
   - Password: `admin`

4. Add server:
   - Host: `postgres` (or `localhost` if not using Docker)
   - Port: `5432`
   - Username: `postgres`
   - Password: (your DB_PASSWORD)

### Using psql

```bash
# Connect to database
psql -U postgres -d uni_app_db

# List tables
\dt

# View users
SELECT * FROM users;

# View students
SELECT * FROM students;

# Exit
\q
```

## 🎯 Next Steps

1. **Explore the API**: Check `README.md` for complete API documentation
2. **Add Features**: Extend the modules in `src/modules/`
3. **Configure CORS**: Update `CORS_ORIGIN` in `.env` for your frontend
4. **Security**: Change all default passwords and secrets
5. **Testing**: Run `npm run test` to execute tests

## 📚 Useful Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run typeorm migration:generate -- src/migrations/MigrationName
npm run typeorm migration:run

# Code Quality
npm run lint               # Check code style
npm run format             # Format code
npm run test               # Run tests
npm run test:cov           # Test coverage

# Docker
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f backend          # View backend logs
docker-compose exec postgres psql -U postgres  # Access database
```

## 🆘 Need Help?

- Check the main `README.md` for detailed documentation
- Review the API endpoints in the README
- Check Docker logs: `docker-compose logs -f`
- Verify environment variables in `.env`

---

**Happy Coding! 🎉**

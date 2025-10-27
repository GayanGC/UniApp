# ⚡ Quick Reference Guide - Uni App Backend

## 🚀 Quick Start (Copy & Paste)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Start database
docker-compose -f docker-compose.dev.yml up -d postgres

# 4. Run application
npm run start:dev
```

## 📡 API Endpoints Cheat Sheet

### Authentication (Public)
```bash
# Register
POST /api/v1/auth/register
Body: { email, password, fullName, role, university?, faculty?, academicYear? }

# Login
POST /api/v1/auth/login
Body: { email, password }

# Get Profile
GET /api/v1/auth/me
Headers: { Authorization: Bearer <token> }
```

### Users (Protected)
```bash
# Get all users (Admin only)
GET /api/v1/users
Headers: { Authorization: Bearer <token> }

# Get user by ID
GET /api/v1/users/:id
Headers: { Authorization: Bearer <token> }

# Create user (Admin only)
POST /api/v1/users
Headers: { Authorization: Bearer <token> }
Body: { email, password, fullName, role, isActive? }

# Update user
PATCH /api/v1/users/:id
Headers: { Authorization: Bearer <token> }
Body: { fullName?, email?, password?, role?, isActive? }

# Delete user (Admin only)
DELETE /api/v1/users/:id
Headers: { Authorization: Bearer <token> }
```

## 🔑 User Roles

| Role | Value | Description |
|------|-------|-------------|
| Admin | `admin` | Full system access |
| Student | `student` | Enrolled students with extended profile |
| Prospective | `prospective` | Prospective students |
| Boarding Provider | `boarding_provider` | Accommodation providers |

## 📝 Request Examples

### Register Student
```json
{
  "email": "student@university.edu",
  "password": "Student@123",
  "fullName": "John Doe",
  "role": "student",
  "university": "Stanford University",
  "faculty": "Computer Science",
  "academicYear": "2024"
}
```

### Register Admin
```json
{
  "email": "admin@uniapp.com",
  "password": "Admin@123456",
  "fullName": "System Admin",
  "role": "admin"
}
```

### Login
```json
{
  "email": "student@university.edu",
  "password": "Student@123"
}
```

### Update User
```json
{
  "fullName": "Jane Doe",
  "isActive": true
}
```

## 🔐 Password Requirements

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (@$!%*?&)

**Valid Examples:**
- `Student@123`
- `Admin@123456`
- `SecurePass1!`

## 🐳 Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d        # Start dev environment
docker-compose -f docker-compose.dev.yml down         # Stop dev environment
docker-compose -f docker-compose.dev.yml logs -f      # View logs

# Production
docker-compose up -d                                  # Start production
docker-compose down                                   # Stop production
docker-compose logs -f backend                        # View backend logs
docker-compose ps                                     # Check status
docker-compose restart backend                        # Restart backend

# Database
docker-compose exec postgres psql -U postgres         # Access PostgreSQL
docker-compose exec postgres pg_dump -U postgres uni_app_db > backup.sql  # Backup
```

## 💾 Database Commands

```bash
# Connect to database
psql -U postgres -d uni_app_db

# Common queries
SELECT * FROM users;                                  # View all users
SELECT * FROM students;                               # View all students
SELECT * FROM users WHERE role = 'student';          # View students only
SELECT u.*, s.* FROM users u LEFT JOIN students s ON u.user_id = s.user_id;  # Join query

# Useful commands
\dt                                                   # List tables
\d users                                             # Describe users table
\q                                                   # Quit
```

## 🛠️ NPM Scripts

```bash
# Development
npm run start                # Start (no watch)
npm run start:dev           # Start with watch mode
npm run start:debug         # Start in debug mode

# Build
npm run build               # Build for production

# Production
npm run start:prod          # Run production build

# Code Quality
npm run lint                # Run ESLint
npm run format              # Format with Prettier

# Testing
npm run test                # Run unit tests
npm run test:watch          # Run tests in watch mode
npm run test:cov            # Run tests with coverage
npm run test:e2e            # Run E2E tests

# Database
npm run typeorm migration:generate -- src/migrations/MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

## 🌍 Environment Variables

```env
# Essential Variables
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=uni_app_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

## 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST (register, create) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid credentials, missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Server error |

## 🔍 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `User with this email already exists` | Duplicate email | Use different email |
| `Invalid credentials` | Wrong email/password | Check credentials |
| `User not found` | User doesn't exist | Check user ID |
| `Unauthorized` | Missing/invalid token | Login again |
| `Forbidden resource` | Insufficient permissions | Check user role |
| `Password must be at least 8 characters` | Weak password | Use stronger password |

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","fullName":"Test User","role":"student"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get All Users (replace TOKEN)
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Important File Locations

```
backend/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.module.ts                    # Root module
│   ├── modules/auth/auth.service.ts     # Auth logic
│   ├── modules/users/users.service.ts   # User logic
│   └── config/typeorm.config.ts         # DB config
├── database/schema.sql                  # Database schema
├── .env                                 # Environment variables
├── package.json                         # Dependencies
├── Dockerfile                           # Docker image
└── docker-compose.yml                   # Docker services
```

## 🔧 Troubleshooting Quick Fixes

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeORM Error
```bash
# Set synchronize to false
DB_SYNCHRONIZE=false

# Use schema.sql instead
psql -U postgres -d uni_app_db -f database/schema.sql
```

## 📱 VS Code Extensions

Install these for better development experience:
- ESLint
- Prettier
- REST Client
- Docker
- PostgreSQL

## 🎯 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| API | http://localhost:3000/api/v1 | - |
| PostgreSQL | localhost:5432 | postgres / (your password) |
| pgAdmin | http://localhost:5050 | admin@uniapp.com / admin |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP.md | Quick setup guide |
| API_EXAMPLES.md | API usage examples |
| DEPLOYMENT.md | Production deployment |
| ARCHITECTURE.md | System architecture |
| CONTRIBUTING.md | Contribution guidelines |
| PROJECT_SUMMARY.md | Project overview |
| QUICK_REFERENCE.md | This file |

## 🔐 Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set DB_SYNCHRONIZE=false in production
- [ ] Configure CORS_ORIGIN properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring

## 🚦 Health Check

```bash
# Check if API is running
curl http://localhost:3000/api/v1/auth/login

# Should return: 405 Method Not Allowed (endpoint exists)

# Check database connection
docker-compose exec postgres pg_isready -U postgres

# Should return: accepting connections
```

## 📞 Quick Help

**API not starting?**
1. Check `.env` file exists
2. Check database is running
3. Check port is not in use
4. Check logs: `npm run start:dev`

**Database issues?**
1. Check PostgreSQL is running
2. Check credentials in `.env`
3. Check database exists
4. Run schema.sql

**Authentication failing?**
1. Check JWT_SECRET is set
2. Check token is valid
3. Check user is active
4. Check password is correct

**Docker issues?**
1. Check Docker is running
2. Check ports are available
3. Check `.env` file
4. View logs: `docker-compose logs -f`

---

**Keep this file handy for quick reference! 📌**

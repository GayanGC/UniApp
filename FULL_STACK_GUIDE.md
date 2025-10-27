# 🚀 Full Stack Guide - Uni App

Complete guide to running the entire Uni App platform (Backend + Frontend)

---

## 📋 Overview

**Uni App** is a full-stack university application platform with:
- **Backend:** NestJS (TypeScript) with PostgreSQL
- **Frontend:** Next.js 14 (React) with Tailwind CSS
- **Authentication:** JWT-based with role-based access control
- **Features:** User management, student profiles, boarding posts

---

## 🎯 Quick Start (Both Services)

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- npm or yarn

### Step 1: Start Backend

```bash
# Terminal 1 - Backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Start database (Docker)
docker-compose -f docker-compose.dev.yml up -d postgres

# Apply database schema
psql -U postgres -d uni_app_db -f database/schema.sql

# Start backend
npm run start:dev
```

**Backend running at:** http://localhost:3000

### Step 2: Start Frontend

```bash
# Terminal 2 - Frontend
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Default values work for local development

# Start frontend
npm run dev
```

**Frontend running at:** http://localhost:3001

### Step 3: Test the Application

1. Open http://localhost:3001
2. Click "Get Started"
3. Register a new account
4. Login and explore your dashboard

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                  http://localhost:3001                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │ JWT Authentication
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3001)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Login, Register, Dashboards                  │   │
│  │  Auth: JWT token in cookies                         │   │
│  │  State: React Context API                           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Axios HTTP Requests
                         │ /api/v1/*
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS Backend (Port 3000)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Modules: Auth, Users, Students, Boarding           │   │
│  │  Auth: JWT Strategy, Guards                         │   │
│  │  Validation: class-validator                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TypeORM
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)                 │
│  Tables: users, students, boarding_posts                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Project Structure

```
uni-app/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/                # Authentication
│   │   │   ├── users/               # User management
│   │   │   ├── students/            # Student profiles
│   │   │   └── boarding/            # Boarding posts
│   │   ├── config/                  # Configuration
│   │   └── common/                  # Shared code
│   ├── database/
│   │   └── schema.sql              # Database schema
│   └── package.json
│
├── frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # Pages (App Router)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── student/
│   │   │   ├── provider/
│   │   │   └── admin/
│   │   ├── components/              # React components
│   │   ├── contexts/                # Auth context
│   │   ├── services/                # API services
│   │   └── types/                   # TypeScript types
│   └── package.json
│
└── Documentation files
```

---

## 🔐 Authentication Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. Frontend validates input
   ↓
3. POST /api/v1/auth/register
   ↓
4. Backend validates data
   ↓
5. Password hashed with bcrypt
   ↓
6. User saved to database
   ↓
7. JWT token generated
   ↓
8. Token sent to frontend
   ↓
9. Token stored in cookies
   ↓
10. User redirected to dashboard
```

### Login Flow

```
1. User enters credentials
   ↓
2. POST /api/v1/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Password verified with bcrypt
   ↓
5. JWT token generated
   ↓
6. Token sent to frontend
   ↓
7. Token stored in cookies
   ↓
8. User redirected based on role
```

### Protected Request Flow

```
1. User accesses protected page
   ↓
2. Frontend checks authentication
   ↓
3. Token added to request header
   ↓
4. Backend validates JWT
   ↓
5. User role checked
   ↓
6. Access granted/denied
```

---

## 🎯 User Roles & Access

### Role Matrix

| Role | Dashboard | Can Access |
|------|-----------|------------|
| **Admin** | `/admin/dashboard` | All endpoints, user management |
| **Student** | `/student/dashboard` | Student profile, view boarding posts |
| **Boarding Provider** | `/provider/dashboard` | Create/manage boarding posts |
| **Prospective** | `/prospective/dashboard` | View universities, browse posts |

### API Endpoints by Role

**Public Endpoints:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

**Student Only:**
- `PATCH /api/v1/students/profile`
- `GET /api/v1/students/profile`

**Provider Only:**
- `POST /api/v1/boarding`
- `GET /api/v1/boarding/my-posts`
- `PATCH /api/v1/boarding/:id` (own posts)
- `DELETE /api/v1/boarding/:id` (own posts)

**All Authenticated:**
- `GET /api/v1/auth/me`
- `GET /api/v1/boarding`
- `GET /api/v1/boarding/:id`

**Admin Only:**
- `GET /api/v1/users`
- `POST /api/v1/users`
- `DELETE /api/v1/users/:id`

---

## 🧪 Testing Guide

### Test User Accounts

Create these test accounts for testing:

```bash
# 1. Admin User
Email: admin@test.com
Password: Admin@123456
Role: admin

# 2. Student User
Email: student@test.com
Password: Student@123
Role: student

# 3. Provider User
Email: provider@test.com
Password: Provider@123
Role: boarding_provider

# 4. Prospective User
Email: prospective@test.com
Password: Prospective@123
Role: prospective
```

### Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Try invalid credentials
- [ ] Try weak password

**Role-Based Access:**
- [ ] Student can access student dashboard
- [ ] Provider can access provider dashboard
- [ ] Student cannot access provider dashboard
- [ ] Unauthorized page shows for wrong role

**Student Features:**
- [ ] Update student profile
- [ ] View student profile
- [ ] Browse boarding posts

**Provider Features:**
- [ ] Create boarding post
- [ ] View my posts
- [ ] Update own post
- [ ] Delete own post
- [ ] Cannot modify other's posts

**UI/UX:**
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Loading states work
- [ ] Responsive on mobile
- [ ] Navigation works

---

## 🔧 Configuration

### Backend Environment (.env)

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=uni_app_db
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_SALT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3001
CORS_CREDENTIALS=true
```

### Frontend Environment (.env.local)

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# App Config
NEXT_PUBLIC_APP_NAME=Uni App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Database connection failed
```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Check credentials in .env
# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

**Problem:** Port 3000 already in use
```bash
# Change PORT in .env
PORT=3001

# Or kill process
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

**Problem:** Module not found
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Problem:** Cannot connect to backend
```bash
# Verify backend is running
curl http://localhost:3000/api/v1/auth/login

# Check NEXT_PUBLIC_API_URL in .env.local
```

**Problem:** Login fails
```bash
# Check backend logs
# Verify user exists in database
# Try registering new user
```

**Problem:** Redirected to unauthorized
```bash
# This is expected if accessing wrong dashboard
# Login with correct role
# Check user role in database
```

---

## 📝 Development Workflow

### Adding New Features

1. **Backend:**
   ```bash
   cd backend
   # Create new module
   nest g module feature-name
   nest g controller feature-name
   nest g service feature-name
   ```

2. **Frontend:**
   ```bash
   cd frontend
   # Create new page
   # Add to src/app/feature-name/page.tsx
   # Create components in src/components/
   ```

3. **Database:**
   ```bash
   # Update schema.sql
   # Create migration
   # Apply to database
   ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

---

## 🚀 Deployment

### Backend Deployment

```bash
# Build
npm run build

# Start production
npm run start:prod

# Or use Docker
docker-compose up -d
```

### Frontend Deployment

```bash
# Build
npm run build

# Start production
npm run start

# Or deploy to Vercel
vercel deploy
```

### Environment Variables

**Production Backend:**
- Set strong JWT secrets
- Use production database
- Enable SSL
- Set CORS to production URL

**Production Frontend:**
- Update API URL to production
- Enable analytics
- Configure CDN

---

## 📚 Documentation Links

### Backend
- [Backend README](backend/README.md)
- [API Examples](backend/API_EXAMPLES.md)
- [New Features](backend/NEW_FEATURES.md)
- [Migration Guide](backend/MIGRATION_GUIDE.md)

### Frontend
- [Frontend README](frontend/README.md)
- [Setup Guide](frontend/SETUP_GUIDE.md)
- [Frontend Complete](FRONTEND_COMPLETE.md)

### Full Stack
- [Phase 2 Complete](PHASE_2_COMPLETE.md)
- [Implementation Complete](IMPLEMENTATION_COMPLETE.md)

---

## ✅ Production Checklist

**Backend:**
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] JWT secrets changed
- [ ] CORS configured
- [ ] SSL enabled
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Database backups enabled

**Frontend:**
- [ ] Environment variables set
- [ ] API URL updated
- [ ] Build optimized
- [ ] Analytics added
- [ ] SEO configured
- [ ] Error tracking setup
- [ ] CDN configured

**Security:**
- [ ] Strong passwords enforced
- [ ] JWT tokens secure
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] SQL injection protected

**Testing:**
- [ ] All features tested
- [ ] Cross-browser tested
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Error handling verified

---

## 🎉 Success!

You now have a complete full-stack application running with:

✅ **Backend API** - NestJS with PostgreSQL  
✅ **Frontend App** - Next.js with Tailwind CSS  
✅ **Authentication** - JWT with role-based access  
✅ **User Management** - Complete CRUD operations  
✅ **Student Profiles** - Profile management  
✅ **Boarding Posts** - Accommodation listings  

**Ready for production deployment!** 🚀

---

**Built with ❤️ using NestJS, Next.js, PostgreSQL, and Tailwind CSS**

# 🎓 Uni App - Backend API

A production-ready NestJS backend API for the University Application Platform, featuring user management, authentication, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Security](#security)

## ✨ Features

- **User Management**: Complete CRUD operations for users
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Support for Admin, Student, Prospective, and Boarding Provider roles
- **Student Profiles**: Extended profile information for student users
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: PostgreSQL with TypeORM
- **API Versioning**: URI-based versioning (v1)
- **Docker Support**: Production-ready Docker configuration
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, bcrypt
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── database/
│   └── schema.sql              # PostgreSQL database schema
├── src/
│   ├── common/
│   │   ├── decorators/         # Custom decorators (Public, Roles, CurrentUser)
│   │   └── enums/              # Enums (UserRole)
│   ├── config/                 # Configuration files
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── typeorm.config.ts
│   ├── modules/
│   │   ├── auth/               # Authentication module
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── guards/         # JWT & Roles guards
│   │   │   ├── strategies/     # Passport strategies
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── users/              # Users module
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── entities/       # TypeORM entities
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
├── Dockerfile                  # Production Docker image
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16 or higher
- npm or yarn
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your database and JWT secrets.

4. **Set up the database**
   
   Create a PostgreSQL database and run the schema:
   ```bash
   psql -U postgres -d uni_app_db -f database/schema.sql
   ```

5. **Run the application**
   
   Development mode:
   ```bash
   npm run start:dev
   ```
   
   Production mode:
   ```bash
   npm run build
   npm run start:prod
   ```

The API will be available at `http://localhost:3000/api/v1`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "student",
  "university": "University of Example",
  "faculty": "Computer Science",
  "academicYear": "2024"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student",
    "isActive": true
  }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student",
    "isActive": true
  }
}
```

#### Get Current User Profile
```http
GET /api/v1/auth/me
Authorization: Bearer {accessToken}
```

### User Management Endpoints

#### Get All Users (Admin only)
```http
GET /api/v1/users
Authorization: Bearer {accessToken}
```

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer {accessToken}
```

#### Update User
```http
PATCH /api/v1/users/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "isActive": true
}
```

#### Delete User (Admin only)
```http
DELETE /api/v1/users/:id
Authorization: Bearer {accessToken}
```

### User Roles

- **admin**: Full system access
- **student**: Enrolled university students
- **prospective**: Prospective students
- **boarding_provider**: Accommodation providers

## 🗄 Database Schema

### Users Table
```sql
- user_id (PK, Serial)
- email (Unique, VARCHAR)
- password_hash (VARCHAR)
- role (ENUM: admin, student, prospective, boarding_provider)
- full_name (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Students Table
```sql
- student_id (PK, Serial)
- user_id (FK to users, Unique)
- university (VARCHAR)
- faculty (VARCHAR)
- academic_year (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🐳 Docker Deployment

### Development Environment

Start PostgreSQL and pgAdmin for development:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Access:
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`

### Production Deployment

Build and run the complete stack:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- NestJS backend API
- pgAdmin (optional, use `--profile tools`)

Access:
- API: `http://localhost:3000/api/v1`
- pgAdmin: `http://localhost:5050` (with `--profile tools`)

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=uni_app_db
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_SALT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
CORS_CREDENTIALS=true
```

## 🔒 Security

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### JWT Authentication
- Tokens expire after 24 hours (configurable)
- Refresh tokens available for extended sessions
- Tokens include user ID, email, and role

### Security Features
- Helmet.js for HTTP headers security
- CORS protection
- Input validation with class-validator
- Password hashing with bcrypt (10 rounds)
- SQL injection protection via TypeORM
- XSS protection

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

```bash
npm run start          # Start in development mode
npm run start:dev      # Start with watch mode
npm run start:prod     # Start in production mode
npm run build          # Build the application
npm run lint           # Lint the code
npm run format         # Format the code with Prettier
```

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commits

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ using NestJS**

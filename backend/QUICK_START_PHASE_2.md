# ⚡ Quick Start - Phase 2 Features

Get started with Student Profile and Boarding Posts management in 5 minutes!

---

## 🚀 Setup (3 Steps)

### Step 1: Apply Database Migration

```bash
# If you have an existing database
psql -U postgres -d uni_app_db -f database/migration-boarding-posts.sql

# Or with Docker
docker-compose exec -T postgres psql -U postgres -d uni_app_db < database/migration-boarding-posts.sql

# For fresh setup
psql -U postgres -d uni_app_db -f database/schema.sql
```

### Step 2: Restart Application

```bash
npm run start:dev
```

### Step 3: Verify

```bash
curl http://localhost:3000/api/v1/auth/login
# Should return: 405 Method Not Allowed (endpoint exists)
```

---

## 🎯 Quick Test

### Test Student Profile (2 minutes)

```bash
# 1. Register as student
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Student@123",
    "fullName": "Test Student",
    "role": "student"
  }'

# Copy the accessToken from response

# 2. Update profile
curl -X PATCH http://localhost:3000/api/v1/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "university": "Stanford University",
    "faculty": "Computer Science",
    "academicYear": "2024"
  }'

# 3. Get profile
curl -X GET http://localhost:3000/api/v1/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Boarding Posts (3 minutes)

```bash
# 1. Register as provider
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "Provider@123",
    "fullName": "Campus Housing",
    "role": "boarding_provider"
  }'

# Copy the accessToken from response

# 2. Create a post
curl -X POST http://localhost:3000/api/v1/boarding \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Student Room",
    "description": "Fully furnished with WiFi",
    "monthlyRent": 450.00,
    "locationDetails": "Near campus"
  }'

# 3. Get your posts
curl -X GET http://localhost:3000/api/v1/boarding/my-posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Get all available posts (any user can do this)
curl -X GET http://localhost:3000/api/v1/boarding \
  -H "Authorization: Bearer ANY_USER_TOKEN"
```

---

## 📋 New Endpoints

### Student Profile

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `PATCH` | `/api/v1/students/profile` | Student | Update profile |
| `GET` | `/api/v1/students/profile` | Student | Get profile |

### Boarding Posts

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/boarding` | Provider | Create post |
| `GET` | `/api/v1/boarding/my-posts` | Provider | Get my posts |
| `GET` | `/api/v1/boarding` | Any | Get all posts |
| `GET` | `/api/v1/boarding/:id` | Any | Get single post |
| `PATCH` | `/api/v1/boarding/:id` | Provider | Update post |
| `DELETE` | `/api/v1/boarding/:id` | Provider | Delete post |

---

## 🔑 Request Examples

### Update Student Profile

```json
PATCH /api/v1/students/profile
Authorization: Bearer <student_token>

{
  "university": "Stanford University",
  "faculty": "Computer Science",
  "academicYear": "2024"
}
```

### Create Boarding Post

```json
POST /api/v1/boarding
Authorization: Bearer <provider_token>

{
  "title": "Student Room Near Campus",
  "description": "Fully furnished room with WiFi and utilities",
  "monthlyRent": 450.00,
  "isAvailable": true,
  "locationDetails": "123 University Ave, 5 min walk"
}
```

### Update Boarding Post

```json
PATCH /api/v1/boarding/1
Authorization: Bearer <provider_token>

{
  "monthlyRent": 475.00,
  "isAvailable": false
}
```

---

## 🔐 Access Control

### Who Can Access What?

**Student Profile:**
- ✅ Students can update their own profile
- ❌ Providers cannot access student endpoints
- ❌ Students cannot access provider endpoints

**Boarding Posts:**
- ✅ Providers can create, update, delete their own posts
- ✅ All users can view available posts
- ❌ Students cannot create posts
- ❌ Providers can only modify their own posts

---

## 🧪 Using VS Code REST Client

Create or use `requests-new-features.http`:

```http
### Variables
@baseUrl = http://localhost:3000/api/v1
@studentToken = YOUR_TOKEN
@providerToken = YOUR_TOKEN

### Register Student
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "Student@123",
  "fullName": "Test Student",
  "role": "student"
}

### Update Student Profile
PATCH {{baseUrl}}/students/profile
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "university": "Stanford",
  "faculty": "CS",
  "academicYear": "2024"
}

### Create Boarding Post
POST {{baseUrl}}/boarding
Authorization: Bearer {{providerToken}}
Content-Type: application/json

{
  "title": "Student Room",
  "monthlyRent": 450.00
}
```

---

## ❌ Common Errors

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Cause:** Wrong role trying to access endpoint  
**Solution:** Use correct role (student for profile, provider for posts)

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause:** Missing or invalid token  
**Solution:** Login again and use fresh token

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Boarding post not found"
}
```
**Cause:** Resource doesn't exist  
**Solution:** Check ID and try again

---

## 📊 Database Verification

```bash
# Connect to database
psql -U postgres -d uni_app_db

# Check boarding_posts table
\d boarding_posts

# View posts
SELECT * FROM boarding_posts;

# View students
SELECT * FROM students;

# Exit
\q
```

---

## 🔧 Troubleshooting

### Application won't start
```bash
# Check logs
npm run start:dev

# Look for errors related to:
# - Database connection
# - Missing modules
# - TypeORM entities
```

### Migration failed
```bash
# Check if table exists
psql -U postgres -d uni_app_db -c "\dt boarding_posts"

# If exists, migration already done
# If not, run migration again
```

### Endpoints return 404
```bash
# Verify application started
curl http://localhost:3000/api/v1/auth/login

# Check app.module.ts includes new modules
# Restart application
```

---

## 📚 Documentation

- **Complete Guide:** `NEW_FEATURES.md`
- **Migration:** `MIGRATION_GUIDE.md`
- **API Tests:** `requests-new-features.http`
- **Summary:** `PHASE_2_COMPLETE.md`

---

## ✅ Checklist

- [ ] Database migration applied
- [ ] Application restarted
- [ ] Can register as student
- [ ] Can update student profile
- [ ] Can register as provider
- [ ] Can create boarding post
- [ ] Can view all posts
- [ ] Role restrictions working

---

**You're ready to use the new features! 🎉**

For detailed documentation, see `NEW_FEATURES.md`

# 🎉 New Features - Student Profile & Boarding Management

## 📋 Overview

This document describes the new features added to the Uni App Backend:
1. **Student Profile Management** - Protected endpoint for students to manage their profiles
2. **Boarding Posts Management** - Complete CRUD system for boarding providers

---

## ✅ What's New

### 1. Student Profile Management Module

**Module:** `StudentsModule`  
**Location:** `src/modules/students/`

#### Endpoints

##### Update Student Profile
```http
PATCH /api/v1/students/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "university": "Stanford University",
  "faculty": "Computer Science",
  "academicYear": "2024"
}
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Only accessible to users with role `student`
- ✅ Automatically uses user_id from JWT token

**Features:**
- Creates student profile if it doesn't exist
- Updates existing profile fields
- All fields are optional
- Validates input data

##### Get Student Profile
```http
GET /api/v1/students/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "studentId": 1,
  "userId": 5,
  "university": "Stanford University",
  "faculty": "Computer Science",
  "academicYear": "2024",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "user": {
    "userId": 5,
    "email": "student@university.edu",
    "fullName": "John Doe",
    "role": "student"
  }
}
```

---

### 2. Boarding Posts Management Module

**Module:** `BoardingModule`  
**Location:** `src/modules/boarding/`

#### Database Schema

**New Table:** `boarding_posts`

```sql
CREATE TABLE boarding_posts (
    post_id SERIAL PRIMARY KEY,
    provider_user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    location_details VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_boarding_provider FOREIGN KEY (provider_user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);
```

**Indexes:**
- `idx_boarding_posts_provider_user_id` - For filtering by provider
- `idx_boarding_posts_is_available` - For filtering available posts

#### Endpoints

##### Create Boarding Post
```http
POST /api/v1/boarding
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cozy Student Room Near Campus",
  "description": "Fully furnished room with WiFi, utilities included",
  "monthlyRent": 450.00,
  "isAvailable": true,
  "locationDetails": "123 University Ave, 5 min walk to campus"
}
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Only accessible to users with role `boarding_provider`
- ✅ Automatically sets provider_user_id from JWT token

**Response (201 Created):**
```json
{
  "postId": 1,
  "providerUserId": 3,
  "title": "Cozy Student Room Near Campus",
  "description": "Fully furnished room with WiFi, utilities included",
  "monthlyRent": 450.00,
  "isAvailable": true,
  "locationDetails": "123 University Ave, 5 min walk to campus",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

##### Get My Posts
```http
GET /api/v1/boarding/my-posts
Authorization: Bearer <token>
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Only accessible to users with role `boarding_provider`
- ✅ Returns only posts created by the authenticated user

**Response (200 OK):**
```json
[
  {
    "postId": 1,
    "providerUserId": 3,
    "title": "Cozy Student Room Near Campus",
    "description": "Fully furnished room with WiFi, utilities included",
    "monthlyRent": 450.00,
    "isAvailable": true,
    "locationDetails": "123 University Ave, 5 min walk to campus",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

##### Get All Available Posts
```http
GET /api/v1/boarding
Authorization: Bearer <token>
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Accessible to all authenticated users

**Response (200 OK):**
```json
[
  {
    "postId": 1,
    "providerUserId": 3,
    "title": "Cozy Student Room Near Campus",
    "description": "Fully furnished room with WiFi, utilities included",
    "monthlyRent": 450.00,
    "isAvailable": true,
    "locationDetails": "123 University Ave, 5 min walk to campus",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "provider": {
      "userId": 3,
      "fullName": "Campus Housing Ltd",
      "email": "provider@housing.com"
    }
  }
]
```

##### Get Single Post
```http
GET /api/v1/boarding/:id
Authorization: Bearer <token>
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Accessible to all authenticated users

##### Update Boarding Post
```http
PATCH /api/v1/boarding/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "monthlyRent": 500.00,
  "isAvailable": false
}
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Only accessible to users with role `boarding_provider`
- ✅ Only the post owner can update their own posts

**Features:**
- All fields are optional
- Validates ownership before updating
- Returns 403 Forbidden if user is not the owner

##### Delete Boarding Post
```http
DELETE /api/v1/boarding/:id
Authorization: Bearer <token>
```

**Access Control:**
- ✅ Protected by JWT authentication
- ✅ Only accessible to users with role `boarding_provider`
- ✅ Only the post owner can delete their own posts

**Response:** 204 No Content

---

## 🔐 Role-Based Access Control (RBAC)

### Implementation

All endpoints use NestJS Guards for role-based access control:

1. **JwtAuthGuard** - Validates JWT token (applied globally)
2. **RolesGuard** - Checks user role against required roles

### Role Requirements

| Endpoint | Required Role |
|----------|---------------|
| `PATCH /api/v1/students/profile` | `student` |
| `GET /api/v1/students/profile` | `student` |
| `POST /api/v1/boarding` | `boarding_provider` |
| `GET /api/v1/boarding/my-posts` | `boarding_provider` |
| `GET /api/v1/boarding` | Any authenticated user |
| `GET /api/v1/boarding/:id` | Any authenticated user |
| `PATCH /api/v1/boarding/:id` | `boarding_provider` (owner only) |
| `DELETE /api/v1/boarding/:id` | `boarding_provider` (owner only) |

### How It Works

```typescript
// Example: Student Profile Update
@Patch('profile')
@Roles(UserRole.STUDENT)  // Only students can access
@UseGuards(JwtAuthGuard, RolesGuard)
async updateProfile(
  @CurrentUser('userId') userId: number,  // Extracted from JWT
  @Body() updateDto: UpdateStudentProfileDto,
) {
  return await this.studentsService.updateProfile(userId, updateDto);
}
```

---

## 📊 Database Updates

### New Table

**boarding_posts** table added with:
- Foreign key to users table
- Automatic timestamps
- Proper indexing
- Cascade delete

### Updated Schema File

Location: `database/schema.sql`

To apply the new schema:

```bash
# Option 1: Run the complete schema (fresh database)
psql -U postgres -d uni_app_db -f database/schema.sql

# Option 2: Add only the new table (existing database)
psql -U postgres -d uni_app_db -c "
CREATE TABLE boarding_posts (
    post_id SERIAL PRIMARY KEY,
    provider_user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    location_details VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_boarding_provider FOREIGN KEY (provider_user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_boarding_posts_provider_user_id ON boarding_posts(provider_user_id);
CREATE INDEX idx_boarding_posts_is_available ON boarding_posts(is_available);

CREATE TRIGGER update_boarding_posts_updated_at 
    BEFORE UPDATE ON boarding_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
"
```

---

## 🧪 Testing Examples

### Student Profile Management

#### 1. Register as Student
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Student@123",
    "fullName": "Test Student",
    "role": "student"
  }'
```

Save the `accessToken` from the response.

#### 2. Update Student Profile
```bash
curl -X PATCH http://localhost:3000/api/v1/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "university": "Stanford University",
    "faculty": "Computer Science",
    "academicYear": "2024"
  }'
```

#### 3. Get Student Profile
```bash
curl -X GET http://localhost:3000/api/v1/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Boarding Posts Management

#### 1. Register as Boarding Provider
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "Provider@123",
    "fullName": "Campus Housing",
    "role": "boarding_provider"
  }'
```

#### 2. Create Boarding Post
```bash
curl -X POST http://localhost:3000/api/v1/boarding \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Student Room Near Campus",
    "description": "Fully furnished with WiFi",
    "monthlyRent": 450.00,
    "locationDetails": "123 University Ave"
  }'
```

#### 3. Get My Posts
```bash
curl -X GET http://localhost:3000/api/v1/boarding/my-posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Get All Available Posts (Any User)
```bash
curl -X GET http://localhost:3000/api/v1/boarding \
  -H "Authorization: Bearer ANY_USER_TOKEN"
```

#### 5. Update Post
```bash
curl -X PATCH http://localhost:3000/api/v1/boarding/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "monthlyRent": 500.00,
    "isAvailable": false
  }'
```

#### 6. Delete Post
```bash
curl -X DELETE http://localhost:3000/api/v1/boarding/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔒 Security Features

### Input Validation

All DTOs use class-validator decorators:

```typescript
export class CreateBoardingPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNumber()
  @Min(0)
  monthlyRent: number;
  
  // ... more fields
}
```

### Authorization Checks

- JWT token validation on all endpoints
- Role-based access control via Guards
- Ownership validation for update/delete operations
- Automatic user_id extraction from JWT

### Error Handling

- 401 Unauthorized - Invalid/missing token
- 403 Forbidden - Insufficient permissions or not owner
- 404 Not Found - Resource doesn't exist
- 400 Bad Request - Validation errors

---

## 📁 File Structure

```
backend/src/modules/
├── students/
│   ├── dto/
│   │   ├── update-student-profile.dto.ts
│   │   └── index.ts
│   ├── students.controller.ts
│   ├── students.service.ts
│   └── students.module.ts
│
└── boarding/
    ├── dto/
    │   ├── create-boarding-post.dto.ts
    │   ├── update-boarding-post.dto.ts
    │   └── index.ts
    ├── entities/
    │   ├── boarding-post.entity.ts
    │   └── index.ts
    ├── boarding.controller.ts
    ├── boarding.service.ts
    └── boarding.module.ts
```

---

## 🚀 Getting Started

### 1. Apply Database Schema

```bash
# If using Docker
docker-compose -f docker-compose.dev.yml restart postgres

# Apply schema
psql -U postgres -d uni_app_db -f database/schema.sql
```

### 2. Restart Application

```bash
npm run start:dev
```

### 3. Test Endpoints

Use the examples above or the `requests.http` file with VS Code REST Client.

---

## 📝 Summary

### New Modules
- ✅ **StudentsModule** - Student profile management
- ✅ **BoardingModule** - Boarding posts CRUD

### New Endpoints
- ✅ `PATCH /api/v1/students/profile` - Update student profile
- ✅ `GET /api/v1/students/profile` - Get student profile
- ✅ `POST /api/v1/boarding` - Create boarding post
- ✅ `GET /api/v1/boarding/my-posts` - Get provider's posts
- ✅ `GET /api/v1/boarding` - Get all available posts
- ✅ `GET /api/v1/boarding/:id` - Get single post
- ✅ `PATCH /api/v1/boarding/:id` - Update post
- ✅ `DELETE /api/v1/boarding/:id` - Delete post

### Security Features
- ✅ JWT authentication on all endpoints
- ✅ Role-based access control (RBAC)
- ✅ Ownership validation for updates/deletes
- ✅ Input validation with class-validator
- ✅ Automatic user_id extraction from JWT

---

**All features are production-ready and fully tested! 🎉**

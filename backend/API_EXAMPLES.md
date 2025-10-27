# 📡 API Examples - Uni App Backend

Complete examples for testing all API endpoints.

## 🔐 Authentication Endpoints

### 1. Register a New Student

**Request:**
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "john.doe@university.edu",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "student",
  "university": "Stanford University",
  "faculty": "Computer Science",
  "academicYear": "2024"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "role": "student",
    "university": "Stanford University",
    "faculty": "Computer Science",
    "academicYear": "2024"
  }'
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5kb2VAdW5pdmVyc2l0eS5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.signature",
  "user": {
    "userId": 1,
    "email": "john.doe@university.edu",
    "fullName": "John Doe",
    "role": "student",
    "isActive": true
  }
}
```

### 2. Register an Admin User

**Request:**
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@uniapp.com",
  "password": "Admin@123456",
  "fullName": "System Administrator",
  "role": "admin"
}
```

### 3. Register a Boarding Provider

**Request:**
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "provider@boarding.com",
  "password": "Provider@123",
  "fullName": "Campus Housing Ltd",
  "role": "boarding_provider"
}
```

### 4. Login

**Request:**
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@university.edu",
  "password": "SecurePass123!"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "john.doe@university.edu",
    "fullName": "John Doe",
    "role": "student",
    "isActive": true
  }
}
```

### 5. Get Current User Profile

**Request:**
```bash
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "email": "john.doe@university.edu",
  "role": "student"
}
```

## 👥 User Management Endpoints

### 1. Get All Users (Admin Only)

**Request:**
```bash
GET http://localhost:3000/api/v1/users
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
[
  {
    "userId": 1,
    "email": "john.doe@university.edu",
    "role": "student",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "student": {
      "studentId": 1,
      "userId": 1,
      "university": "Stanford University",
      "faculty": "Computer Science",
      "academicYear": "2024"
    }
  },
  {
    "userId": 2,
    "email": "admin@uniapp.com",
    "role": "admin",
    "fullName": "System Administrator",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get User by ID

**Request:**
```bash
GET http://localhost:3000/api/v1/users/1
Authorization: Bearer ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "email": "john.doe@university.edu",
  "role": "student",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "student": {
    "studentId": 1,
    "userId": 1,
    "university": "Stanford University",
    "faculty": "Computer Science",
    "academicYear": "2024",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create User (Admin Only)

**Request:**
```bash
POST http://localhost:3000/api/v1/users
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "NewUser@123",
  "fullName": "New User",
  "role": "prospective",
  "isActive": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "NewUser@123",
    "fullName": "New User",
    "role": "prospective",
    "isActive": true
  }'
```

### 4. Update User

**Request:**
```bash
PATCH http://localhost:3000/api/v1/users/1
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "fullName": "John Smith",
  "isActive": true
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "isActive": true
  }'
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "email": "john.doe@university.edu",
  "role": "student",
  "fullName": "John Smith",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### 5. Delete User (Admin Only)

**Request:**
```bash
DELETE http://localhost:3000/api/v1/users/1
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Response (204 No Content)**

## 🚨 Error Responses

### 400 Bad Request - Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters long"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized - Invalid Credentials
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### 409 Conflict - Email Already Exists
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## 🧪 Testing with Postman

### Import Collection

1. Create a new collection in Postman
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000/api/v1`
3. Create environment variable: `{{accessToken}}`

### Authentication Flow

1. **Register** → Save `accessToken` to environment
2. **Login** → Update `accessToken` in environment
3. Use `{{accessToken}}` in Authorization header for protected routes

### Example Postman Request

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@123456"
}
```

## 🔧 Testing with VS Code REST Client

Install the REST Client extension and create a `requests.http` file:

```http
### Variables
@baseUrl = http://localhost:3000/api/v1
@accessToken = YOUR_TOKEN_HERE

### Register
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123456",
  "fullName": "Test User",
  "role": "student"
}

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123456"
}

### Get Profile
GET {{baseUrl}}/auth/me
Authorization: Bearer {{accessToken}}

### Get All Users
GET {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
```

## 📝 Password Requirements

All passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Valid Examples:**
- `SecurePass123!`
- `Admin@123456`
- `Test@Password1`

**Invalid Examples:**
- `password` (no uppercase, number, or special char)
- `Pass123` (too short, no special char)
- `PASSWORD123!` (no lowercase)

---

**Happy Testing! 🚀**

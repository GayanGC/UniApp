# 🏗️ Uni App Backend - Architecture Documentation

## 📐 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│          (Web App - React/Next.js, Mobile - Flutter)        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
                         │ JWT Authentication
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway / Load Balancer             │
│                     (Nginx, AWS ALB, etc.)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Backend API                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Application Layer                       │   │
│  │  ┌────────────────┐      ┌────────────────┐         │   │
│  │  │  Auth Module   │      │  Users Module  │         │   │
│  │  │  - Register    │      │  - CRUD Ops    │         │   │
│  │  │  - Login       │      │  - Validation  │         │   │
│  │  │  - JWT Auth    │      │  - Students    │         │   │
│  │  └────────────────┘      └────────────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                    │   │
│  │  - Services                                          │   │
│  │  - Validation                                        │   │
│  │  - Business Rules                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Access Layer                       │   │
│  │  - TypeORM                                           │   │
│  │  - Repositories                                      │   │
│  │  - Entities                                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ users table  │──────────────│students table│            │
│  │              │  1:1 relation│              │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Architectural Patterns

### 1. Layered Architecture

**Presentation Layer (Controllers)**
- Handle HTTP requests/responses
- Route mapping
- Request validation
- Response formatting

**Business Logic Layer (Services)**
- Core business logic
- Data transformation
- Business rule enforcement
- Transaction management

**Data Access Layer (Repositories/TypeORM)**
- Database operations
- Query building
- Entity management
- Data persistence

### 2. Module-Based Architecture (NestJS)

```
AppModule (Root)
├── ConfigModule (Global)
├── TypeOrmModule (Global)
├── AuthModule
│   ├── AuthController
│   ├── AuthService
│   ├── JwtStrategy
│   ├── Guards (JwtAuthGuard, RolesGuard)
│   └── DTOs (RegisterDto, LoginDto)
└── UsersModule
    ├── UsersController
    ├── UsersService
    ├── Entities (User, Student)
    └── DTOs (CreateUserDto, UpdateUserDto)
```

## 🔄 Request Flow

### Authentication Flow

```
1. Client Request
   POST /api/v1/auth/register
   Body: { email, password, fullName, role, ... }
   
2. Controller Layer (AuthController)
   ↓ Validates DTO
   ↓ Calls AuthService.register()
   
3. Service Layer (AuthService)
   ↓ Checks if user exists
   ↓ Calls UsersService.create()
   
4. Service Layer (UsersService)
   ↓ Hashes password with bcrypt
   ↓ Creates user entity
   ↓ Saves to database via TypeORM
   
5. Service Layer (AuthService)
   ↓ Creates student profile (if role = student)
   ↓ Generates JWT token
   ↓ Returns response
   
6. Controller Layer
   ↓ Formats response
   ↓ Returns to client
   
7. Client Response
   { accessToken, user: { userId, email, ... } }
```

### Protected Route Flow

```
1. Client Request
   GET /api/v1/users
   Headers: { Authorization: Bearer <token> }
   
2. Global Guard (JwtAuthGuard)
   ↓ Extracts JWT from header
   ↓ Validates token
   ↓ Calls JwtStrategy.validate()
   
3. JWT Strategy
   ↓ Decodes token payload
   ↓ Fetches user from database
   ↓ Checks if user is active
   ↓ Attaches user to request object
   
4. Role Guard (RolesGuard)
   ↓ Checks user role against required roles
   ↓ Allows/denies access
   
5. Controller Layer (UsersController)
   ↓ Calls UsersService.findAll()
   
6. Service Layer (UsersService)
   ↓ Queries database via TypeORM
   ↓ Returns users (excluding passwords)
   
7. Controller Layer
   ↓ Returns response to client
```

## 🗄️ Database Architecture

### Entity Relationship Diagram

```
┌─────────────────────────────────────────┐
│              users                      │
├─────────────────────────────────────────┤
│ PK  user_id          SERIAL             │
│     email            VARCHAR(255) UNIQUE│
│     password_hash    VARCHAR(255)       │
│     role             ENUM                │
│     full_name        VARCHAR(255)       │
│     is_active        BOOLEAN            │
│     created_at       TIMESTAMP          │
│     updated_at       TIMESTAMP          │
└──────────────┬──────────────────────────┘
               │ 1
               │
               │ 1 (user_id FK)
               │
┌──────────────▼──────────────────────────┐
│            students                     │
├─────────────────────────────────────────┤
│ PK  student_id       SERIAL             │
│ FK  user_id          INTEGER UNIQUE     │
│     university       VARCHAR(255)       │
│     faculty          VARCHAR(255)       │
│     academic_year    VARCHAR(50)        │
│     created_at       TIMESTAMP          │
│     updated_at       TIMESTAMP          │
└─────────────────────────────────────────┘
```

### Indexing Strategy

**users table:**
- Primary key index on `user_id`
- Unique index on `email` (for fast login lookups)
- Index on `role` (for role-based queries)
- Index on `is_active` (for filtering active users)

**students table:**
- Primary key index on `student_id`
- Unique index on `user_id` (enforces 1:1 relationship)
- Foreign key index on `user_id` (for joins)

## 🔐 Security Architecture

### Authentication & Authorization Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Security Layers                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Transport Layer Security (HTTPS)                     │
│     └─ TLS/SSL encryption                                │
│                                                           │
│  2. CORS Protection                                      │
│     └─ Allowed origins validation                        │
│                                                           │
│  3. Helmet.js Security Headers                           │
│     ├─ Content Security Policy                           │
│     ├─ X-Frame-Options                                   │
│     ├─ X-Content-Type-Options                            │
│     └─ Strict-Transport-Security                         │
│                                                           │
│  4. Input Validation                                     │
│     ├─ class-validator (DTO validation)                  │
│     ├─ Type checking                                     │
│     └─ Sanitization                                      │
│                                                           │
│  5. Authentication (JWT)                                 │
│     ├─ Token generation                                  │
│     ├─ Token validation                                  │
│     └─ Token expiration                                  │
│                                                           │
│  6. Authorization (RBAC)                                 │
│     ├─ Role-based access control                         │
│     ├─ Resource ownership validation                     │
│     └─ Permission checking                               │
│                                                           │
│  7. Data Layer Security                                  │
│     ├─ Parameterized queries (TypeORM)                   │
│     ├─ Password hashing (bcrypt)                         │
│     └─ Sensitive data exclusion                          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Password Security

```
Registration/Password Update Flow:
┌─────────────────────────────────────┐
│  Plain Password                     │
│  "MyPassword123!"                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  bcrypt.hash()                      │
│  - Salt rounds: 10 (configurable)   │
│  - Automatic salt generation        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Hashed Password                    │
│  "$2b$10$..."                       │
│  (Stored in database)               │
└─────────────────────────────────────┘

Login Flow:
┌─────────────────────────────────────┐
│  User enters password               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  bcrypt.compare()                   │
│  - Plain password vs hash           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Boolean result                     │
│  true = valid, false = invalid      │
└─────────────────────────────────────┘
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": 1,              // user_id
    "email": "user@example.com",
    "role": "student",
    "iat": 1700000000,     // issued at
    "exp": 1700086400      // expires at
  },
  "signature": "..."
}
```

## 🔌 Dependency Injection

### NestJS DI Container

```typescript
// Module defines providers
@Module({
  imports: [TypeOrmModule.forFeature([User, Student])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

// Service receives dependencies via constructor
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
}

// Controller receives service
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
}
```

### Dependency Graph

```
AppModule
├── ConfigModule (Global)
│   └── ConfigService
├── TypeOrmModule (Global)
│   └── DataSource
├── AuthModule
│   ├── AuthService
│   │   ├── UsersService (from UsersModule)
│   │   ├── JwtService
│   │   └── ConfigService
│   ├── JwtStrategy
│   │   ├── UsersService
│   │   └── ConfigService
│   └── AuthController
│       └── AuthService
└── UsersModule
    ├── UsersService
    │   ├── UserRepository (TypeORM)
    │   ├── StudentRepository (TypeORM)
    │   └── ConfigService
    └── UsersController
        └── UsersService
```

## 📦 Module Responsibilities

### AuthModule
**Responsibilities:**
- User registration
- User login
- JWT token generation
- JWT token validation
- Password verification

**Dependencies:**
- UsersModule (for user operations)
- JwtModule (for token operations)
- PassportModule (for authentication strategies)

### UsersModule
**Responsibilities:**
- User CRUD operations
- Student profile management
- User validation
- Password hashing
- Email uniqueness checking

**Dependencies:**
- TypeOrmModule (for database access)
- ConfigModule (for configuration)

## 🎨 Design Patterns Used

### 1. Repository Pattern
```typescript
// TypeORM repositories abstract database operations
@InjectRepository(User)
private userRepository: Repository<User>

// Usage
await this.userRepository.find()
await this.userRepository.save(user)
```

### 2. Strategy Pattern
```typescript
// Different authentication strategies
export class JwtStrategy extends PassportStrategy(Strategy) {
  // JWT validation strategy
}

// Can add more strategies:
// - LocalStrategy (username/password)
// - OAuth2Strategy (Google, Facebook)
```

### 3. Decorator Pattern
```typescript
// Custom decorators enhance functionality
@Public()              // Skip authentication
@Roles(UserRole.ADMIN) // Require specific role
@CurrentUser()         // Extract user from request
```

### 4. Guard Pattern
```typescript
// Guards protect routes
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  // Protected routes
}
```

### 5. DTO Pattern
```typescript
// Data Transfer Objects for validation
export class RegisterDto {
  @IsEmail()
  email: string;
  
  @MinLength(8)
  password: string;
}
```

### 6. Singleton Pattern
```typescript
// Services are singletons by default
@Injectable()
export class UsersService {
  // Single instance shared across app
}
```

## 🔄 Data Flow Patterns

### Create Operation (User Registration)

```
Client → Controller → Service → Repository → Database
  ↓         ↓          ↓           ↓            ↓
Request   Validate   Business   TypeORM      INSERT
  DTO       DTO       Logic      Query       Query
```

### Read Operation (Get Users)

```
Client → Controller → Service → Repository → Database
  ↓         ↓          ↓           ↓            ↓
Request   Auth      Transform   TypeORM      SELECT
 Token    Check      Data       Query        Query
```

### Update Operation (Update User)

```
Client → Controller → Service → Repository → Database
  ↓         ↓          ↓           ↓            ↓
Request   Validate   Check      TypeORM      UPDATE
  DTO     Auth+DTO   Exists     Query        Query
```

### Delete Operation (Delete User)

```
Client → Controller → Service → Repository → Database
  ↓         ↓          ↓           ↓            ↓
Request   Check      Check      TypeORM      DELETE
 Token    Admin      Exists     Query        Query
```

## 🚀 Scalability Considerations

### Horizontal Scaling
- Stateless design (JWT tokens)
- No session storage
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Efficient queries with indexes
- Lazy loading for relations
- Pagination support (ready to implement)
- Caching layer (ready to add)

### Database Scaling
- Read replicas support
- Connection pooling
- Query optimization
- Proper indexing

## 🔧 Configuration Management

### Environment-Based Configuration

```
Development → .env (local settings)
Staging     → .env.staging (staging settings)
Production  → .env.production (production settings)
```

### Configuration Hierarchy

```
1. Environment Variables (.env file)
2. Configuration Files (config/*.ts)
3. Module Configuration (module imports)
4. Default Values (fallbacks)
```

## 📊 Error Handling Architecture

### Exception Hierarchy

```
HttpException (Base)
├── BadRequestException (400)
├── UnauthorizedException (401)
├── ForbiddenException (403)
├── NotFoundException (404)
├── ConflictException (409)
└── InternalServerErrorException (500)
```

### Error Flow

```
Service throws exception
       ↓
NestJS Exception Filter catches
       ↓
Formats error response
       ↓
Returns to client with proper status code
```

## 🧪 Testing Architecture

### Test Pyramid

```
        ┌──────────┐
        │   E2E    │  ← Few, slow, comprehensive
        ├──────────┤
        │Integration│ ← Some, medium speed
        ├──────────┤
        │   Unit   │  ← Many, fast, focused
        └──────────┘
```

### Test Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts      ← Unit tests
│   └── users/
│       ├── users.service.ts
│       └── users.service.spec.ts     ← Unit tests
└── test/
    └── auth.e2e-spec.ts              ← E2E tests
```

## 📈 Performance Optimization

### Database Level
- Proper indexing
- Query optimization
- Connection pooling
- Lazy loading

### Application Level
- Efficient algorithms
- Minimal data transfer
- Response compression
- Caching (ready to implement)

### Network Level
- GZIP compression
- HTTP/2 support
- CDN for static assets
- Load balancing

---

**Architecture designed for scalability, security, and maintainability**

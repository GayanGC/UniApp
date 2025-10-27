# 🤝 Contributing to Uni App Backend

Thank you for your interest in contributing to the Uni App Backend! This document provides guidelines and standards for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/uni-app.git
   cd uni-app/backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up development environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

5. **Start development database**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

6. **Run the application**
   ```bash
   npm run start:dev
   ```

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow existing patterns
   - Add tests for new features

3. **Test your changes**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 📝 Coding Standards

### TypeScript Style

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` type when possible
- Use interfaces for object types
- Use enums for fixed sets of values

### Naming Conventions

**Files:**
- `kebab-case.ts` for files
- `PascalCase` for classes
- `camelCase` for variables and functions

**Examples:**
```typescript
// ✅ Good
user.service.ts
auth.controller.ts
UserRole (enum)
createUser() (function)

// ❌ Bad
UserService.ts
auth_controller.ts
user_role (enum)
CreateUser() (function)
```

### Code Organization

```typescript
// 1. Imports (grouped and sorted)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 2. Interfaces/Types
interface UserData {
  email: string;
  name: string;
}

// 3. Class declaration
@Injectable()
export class UserService {
  // 4. Properties
  private readonly logger = new Logger(UserService.name);

  // 5. Constructor
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 6. Public methods
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 7. Private methods
  private validateUser(user: User): boolean {
    return user.isActive;
  }
}
```

### Documentation

**Add JSDoc comments for:**
- All public methods
- Complex logic
- Non-obvious code

```typescript
/**
 * Creates a new user in the system
 * @param createUserDto - User creation data
 * @returns Created user entity
 * @throws ConflictException if email already exists
 */
async create(createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

### Error Handling

```typescript
// ✅ Good - Use NestJS exceptions
throw new NotFoundException('User not found');
throw new ConflictException('Email already exists');

// ❌ Bad - Don't use generic errors
throw new Error('User not found');
```

### DTOs and Validation

```typescript
// Always use class-validator decorators
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

## 📦 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add JWT refresh token functionality

fix(users): resolve duplicate email validation issue

docs(readme): update installation instructions

refactor(auth): simplify token generation logic

test(users): add unit tests for user service
```

### Scope

Common scopes:
- `auth` - Authentication module
- `users` - Users module
- `config` - Configuration
- `database` - Database related
- `docker` - Docker configuration

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

### PR Title

Follow commit message format:
```
feat(auth): add two-factor authentication
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)

## Related Issues
Closes #123
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

## 🧪 Testing Guidelines

### Unit Tests

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ userId: 1, email: 'test@test.com' }];
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);

      expect(await service.findAll()).toEqual(users);
    });
  });
});
```

### E2E Tests

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Test@123',
        fullName: 'Test User',
        role: 'student',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user.email).toBe('test@test.com');
      });
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths and error cases
- Test edge cases
- Mock external dependencies

## 🏗️ Project Structure

When adding new features, follow this structure:

```
src/modules/your-module/
├── dto/
│   ├── create-your-entity.dto.ts
│   ├── update-your-entity.dto.ts
│   └── index.ts
├── entities/
│   ├── your-entity.entity.ts
│   └── index.ts
├── your-module.controller.ts
├── your-module.service.ts
├── your-module.module.ts
└── your-module.service.spec.ts
```

## 🔒 Security Guidelines

- Never commit sensitive data
- Use environment variables for secrets
- Validate all user inputs
- Sanitize database queries
- Use parameterized queries
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeORM Documentation](https://typeorm.io)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Ask in discussions
4. Create a new issue

---

**Thank you for contributing! 🎉**

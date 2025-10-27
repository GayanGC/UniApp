# 🎓 Uni App - Frontend

A modern Next.js frontend for the University Application Platform with authentication, role-based routing, and a beautiful UI built with Tailwind CSS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Role-Based Routing](#role-based-routing)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)

## ✨ Features

- ✅ **User Authentication** - Register and login with JWT tokens
- ✅ **Role-Based Access Control** - Different dashboards for different user roles
- ✅ **Protected Routes** - Automatic redirection based on authentication status
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Form Validation** - Client-side validation for all forms
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Secure Token Storage** - HTTP-only cookies for JWT tokens

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Icons:** Lucide React
- **Cookie Management:** js-cookie

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_APP_NAME=Uni App
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── admin/
│   │   │   └── dashboard/        # Admin dashboard
│   │   ├── student/
│   │   │   └── dashboard/        # Student dashboard
│   │   ├── provider/
│   │   │   └── dashboard/        # Provider dashboard
│   │   ├── prospective/
│   │   │   └── dashboard/        # Prospective student dashboard
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── unauthorized/         # Unauthorized access page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Alert.tsx
│   │   └── ProtectedRoute.tsx   # Route protection wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── services/
│   │   └── api.ts               # API service layer
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript types
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔐 Authentication

### How It Works

1. **Registration/Login** - User submits credentials
2. **Token Storage** - JWT token stored in HTTP-only cookies
3. **Auto-Redirect** - User redirected to role-specific dashboard
4. **Token Validation** - Token sent with every API request
5. **Auto-Logout** - Invalid tokens trigger automatic logout

### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  // Access user information
  return <p>Welcome, {user?.fullName}!</p>;
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/types';

export default function StudentPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

## 🎯 Role-Based Routing

### User Roles

| Role | Value | Dashboard Route |
|------|-------|----------------|
| Admin | `admin` | `/admin/dashboard` |
| Student | `student` | `/student/dashboard` |
| Boarding Provider | `boarding_provider` | `/provider/dashboard` |
| Prospective Student | `prospective` | `/prospective/dashboard` |

### Automatic Redirection

After login, users are automatically redirected to their role-specific dashboard:

```typescript
// In AuthContext
const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'student':
      return '/student/dashboard';
    case 'boarding_provider':
      return '/provider/dashboard';
    case 'prospective':
      return '/prospective/dashboard';
    default:
      return '/';
  }
};
```

## 🌐 API Integration

### API Service

All API calls go through the centralized API service:

```typescript
import { apiService } from '@/services/api';

// Register
await apiService.register({
  email: 'user@example.com',
  password: 'Password123!',
  fullName: 'John Doe',
  role: UserRole.STUDENT,
});

// Login
await apiService.login({
  email: 'user@example.com',
  password: 'Password123!',
});
```

### Automatic Token Handling

The API service automatically:
- Adds JWT token to request headers
- Handles 401 errors (auto-logout)
- Manages token refresh

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
```

## 🎨 UI Components

### Button

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`  
**Sizes:** `sm`, `md`, `lg`

### Input

```tsx
<Input
  label="Email"
  type="email"
  placeholder="john@example.com"
  error="Invalid email"
/>
```

### Select

```tsx
<Select
  label="Role"
  options={[
    { value: 'student', label: 'Student' },
    { value: 'provider', label: 'Provider' },
  ]}
/>
```

### Alert

```tsx
<Alert type="success" message="Login successful!" />
```

**Types:** `success`, `error`, `warning`, `info`

## 🔒 Security Features

- ✅ HTTP-only cookies for token storage
- ✅ Automatic token expiration handling
- ✅ CSRF protection
- ✅ Input validation
- ✅ Secure password requirements
- ✅ Role-based access control

## 🧪 Testing

### Manual Testing

1. **Register a new user**
   - Go to `/register`
   - Fill in the form
   - Select a role
   - Submit

2. **Login**
   - Go to `/login`
   - Enter credentials
   - Verify redirect to correct dashboard

3. **Test protected routes**
   - Try accessing different dashboards
   - Verify unauthorized access is blocked

### Demo Credentials

```
Student:
- Email: student@test.com
- Password: Student@123

Provider:
- Email: provider@test.com
- Password: Provider@123
```

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** Cannot connect to backend  
**Solution:** Verify backend is running on `http://localhost:3000`

```bash
# Check backend status
curl http://localhost:3000/api/v1/auth/login
```

### Authentication Errors

**Problem:** Login fails with 401  
**Solution:** Check credentials and backend logs

### Token Expiration

**Problem:** Automatically logged out  
**Solution:** Normal behavior - tokens expire after 7 days

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎯 Next Steps

1. Implement student profile management
2. Add boarding post browsing
3. Create provider listing management
4. Add search and filtering
5. Implement real-time notifications

---

**Built with ❤️ using Next.js and Tailwind CSS**

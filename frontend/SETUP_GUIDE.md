# 🚀 Quick Setup Guide - Uni App Frontend

Get the frontend up and running in 5 minutes!

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local (optional - defaults work for local development)
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Open:** [http://localhost:3001](http://localhost:3001)

---

## ✅ Verify Setup

### 1. Check Home Page

Navigate to `http://localhost:3001` - you should see the landing page.

### 2. Test Registration

1. Click "Get Started" or go to `/register`
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test@123456
   - Role: Student
3. Submit

You should be redirected to `/student/dashboard`

### 3. Test Login

1. Logout (if logged in)
2. Go to `/login`
3. Enter credentials
4. Verify redirect to dashboard

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=Uni App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Backend Connection

**Important:** Make sure the backend is running!

```bash
# In backend directory
npm run start:dev
```

Verify backend is accessible:
```bash
curl http://localhost:3000/api/v1/auth/login
# Should return: {"statusCode":405,"message":"Method Not Allowed"}
```

---

## 📱 Pages Overview

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Pages (Require Authentication)
- `/student/dashboard` - Student dashboard (students only)
- `/provider/dashboard` - Provider dashboard (providers only)
- `/admin/dashboard` - Admin dashboard (admins only)
- `/prospective/dashboard` - Prospective student dashboard

### Special Pages
- `/unauthorized` - Shown when accessing restricted pages

---

## 🎨 Features Included

### ✅ Authentication
- User registration with role selection
- Login with email/password
- Automatic token management
- Secure cookie storage
- Auto-logout on token expiration

### ✅ Role-Based Access
- Different dashboards for each role
- Protected routes with role checking
- Automatic redirection after login
- Unauthorized access handling

### ✅ UI Components
- Modern, responsive design
- Tailwind CSS styling
- Reusable components
- Loading states
- Error handling
- Form validation

---

## 🧪 Test User Flows

### Student Registration Flow

```bash
1. Go to /register
2. Enter:
   - Full Name: John Student
   - Email: john@student.com
   - Password: Student@123
   - Role: Student
   - University: Stanford (optional)
   - Faculty: CS (optional)
   - Academic Year: 2024 (optional)
3. Submit
4. Redirected to /student/dashboard
```

### Provider Registration Flow

```bash
1. Go to /register
2. Enter:
   - Full Name: Campus Housing
   - Email: housing@provider.com
   - Password: Provider@123
   - Role: Boarding Provider
3. Submit
4. Redirected to /provider/dashboard
```

### Login Flow

```bash
1. Go to /login
2. Enter credentials
3. Submit
4. Redirected based on role:
   - Student → /student/dashboard
   - Provider → /provider/dashboard
   - Admin → /admin/dashboard
   - Prospective → /prospective/dashboard
```

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to backend"

**Cause:** Backend not running or wrong URL

**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/api/v1/auth/login

# Verify .env.local has correct URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Issue: "Module not found"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3001 already in use"

**Cause:** Another process using port 3001

**Solution:**
```bash
# Use different port
PORT=3002 npm run dev

# Or kill process on port 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Issue: "Login fails with 401"

**Cause:** Invalid credentials or backend issue

**Solution:**
1. Check credentials are correct
2. Verify user exists in backend database
3. Check backend logs for errors
4. Try registering a new user

### Issue: "Redirected to /unauthorized"

**Cause:** Trying to access page without required role

**Solution:**
- This is expected behavior
- Each dashboard requires specific role
- Login with correct role or access appropriate dashboard

---

## 📊 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── student/           # Student pages
│   │   ├── provider/          # Provider pages
│   │   ├── admin/             # Admin pages
│   │   └── prospective/       # Prospective pages
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Auth state management
│   ├── services/             # API services
│   │   └── api.ts            # Backend API calls
│   ├── lib/                  # Utilities
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript types
│       └── index.ts          # Type definitions
├── public/                    # Static files
├── .env.local                # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── tailwind.config.ts        # Tailwind config
```

---

## 🎯 Key Files

### Authentication
- `src/contexts/AuthContext.tsx` - Auth state and methods
- `src/services/api.ts` - API communication
- `src/components/ProtectedRoute.tsx` - Route protection

### Pages
- `src/app/login/page.tsx` - Login form
- `src/app/register/page.tsx` - Registration form
- `src/app/student/dashboard/page.tsx` - Student dashboard

### UI Components
- `src/components/ui/Button.tsx` - Button component
- `src/components/ui/Input.tsx` - Input component
- `src/components/ui/Select.tsx` - Select component
- `src/components/ui/Alert.tsx` - Alert component

---

## 🔐 Security Notes

### Token Storage
- JWT tokens stored in HTTP-only cookies
- Automatic expiration after 7 days
- Secure flag enabled in production

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### CORS
- Configured to allow backend requests
- Credentials included in requests

---

## 📝 Development Tips

### Hot Reload
- Changes auto-reload in development
- No need to restart server

### TypeScript
- Full type safety
- IntelliSense support
- Compile-time error checking

### Tailwind CSS
- Utility-first CSS
- Responsive by default
- Custom color palette

### Code Organization
- Components in `components/`
- Pages in `app/`
- Utilities in `lib/`
- Types in `types/`

---

## ✅ Checklist

Before deploying:

- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Role-based routing works
- [ ] Protected routes block unauthorized access
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Responsive design works on mobile
- [ ] TypeScript compiles without errors

---

## 🎉 You're Ready!

The frontend is now set up and ready to use. Try:

1. ✅ Register a new account
2. ✅ Login with credentials
3. ✅ Access your dashboard
4. ✅ Try accessing other dashboards (should be blocked)
5. ✅ Logout and login again

For detailed documentation, see `README.md`

---

**Happy Coding! 🚀**

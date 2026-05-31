🎓 Uni App — University Student Accommodation & Profile Management System

A modern, full-stack enterprise web application designed to streamline university student life, housing searches, and profile management. Built using a robust decoupled architecture featuring a **NestJS** backend framework and a **Next.js 14+ (App Router)** frontend.



🚀 Core Features Architecture

1. 🏠 Smart Boarding Discovery & Dynamic Filtering
- **Multi-Param Filtering:** Comprehensive search filters supporting case-insensitive location matching, custom price ranges (`minPrice`, `maxPrice`), and availability toggles.
- **Frontend Performance (Debouncing):** Text inputs leverage a **400ms debounce** cycle, eliminating redundant API spam while offering an immediate responsive feel for select toggles.
- **Strict Query Validation:** The backend isolates queries into scoped `ValidationPipe` instances with implicit conversions activated (`whitelist: true`), protecting SQL queries from unexpected properties.

📷 2. Secure Multi-Image Upload Pipeline
- **Multer Middleware Setup:** Intercepts `multipart/form-data` uploads securely via NestJS `FilesInterceptor`.
- **Bulletproof Validation:** Restricts uploads to safe extensions (JPEG, JPG, PNG) using rigorous MIME type checks and applies a hard **5MB file-size ceiling** per image.
- **Static Assets Distribution:** Images are systematically mapped using unique UUIDs and exposed through a secure virtual static directory path (`/uploads`).

⚡ 3. Live Event Streams (Socket.IO Real-Time Engine)
- **Bi-Directional Channels:** Powered by a backend `@WebSocketGateway` that syncs instantaneously with a global frontend React `SocketContext`.
- **Contextual Notifications:** Boarding providers receive immediate, live dashboard alerts whenever a student views their active listings—completely bypassing the need for manual page refreshes.
- **Polished Presentation:** Built-in custom CSS slide-in keyframe animations coupled with an interactive floating notification bell indicator.

🧑‍🎓 4. Adaptive Student Profile State Machine
**Automated Lifecycle Routing:** Built-in `404` error interception that intelligently detects missing database records, translating an empty state into a clean creation form instead of throwing a generic error banner.


 🛠️ Tech Stack & Dependencies

| Layer | Technology | Primary Packages Used |

| **Frontend** | Next.js 14+ (App Router) | React, Tailwind CSS, Axios, Lucide Icons, `socket.io-client` |
| **Backend** | NestJS v10 | TypeScript, TypeORM, `@nestjs/websockets`, Multer, `class-validator` |
| **Database** | PostgreSQL 16 | Managed via Docker & Docker Compose |
| **Dev Tools**| pgAdmin 4 | Database GUI containerization |


📁 System Architecture Overview

text

uni-app/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # JWT Sign-in / Guards / Roles
│   │   │   ├── boarding/      # Boarding Entities, DTOs & Search Controllers
│   │   │   ├── notifications/ # Socket Gateways & Notification Services
│   │   │   └── students/      # Profile Management Logic
│   │   └── main.ts            # Entrypoint & Static Assets Config
│   └── docker-compose.dev.yml # PostgreSQL & pgAdmin services
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router (accommodation, student)
│   │   ├── components/        # Reusable FilterBars, Grids & NotificationBells
│   │   ├── contexts/          # AuthContext & SocketContext
│   │   └── services/          # Centralized Authorized Axios Instance

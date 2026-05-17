# ⚡ GigFlow – Smart Leads Dashboard

A production-ready **MERN Stack (MongoDB, Express, React, Node.js)** CRM dashboard built with **TypeScript** and **Clean Architecture** principles. Manage your sales pipeline with intelligent filtering, real-time analytics, and role-based access control.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────────┐  │
│  │  Pages   │ │Components│ │  Hooks  │ │   Context   │  │
│  │(Screens) │ │ (Atomic) │ │(Custom) │ │ (Auth/State)│  │
│  └────┬─────┘ └──────────┘ └────┬────┘ └──────┬──────┘  │
│       └─────────────┬───────────┘              │         │
│                ┌────▼────┐                     │         │
│                │ Services│◄────────────────────┘         │
│                └────┬────┘                               │
└─────────────────────┼───────────────────────────────────┘
                      │ REST API (HTTP/JSON)
┌─────────────────────┼───────────────────────────────────┐
│                     │     Backend (Express)              │
│  ┌──────────────────▼──────────────────────┐            │
│  │         Interface Layer                  │            │
│  │  Routes → Middleware → Controllers       │            │
│  └──────────────────┬──────────────────────┘            │
│  ┌──────────────────▼──────────────────────┐            │
│  │         Application Layer                │            │
│  │  Use Cases ← Validation (Zod)           │            │
│  └──────────────────┬──────────────────────┘            │
│  ┌──────────────────▼──────────────────────┐            │
│  │         Domain Layer                     │            │
│  │  Entities ← Repository Interfaces       │            │
│  └──────────────────┬──────────────────────┘            │
│  ┌──────────────────▼──────────────────────┐            │
│  │         Infrastructure Layer             │            │
│  │  MongoDB Models ← Repository Impl       │            │
│  └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, React Query, React Router |
| **Backend**  | Express.js, TypeScript, Mongoose, Zod |
| **Database** | MongoDB 7                           |
| **Auth**     | JWT (jsonwebtoken), bcryptjs        |
| **Docs**     | Swagger UI (swagger-jsdoc)          |
| **DevOps**   | Docker, docker-compose, Nginx       |
| **Design**   | Atomic Design (Atoms → Molecules → Organisms) |

---

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication with bcrypt password hashing (12 rounds)
- ✅ Role-Based Access Control (RBAC): **Admin** and **Sales User**
- ✅ Protected routes with automatic token refresh
- ✅ Auth Context API for session management

### Lead Management (CRUD)
- ✅ Create, Read, Update, Delete leads
- ✅ Multi-filter dynamic query engine (Status, Source)
- ✅ Regex-powered search across name, email, company
- ✅ Debounced search hook (500ms delay) for API optimization
- ✅ Server-side pagination: `SkipCount = (PageNumber - 1) × Limit`

### Data Export
- ✅ Streaming CSV export using `fast-csv` for large datasets
- ✅ Export with active filters applied

### Analytics Dashboard
- ✅ Real-time statistics (Total Leads, Pipeline Value, Conversion Rate)
- ✅ Status and Source distribution breakdown

### Developer Experience
- ✅ Interactive Swagger documentation at `/api-docs`
- ✅ Zod request validation with detailed error messages
- ✅ Shared TypeScript types across frontend and backend
- ✅ React Query for data caching, loading, and error states

---

## 🛠️ Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd ServiceHive

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example server/.env

# Edit with your values
# MONGODB_URI=mongodb://localhost:27017/gigflow
# JWT_SECRET=your-secret-key
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- **Admin user**: `admin@gigflow.com` / `admin123`
- **Sales user**: `sarah@gigflow.com` / `sales123`
- **15 sample leads** across all statuses and sources

### 4. Start Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:5000
- 📖 **Swagger Docs**: http://localhost:5000/api-docs

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **Frontend (Nginx)**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

Health checks ensure MongoDB is ready before the backend starts, and the backend is healthy before the frontend becomes available.

---

## 📁 Project Structure

```
ServiceHive/
├── shared/
│   └── types/                    # Shared TypeScript types
│       ├── auth.types.ts         # User, JWT, RBAC types
│       ├── lead.types.ts         # Lead entity types
│       ├── api.types.ts          # API response types
│       └── index.ts
├── server/
│   ├── src/
│   │   ├── domain/               # 🏛️ Domain Layer
│   │   │   ├── entities/         #    Business entities
│   │   │   └── repositories/     #    Repository interfaces
│   │   ├── application/          # 📋 Application Layer
│   │   │   ├── usecases/         #    Business logic
│   │   │   └── validation/       #    Zod schemas
│   │   ├── infrastructure/       # 🔧 Infrastructure Layer
│   │   │   ├── database/         #    MongoDB models & repos
│   │   │   └── swagger/          #    OpenAPI config
│   │   ├── interface/            # 🌐 Interface Layer
│   │   │   ├── controllers/      #    Route handlers
│   │   │   ├── middleware/       #    Auth, RBAC, validation
│   │   │   └── routes/          #    Express routes
│   │   └── index.ts             #    Entry point
│   ├── Dockerfile
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/            # 🔵 Button, Badge, Input, Card
│   │   │   ├── molecules/        # 🟢 StatCard, FilterBar, Pagination
│   │   │   └── organisms/        # 🔴 LeadTable, LeadForm, Navbar
│   │   ├── context/              #    AuthContext
│   │   ├── hooks/                #    useDebounce
│   │   ├── pages/                #    LoginPage, DashboardPage
│   │   └── services/             #    API service layer
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint         | Description       | Auth |
|--------|-----------------|-------------------|------|
| POST   | `/api/auth/register` | Register user   | ❌    |
| POST   | `/api/auth/login`    | Login user      | ❌    |
| GET    | `/api/auth/me`       | Get profile     | ✅    |

### Leads
| Method | Endpoint           | Description         | Auth | Role    |
|--------|--------------------|---------------------|------|---------|
| GET    | `/api/leads`       | List leads (filtered)| ✅   | Any     |
| GET    | `/api/leads/stats` | Get statistics      | ✅    | Any     |
| GET    | `/api/leads/export`| Export CSV           | ✅    | Any     |
| GET    | `/api/leads/:id`   | Get lead by ID      | ✅    | Any     |
| POST   | `/api/leads`       | Create lead          | ✅    | Any     |
| PUT    | `/api/leads/:id`   | Update lead          | ✅    | Any     |
| DELETE | `/api/leads/:id`   | Delete lead          | ✅    | Admin   |

---

## 🎨 Design System

The frontend follows **Atomic Design** principles:

- **Atoms**: Button, Badge, Input, Select, Card
- **Molecules**: StatCard, FilterBar, Pagination  
- **Organisms**: Navbar, LeadTable, LeadForm

Color palette uses a custom dark theme with indigo primary accents and emerald accent colors.

---

## 📄 License

MIT License © 2026 GigFlow Team

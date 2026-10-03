# VayuGuard - Environmental Monitoring Platform

VayuGuard is an environmental monitoring and air-quality analysis platform providing real-time air quality tracking, pollutant analytics, station telemetry summary metrics, and health advisories.

---

## 🏗️ Architecture & Monorepo Structure

```text
VayuGuard/
├── frontend/             # React + Vite JavaScript Dashboard UI
│   ├── src/
│   │   ├── components/   # Modular UI components (AQICard, PollutantCard, Charts, etc.)
│   │   ├── pages/        # Login, Register, Dashboard pages
│   │   ├── context/      # AuthContext JWT session management
│   │   ├── services/     # Centralized API client (api.js)
│   │   ├── utils/        # AQI category calculation and formatting utilities
│   │   ├── App.jsx       # React Router setup & ErrorBoundary
│   │   ├── App.css       # Environmental dark SaaS styling
│   │   └── main.jsx
├── backend/              # Node.js + Express REST API with Prisma ORM & PostgreSQL
│   ├── src/
│   │   ├── controllers/  # Auth and Air Quality request handlers
│   │   ├── services/     # Business logic & Prisma ORM queries
│   │   ├── routes/       # Express routes definition
│   │   ├── middleware/   # JWT auth middleware
│   │   └── index.js
├── ml-service/           # Python + FastAPI ML analytics microservice
├── database/             # PostgreSQL Schema & Initialization Scripts
├── tests/                # System & Integration Regression Tests
├── docker-compose.yml    # Container orchestration configuration
└── README.md             # Project documentation
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, Recharts, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing
- **ML Service**: Python 3.10, FastAPI, Uvicorn

---

## 🌐 Services & Default Ports

| Service | Technology | Base URL / Port | Health Check Endpoint |
|---|---|---|---|
| **Frontend** | React + Vite | `http://localhost:5173` | N/A |
| **Backend API** | Node.js + Express | `http://localhost:5000` | `GET /api/health` |
| **ML Microservice** | Python + FastAPI | `http://localhost:8001` | `GET /health` |
| **Database** | PostgreSQL | `localhost:5433` | Native TCP Check |

---

## 🔑 Authentication Flow & JWT Storage

1. **User Registration / Login**:
   - `POST /api/auth/register` or `POST /api/auth/login` returns a JWT token and user profile.
2. **Token Storage**:
   - Stored in browser `localStorage` under key `vayuguard_token`.
3. **Session Verification**:
   - On app startup, `AuthContext` executes `GET /api/auth/me` with `Authorization: Bearer <token>`.
   - If valid, user session is restored; if invalid or expired, storage is cleared and user is redirected to `/login`.
4. **Security Note**:
   - Development mode stores JWT in `localStorage`. Production deployments should evaluate secure `HttpOnly` cookies depending on deployment architecture.

---

## 🚀 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vayuguard_db?schema=public
ML_SERVICE_URL=http://localhost:8001
JWT_SECRET=super_secret_vayuguard_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=24h
```

---

## ⚡ Available Frontend Routes

- `/login` — User Authentication Login Page
- `/register` — User Account Registration Page
- `/dashboard` — Protected Environmental Monitoring SaaS Dashboard

---

## 🔌 Available Backend APIs

### Authentication APIs
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Authenticate user and obtain JWT token
- `GET /api/auth/me` — Protected endpoint to fetch current user profile

### System Health API
- `GET /api/health` — Returns system status and database connection state

### Air Quality APIs
- `GET /api/air-quality/current?location=` — Get latest air quality reading
- `GET /api/air-quality/history?location=&limit=` — Get historical readings list
- `GET /api/air-quality/summary?location=` — Get aggregate statistics (Avg, Min, Max AQI, Avg PM2.5, Avg PM10, Count)
- `GET /api/air-quality/:id` — Get specific reading by ID
- `POST /api/air-quality` — Create a new reading *(Requires `Authorization: Bearer <token>`)*

---

## 📊 Dashboard Features

- **Location Switcher**: Filter readings across stations (New Delhi, New York, Los Angeles, Tokyo, London).
- **AQI Overview Card**: Displays current AQI value, category badge, location, and relative update time.
- **Pollutant Breakdown**: Displays PM2.5, PM10, CO, NO₂, SO₂, O₃ measurements with visual percentage indicators.
- **Environmental Information**: Displays Temperature, Humidity, Coordinates (Lat/Lng), Location, and Timestamps.
- **Station Statistics**: Aggregates Average AQI, Minimum AQI, Maximum AQI, Average PM2.5, Average PM10, and total readings count.
- **Interactive Telemetry Charts**: Recharts Line Chart for AQI history trends and Bar Chart for pollutant comparisons.
- **Auto-Refresh Polling**: Automatically refreshes station telemetry every 5 minutes (`REFRESH_INTERVAL`).
- **Profile View**: View authenticated user profile details (Name, Email, Role, Creation Date).
- **Responsive Layout**: Desktop, tablet, and mobile collapsible drawer navigation.

---

## 🧪 Testing & Verification Commands

### Run System Health Tests
```bash
node tests/health.test.js
```

### Run Authentication Tests
```bash
node tests/auth.test.js
```

### Run Air Quality Integration Tests
```bash
node tests/airQuality.test.js
```

---

## 📌 Project Status

- **Phase 1** — Complete (Monorepo, Database Schema, Health API, Docker setup)
- **Phase 2** — Complete (Authentication APIs, Password Hashing, JWT Middleware)
- **Phase 3** — Complete (Air Quality Telemetry APIs, Aggregates, Database Persistence)
- **Phase 4** — Complete (Complete React Frontend Dashboard, Recharts, Location Selector, Profile, Auto-Refresh)

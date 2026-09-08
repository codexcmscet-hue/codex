# CodeX Club — College Coding Club Management System

A production-ready, secure, and modern full-stack web application for college coding club management built with **Next.js 15**, **Express.js**, **MongoDB**, **PostgreSQL**, **AWS S3**, **Argon2id**, and **Recharts**.

---

## 🌟 Key Architecture Highlights

1. **Three-Tier Logical Database Isolation**:
   - **Auth Database (PostgreSQL - `auth` schema)**: Isolated credentials, Argon2id password hashes, sessions, reset tokens, and security metadata.
   - **Application Database (MongoDB)**: Member/volunteer profiles, squads, activities, credit scores (0–10), and events.
   - **Content Database (PostgreSQL - `content` schema)**: Official blogs, member project blogs, tags, and sanitized rich content.

2. **Role-Based Access Control (RBAC)**:
   - `ADMIN`: Full authority over members, volunteers, squads, events, credit scores, audit logs, and PDF reports.
   - `VOLUNTEER`: Manages assigned members, evaluates 0–10 credit scores, coordinates events, and publishes mini-blogs.
   - `MEMBER`: Personal dashboard, solo & squad analytics, squad creation, event participation, and project blogs.

3. **Storage & Media**:
   - AWS S3 / MinIO presigned URL integration for event photos and generated PDF reports.

4. **Security & Cryptography**:
   - **Argon2id** password hashing with 64MB memory cost, 3 iterations, 4 parallelism threads.
   - Brute-force account lockout (5 failed attempts → 15-minute freeze).
   - HttpOnly, Secure, SameSite cookies with JWT refresh token rotation.
   - DOMPurify content sanitization to eliminate Stored XSS.
   - Strict 0–10 integer credit score enforcement with audit trail history.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Docker & Docker Compose**: For MongoDB, PostgreSQL, and MinIO

### 2. Environment Setup
Clone repository and copy the environment template:
```bash
cp .env.example .env
```

### 3. Start Local Databases & Services
Launch MongoDB, PostgreSQL, MinIO (S3), and MailHog:
```bash
docker compose up -d
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Initialize Database & Seed Data
```bash
# Apply migrations & seed rich test data
npm run seed
```

This creates:
- **Admin**: `admin` / `CodexClub@2026` (Login at `/admin/login`)
- **Volunteer**: `sarah_tech` / `CodexClub@2026` (Login at `/login`)
- **Member**: `dev_surya` / `CodexClub@2026` (Login at `/login`)

### 6. Start Development Servers
```bash
# Starts Express API (port 5000) and Next.js (port 3000)
npm run dev
```

Visit:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`
- **MinIO Console**: `http://localhost:9001` (`minioadmin` / `minioadmin`)
- **MailHog Email Inbox**: `http://localhost:8025`

---

## 🛠️ CLI Utilities

### Create Initial Administrator
```bash
npm run create-admin
```
Interactive terminal prompt validating username, email, and strong password.

### Run Automated Tests
```bash
npm run test
```

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/            # DB, S3, Email, Logger
│   │   ├── controllers/       # Route handlers
│   │   ├── database/          # Migrations (init.sql)
│   │   ├── middleware/        # Auth, RBAC, Rate Limiting, Error Handling
│   │   ├── models/            # Mongoose MongoDB schemas
│   │   ├── repositories/      # PostgreSQL repositories
│   │   ├── routes/            # Express routers
│   │   ├── scripts/           # createAdmin, seed scripts
│   │   ├── services/          # Core business logic & PDF generation
│   │   └── utils/             # Argon2id, JWT, Crypto
│   └── tests/                 # Vitest test suite
├── frontend/
│   └── src/
│       ├── app/               # Next.js 15 App Router pages & layouts
│       ├── components/        # Glassmorphic UI components & charts
│       └── lib/               # Axios API client, Auth Context
├── shared/                    # Shared TypeScript types, Zod schemas, RBAC matrix
├── docker-compose.yml         # Dev environment stack
└── .env.example
```


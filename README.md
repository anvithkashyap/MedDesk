# MedDesk - Medical Front Desk Management System

A comprehensive medical front desk management system built with Next.js and NestJS.

## 🏥 Features

- **Dashboard**: Real-time overview of appointments and queue statistics
- **Queue Management**: Patient queue with priority levels and status tracking
- **Appointment Scheduling**: Complete appointment management system
- **Doctor Management**: CRUD operations for medical staff
- **User Management**: Admin system for managing front desk users
- **Role-Based Access**: Admin, Receptionist, and Nurse roles
- **Real-time Updates**: Live data synchronization across all modules

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **React Query** - Data fetching and caching
- **Sonner** - Toast notifications

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **bcryptjs** - Password hashing

## 🚀 Local Development & Production

### Frontend (Next.js)
- Development: `http://localhost:3000`
- Production: `http://localhost:3000`

### Backend (NestJS)
- Development: `http://localhost:3001`
- Production: `http://localhost:3001`
- Database: Local MySQL

## 👥 Default Users

- **Admin**: `admin@meddesk.com` / `admin123`
- **Receptionist**: `receptionist@meddesk.com` / `receptionist123`

## 📝 Quick Start Guide

### Prerequisites
- **Node.js** 18+ installed
- **MySQL** 8.0+ installed and running
- **npm** package manager

### 🚀 Setup & Run (3 Steps)

#### 1. Database Setup
```sql
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE meddesk_db;
```

#### 2. Start Backend Server
```bash
cd backend
npm install
npx ts-node -r tsconfig-paths/register src/main.ts
```
**Backend runs on:** `http://localhost:3001`

#### 3. Start Frontend Server (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
**Frontend runs on:** `http://localhost:3000`

### 🎯 Access Application
- **Web App**: http://localhost:3000
- **API Docs**: http://localhost:3001/api (Swagger)
- **Health Check**: http://localhost:3001/api/health

## 🔐 Environment Variables

See `.env.example` files in both frontend and backend directories.

## 🛠️ Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `brew services start mysql` (macOS)
- Check credentials in `/backend/.env`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Backend (3001): `lsof -ti:3001 | xargs kill -9`
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`

## 📁 Project Structure

```
MedDesk/
├── backend/              # NestJS API server
│   ├── src/             # Source code
│   ├── .env.example     # Environment template
│   └── package.json     # Dependencies
├── frontend/            # Next.js web application
│   ├── app/             # App router pages
│   ├── components/      # UI components
│   └── lib/             # Utilities & services
├── README.md            # This file
└── LOCALHOST_SETUP.md   # Detailed setup guide
```

## 📄 License

This project is for educational and personal use.

# 🏠 MedDesk Localhost Setup Guide

Complete guide to run MedDesk as a local application on your machine.

## 📋 Prerequisites

- **Node.js** 18+ installed
- **MySQL** 8.0+ installed and running
- **npm** or **yarn** package manager

## 🔧 Database Setup

### 1. Create MySQL Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database and user
CREATE DATABASE meddesk_db;
CREATE USER 'meddesk_user'@'localhost' IDENTIFIED BY 'meddesk_password';
GRANT ALL PRIVILEGES ON meddesk_db.* TO 'meddesk_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Update Database Password
Edit `/backend/.env` and set your MySQL root password:
```
DB_PASSWORD=your-actual-mysql-root-password
```

## 🚀 Running the Application

### Terminal 1: Backend (API Server)
```bash
cd backend
npm install
npm run start:dev
```
Backend will run on: `http://localhost:3001`

### Terminal 2: Frontend (Web App)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:3000`

## 🎯 Access the Application

- **Web App**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api (Swagger)
- **Health Check**: http://localhost:3001/api/health

## 👥 Default Login Credentials

- **Admin**: `admin@meddesk.com` / `admin123`
- **Receptionist**: `receptionist@meddesk.com` / `receptionist123`

## 📁 Project Structure

```
MedDesk-v2.0/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
├── README.md         # Project overview
└── LOCALHOST_SETUP.md # This setup guide
```

## 🔧 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running: `brew services start mysql` (macOS)
2. Check credentials in `/backend/.env`
3. Verify database exists: `SHOW DATABASES;`

### Port Conflicts
- Backend (3001): Change `PORT` in `/backend/.env`
- Frontend (3000): Change port with `npm run dev -- -p 3002`

### Module Not Found Errors
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎉 You're All Set!

Your MedDesk application is now running locally with full functionality:
- ✅ Dashboard with real-time statistics
- ✅ Queue management system
- ✅ Appointment scheduling
- ✅ Doctor management
- ✅ Admin user management
- ✅ Role-based access control

Enjoy your local MedDesk system! 🏥

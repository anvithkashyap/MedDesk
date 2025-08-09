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

## 🚀 Deployment

### Frontend (Vercel)
- Deployed at: `https://meddesk.anvithkashyap.com`
- Environment: `NEXT_PUBLIC_API_URL`

### Backend (Render)
- API endpoint: Production URL
- Database: AWS RDS MySQL

## 👥 Default Users

- **Admin**: `admin@meddesk.com` / `admin123`
- **Receptionist**: `receptionist@meddesk.com` / `receptionist123`

## 📝 Local Development

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run database migrations
5. Start development servers

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run start:dev
```

## 🔐 Environment Variables

See `.env.example` files in both frontend and backend directories.

## 📄 License

This project is for educational and personal use.

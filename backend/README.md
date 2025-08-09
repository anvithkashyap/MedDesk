# MedDesk Backend API

A comprehensive NestJS backend for the MedDesk front desk management system with MySQL database, JWT authentication, and TypeORM.

## Features

- **JWT Authentication** - Secure login and authorization
- **Role-based Access Control** - Admin, Receptionist, and Nurse roles
- **Doctor Management** - Complete CRUD operations for doctors
- **Appointment Scheduling** - Advanced appointment management with conflict detection
- **Queue Management** - Real-time patient queue with priority handling
- **User Management** - Staff user management with role assignments
- **API Documentation** - Swagger/OpenAPI documentation
- **Database Migrations** - TypeORM migrations for schema management

## Tech Stack

- **NestJS** - Node.js framework for scalable server-side applications
- **TypeORM** - Object-Relational Mapping for MySQL
- **MySQL** - Primary database
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **Swagger** - API documentation
- **bcryptjs** - Password hashing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Make sure MySQL is running on your system, then run:

```bash
# Create database and user
mysql -u root -p < database/setup.sql
```

Update the password in `database/setup.sql` before running.

### 3. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the database password in `.env` to match what you set in the setup script.

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Seed Initial Data

```bash
npm run ts-node src/database/seed-runner.ts
```

This creates:
- Admin user: `admin@meddesk.com` / `admin123`
- Receptionist: `receptionist@meddesk.com` / `receptionist123`
- Sample doctors with different specialties

### 6. Start the Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api/docs`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor
- `GET /api/doctors/:id` - Get doctor by ID
- `PATCH /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Queue
- `GET /api/queue` - Get queue items
- `POST /api/queue` - Add patient to queue
- `GET /api/queue/waiting` - Get waiting queue
- `POST /api/queue/call-next/:doctorId` - Call next patient
- `PATCH /api/queue/:id/complete` - Mark as completed
- `GET /api/queue/stats` - Get queue statistics

## Database Schema

### Users
- Authentication and staff management
- Roles: Admin, Receptionist, Nurse

### Doctors
- Doctor profiles with specialties
- Working hours and consultation fees
- Specialties: General Practice, Cardiology, Pediatrics, etc.

### Appointments
- Patient appointment scheduling
- Status tracking: Scheduled, Confirmed, In Progress, Completed
- Conflict detection and validation

### Queue Items
- Real-time patient queue management
- Priority levels: Low, Normal, High, Urgent
- Wait time tracking and statistics

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=meddesk_user
DB_PASSWORD=your_password
DB_DATABASE=meddesk_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build the application
npm run start:prod         # Start production server

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## Default Users

After seeding, you can login with:

**Admin User:**
- Email: `admin@meddesk.com`
- Password: `admin123`

**Receptionist:**
- Email: `receptionist@meddesk.com`
- Password: `receptionist123`

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- CORS protection
- SQL injection prevention with TypeORM

## Development

### Adding New Entities

1. Create entity in `src/[module]/entities/`
2. Create DTOs in `src/[module]/dto/`
3. Create service in `src/[module]/[module].service.ts`
4. Create controller in `src/[module]/[module].controller.ts`
5. Create module in `src/[module]/[module].module.ts`
6. Add to `app.module.ts`

### Database Migrations

```bash
# Generate migration after entity changes
npm run migration:generate src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure secure database credentials
4. Enable SSL/TLS
5. Set up proper logging
6. Configure reverse proxy (nginx)
7. Set up monitoring and health checks

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages

## License

MIT License

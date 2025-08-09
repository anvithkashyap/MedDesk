#!/bin/bash

echo "🏥 MedDesk Backend Setup Script"
echo "================================"

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed or not in PATH"
    echo "Please install MySQL first:"
    echo "  - macOS: brew install mysql"
    echo "  - Ubuntu: sudo apt install mysql-server"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Setting up MySQL database..."
echo "Please enter your MySQL root password when prompted:"
mysql -u root -p < database/setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
else
    echo "❌ Database setup failed. Please check your MySQL credentials."
    exit 1
fi

echo "🌱 Seeding initial data..."
npm run ts-node src/database/seed-runner.ts

echo "🚀 Starting the development server..."
echo "Backend will be available at: http://localhost:3001"
echo "API Documentation: http://localhost:3001/api/docs"
echo ""
echo "Default login credentials:"
echo "Admin: admin@meddesk.com / admin123"
echo "Receptionist: receptionist@meddesk.com / receptionist123"
echo ""

npm run start:dev

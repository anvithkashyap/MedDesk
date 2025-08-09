-- MedDesk Database Setup Script
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS meddesk_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_password_here' with a secure password)
CREATE USER IF NOT EXISTS 'meddesk_user'@'localhost' IDENTIFIED BY 'admin123';

-- Grant privileges
GRANT ALL PRIVILEGES ON meddesk_db.* TO 'meddesk_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the database
USE meddesk_db;

-- Show confirmation
SELECT 'MedDesk database setup completed successfully!' as message;

-- Initialization script for PostgreSQL
-- This script will run when the database is first created

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- Create custom types (if needed)
CREATE TYPE difficulty_level AS ENUM ('beginner', 'elementary', 'intermediate', 'advanced');
CREATE TYPE game_type AS ENUM ('flashcards', 'quiz', 'listening', 'typing', 'matching', 'speed');

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE topik_learning_db TO topik_user;

-- Set timezone
SET timezone = 'Asia/Ho_Chi_Minh';

-- Create indexes for better performance (will be created after tables via Prisma)
-- This is just a placeholder for custom initialization

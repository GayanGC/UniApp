-- =====================================================
-- Uni App - PostgreSQL Database Schema
-- User Management & Authentication Tables
-- =====================================================

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User Role Enum
CREATE TYPE user_role AS ENUM ('admin', 'student', 'prospective', 'boarding_provider');

-- =====================================================
-- TABLES
-- =====================================================

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'prospective',
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    university VARCHAR(255),
    faculty VARCHAR(255),
    academic_year VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- Boarding Posts Table
CREATE TABLE boarding_posts (
    post_id SERIAL PRIMARY KEY,
    provider_user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    location_details VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_boarding_provider FOREIGN KEY (provider_user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- Past Papers Table
CREATE TABLE past_papers (
    paper_id SERIAL PRIMARY KEY,
    university VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    academic_year INTEGER NOT NULL,
    exam_year INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by_user_id INTEGER NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_past_paper_uploader FOREIGN KEY (uploaded_by_user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- Campuses Table (Static data for main universities)
CREATE TABLE campuses (
    campus_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campus POIs Table (Points of Interest around campuses)
CREATE TABLE campus_pois (
    poi_id SERIAL PRIMARY KEY,
    campus_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campus_poi FOREIGN KEY (campus_id) 
        REFERENCES campuses(campus_id) 
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index on email for faster lookups during login
CREATE INDEX idx_users_email ON users(email);

-- Index on role for role-based queries
CREATE INDEX idx_users_role ON users(role);

-- Index on is_active for filtering active users
CREATE INDEX idx_users_is_active ON users(is_active);

-- Index on user_id in students table
CREATE INDEX idx_students_user_id ON students(user_id);

-- Index on provider_user_id in boarding_posts table
CREATE INDEX idx_boarding_posts_provider_user_id ON boarding_posts(provider_user_id);

-- Index on is_available for filtering available posts
CREATE INDEX idx_boarding_posts_is_available ON boarding_posts(is_available);

-- Index on uploaded_by_user_id in past_papers table
CREATE INDEX idx_past_papers_uploaded_by_user_id ON past_papers(uploaded_by_user_id);

-- Index on university for filtering past papers
CREATE INDEX idx_past_papers_university ON past_papers(university);

-- Index on faculty for filtering past papers
CREATE INDEX idx_past_papers_faculty ON past_papers(faculty);

-- Index on is_approved for filtering approved papers
CREATE INDEX idx_past_papers_is_approved ON past_papers(is_approved);

-- Composite index for common filter combinations
CREATE INDEX idx_past_papers_search ON past_papers(university, faculty, academic_year, is_approved);

-- Index on campus name for lookups
CREATE INDEX idx_campuses_name ON campuses(name);

-- Index on campus_id in campus_pois table
CREATE INDEX idx_campus_pois_campus_id ON campus_pois(campus_id);

-- Index on category for filtering POIs by type
CREATE INDEX idx_campus_pois_category ON campus_pois(category);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for students table
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for boarding_posts table
CREATE TRIGGER update_boarding_posts_updated_at 
    BEFORE UPDATE ON boarding_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for past_papers table
CREATE TRIGGER update_past_papers_updated_at 
    BEFORE UPDATE ON past_papers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for campuses table
CREATE TRIGGER update_campuses_updated_at 
    BEFORE UPDATE ON campuses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for campus_pois table
CREATE TRIGGER update_campus_pois_updated_at 
    BEFORE UPDATE ON campus_pois 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert a default admin user (password: Admin@123)
-- Password hash generated using bcrypt with salt rounds = 10
INSERT INTO users (email, password_hash, role, full_name, is_active) 
VALUES (
    'admin@uniapp.com',
    '$2b$10$YourHashedPasswordHere',
    'admin',
    'System Administrator',
    true
);

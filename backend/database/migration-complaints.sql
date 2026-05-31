-- Migration: Create complaints table for Confidential Complaints System
CREATE TABLE complaints (
    complaint_id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    university VARCHAR(100) NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_by_user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    submission_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    admin_notes TEXT
);
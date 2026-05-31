-- Migration: Create study_notes table for Notes Sharing Platform
CREATE TABLE study_notes (
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    university VARCHAR(100),
    faculty VARCHAR(100),
    subject_code VARCHAR(50),
    academic_year INT,
    uploaded_by_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT NOW()
);
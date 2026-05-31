-- Migration: Create notifications table for Events and Notification System
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'General', 'University-Specific', 'Faculty-Specific'
    target_university VARCHAR(100),
    target_faculty VARCHAR(100),
    target_year INT,
    is_event BOOLEAN NOT NULL DEFAULT FALSE,
    event_date TIMESTAMP,
    posted_by_user_id INT NOT NULL REFERENCES users(user_id),
    posted_at TIMESTAMP NOT NULL DEFAULT NOW()
);
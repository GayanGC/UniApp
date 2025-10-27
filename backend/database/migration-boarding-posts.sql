-- =====================================================
-- Uni App - Boarding Posts Migration
-- Version: 1.1.0
-- Date: 2024-10-27
-- Description: Adds boarding_posts table with indexes and triggers
-- =====================================================

BEGIN;

-- Create boarding_posts table
CREATE TABLE IF NOT EXISTS boarding_posts (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_boarding_posts_provider_user_id 
    ON boarding_posts(provider_user_id);

CREATE INDEX IF NOT EXISTS idx_boarding_posts_is_available 
    ON boarding_posts(is_available);

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_boarding_posts_updated_at ON boarding_posts;
CREATE TRIGGER update_boarding_posts_updated_at 
    BEFORE UPDATE ON boarding_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify migration
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'boarding_posts') THEN
        RAISE NOTICE '✓ Migration completed successfully!';
        RAISE NOTICE '✓ Table boarding_posts created';
        RAISE NOTICE '✓ Indexes created';
        RAISE NOTICE '✓ Triggers created';
    ELSE
        RAISE EXCEPTION '✗ Migration failed - boarding_posts table not created';
    END IF;
END $$;

COMMIT;

-- Display table information
SELECT 
    'boarding_posts' AS table_name,
    COUNT(*) AS row_count
FROM boarding_posts;

-- Display indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'boarding_posts'
ORDER BY indexname;

-- =====================================================
-- Uni App - Campus Guide Migration
-- Version: 1.3.0
-- Date: 2024-10-27
-- Description: Adds campuses and campus_pois tables for location data
-- =====================================================

BEGIN;

-- Create campuses table
CREATE TABLE IF NOT EXISTS campuses (
    campus_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create campus_pois table
CREATE TABLE IF NOT EXISTS campus_pois (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campuses_name 
    ON campuses(name);

CREATE INDEX IF NOT EXISTS idx_campus_pois_campus_id 
    ON campus_pois(campus_id);

CREATE INDEX IF NOT EXISTS idx_campus_pois_category 
    ON campus_pois(category);

-- Create triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_campuses_updated_at ON campuses;
CREATE TRIGGER update_campuses_updated_at 
    BEFORE UPDATE ON campuses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campus_pois_updated_at ON campus_pois;
CREATE TRIGGER update_campus_pois_updated_at 
    BEFORE UPDATE ON campus_pois 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify migration
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'campuses') 
       AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'campus_pois') THEN
        RAISE NOTICE '✓ Migration completed successfully!';
        RAISE NOTICE '✓ Tables campuses and campus_pois created';
        RAISE NOTICE '✓ Indexes created';
        RAISE NOTICE '✓ Triggers created';
    ELSE
        RAISE EXCEPTION '✗ Migration failed - tables not created';
    END IF;
END $$;

COMMIT;

-- Display table information
SELECT 
    'campuses' AS table_name,
    COUNT(*) AS row_count
FROM campuses
UNION ALL
SELECT 
    'campus_pois' AS table_name,
    COUNT(*) AS row_count
FROM campus_pois;

-- Display indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('campuses', 'campus_pois')
ORDER BY tablename, indexname;

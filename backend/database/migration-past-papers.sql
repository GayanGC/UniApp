-- =====================================================
-- Uni App - Past Papers Migration
-- Version: 1.2.0
-- Date: 2024-10-27
-- Description: Adds past_papers table for examination paper repository
-- =====================================================

BEGIN;

-- Create past_papers table
CREATE TABLE IF NOT EXISTS past_papers (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_past_papers_uploaded_by_user_id 
    ON past_papers(uploaded_by_user_id);

CREATE INDEX IF NOT EXISTS idx_past_papers_university 
    ON past_papers(university);

CREATE INDEX IF NOT EXISTS idx_past_papers_faculty 
    ON past_papers(faculty);

CREATE INDEX IF NOT EXISTS idx_past_papers_is_approved 
    ON past_papers(is_approved);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_past_papers_search 
    ON past_papers(university, faculty, academic_year, is_approved);

-- Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS update_past_papers_updated_at ON past_papers;
CREATE TRIGGER update_past_papers_updated_at 
    BEFORE UPDATE ON past_papers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify migration
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'past_papers') THEN
        RAISE NOTICE '✓ Migration completed successfully!';
        RAISE NOTICE '✓ Table past_papers created';
        RAISE NOTICE '✓ Indexes created';
        RAISE NOTICE '✓ Triggers created';
    ELSE
        RAISE EXCEPTION '✗ Migration failed - past_papers table not created';
    END IF;
END $$;

COMMIT;

-- Display table information
SELECT 
    'past_papers' AS table_name,
    COUNT(*) AS row_count
FROM past_papers;

-- Display indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'past_papers'
ORDER BY indexname;

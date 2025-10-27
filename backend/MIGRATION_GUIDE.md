# 🔄 Migration Guide - Adding New Features

This guide helps you migrate your existing Uni App database to support the new Student Profile and Boarding Posts features.

---

## 📋 Overview

**New Features:**
1. Student Profile Management Module
2. Boarding Posts Management Module

**Database Changes:**
- New table: `boarding_posts`
- New indexes for performance
- New trigger for automatic timestamps

---

## 🚀 Quick Migration (Recommended)

### Option 1: Fresh Database Setup

If you're starting fresh or can recreate the database:

```bash
# Drop existing database (WARNING: This deletes all data!)
psql -U postgres -c "DROP DATABASE IF EXISTS uni_app_db;"

# Create new database
psql -U postgres -c "CREATE DATABASE uni_app_db;"

# Apply complete schema
psql -U postgres -d uni_app_db -f database/schema.sql
```

### Option 2: Add Only New Table (Existing Database)

If you have existing data and want to keep it:

```bash
# Apply migration SQL
psql -U postgres -d uni_app_db -f database/migration-boarding-posts.sql
```

---

## 📝 Manual Migration Steps

### Step 1: Backup Your Database

**Always backup before making changes!**

```bash
# Create backup
pg_dump -U postgres uni_app_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Or with Docker
docker-compose exec postgres pg_dump -U postgres uni_app_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Create Migration SQL File

Create `database/migration-boarding-posts.sql`:

```sql
-- =====================================================
-- Migration: Add Boarding Posts Table
-- Date: 2024-10-27
-- Description: Adds boarding_posts table with indexes and triggers
-- =====================================================

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_boarding_posts_provider_user_id 
    ON boarding_posts(provider_user_id);

CREATE INDEX IF NOT EXISTS idx_boarding_posts_is_available 
    ON boarding_posts(is_available);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_boarding_posts_updated_at 
    BEFORE UPDATE ON boarding_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify migration
SELECT 'Migration completed successfully!' AS status;
```

### Step 3: Apply Migration

```bash
# Apply migration
psql -U postgres -d uni_app_db -f database/migration-boarding-posts.sql

# Or with Docker
docker-compose exec -T postgres psql -U postgres -d uni_app_db < database/migration-boarding-posts.sql
```

### Step 4: Verify Migration

```bash
# Connect to database
psql -U postgres -d uni_app_db

# Verify table exists
\dt boarding_posts

# Verify indexes
\di idx_boarding_posts*

# Verify triggers
SELECT tgname FROM pg_trigger WHERE tgrelid = 'boarding_posts'::regclass;

# Exit
\q
```

---

## 🐳 Docker Migration

### Using Docker Compose

```bash
# Stop services
docker-compose down

# Backup database
docker-compose up -d postgres
docker-compose exec postgres pg_dump -U postgres uni_app_db > backup.sql

# Apply migration
docker-compose exec -T postgres psql -U postgres -d uni_app_db < database/migration-boarding-posts.sql

# Restart all services
docker-compose down
docker-compose up -d
```

---

## ✅ Verification Checklist

After migration, verify everything works:

### Database Verification

```sql
-- Check table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'boarding_posts'
);

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'boarding_posts';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'boarding_posts';

-- Check foreign key
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'boarding_posts' 
    AND tc.constraint_type = 'FOREIGN KEY';
```

### Application Verification

```bash
# Restart application
npm run start:dev

# Check logs for errors
# Should see: "Nest application successfully started"
```

### API Verification

```bash
# Test student profile endpoint
curl -X GET http://localhost:3000/api/v1/students/profile \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"

# Test boarding posts endpoint
curl -X GET http://localhost:3000/api/v1/boarding \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Rollback Procedure

If something goes wrong, you can rollback:

### Option 1: Restore from Backup

```bash
# Drop database
psql -U postgres -c "DROP DATABASE uni_app_db;"

# Create database
psql -U postgres -c "CREATE DATABASE uni_app_db;"

# Restore backup
psql -U postgres -d uni_app_db < backup_YYYYMMDD_HHMMSS.sql
```

### Option 2: Remove Only New Table

```sql
-- Drop table and related objects
DROP TABLE IF EXISTS boarding_posts CASCADE;
```

---

## 📊 Migration SQL Script

Save this as `database/migration-boarding-posts.sql`:

```sql
-- =====================================================
-- Uni App - Boarding Posts Migration
-- Version: 1.1.0
-- Date: 2024-10-27
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_boarding_posts_provider_user_id 
    ON boarding_posts(provider_user_id);

CREATE INDEX IF NOT EXISTS idx_boarding_posts_is_available 
    ON boarding_posts(is_available);

-- Create trigger
DROP TRIGGER IF EXISTS update_boarding_posts_updated_at ON boarding_posts;
CREATE TRIGGER update_boarding_posts_updated_at 
    BEFORE UPDATE ON boarding_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify migration
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'boarding_posts') THEN
        RAISE NOTICE 'Migration completed successfully!';
    ELSE
        RAISE EXCEPTION 'Migration failed - boarding_posts table not created';
    END IF;
END $$;

COMMIT;
```

---

## 🎯 Post-Migration Tasks

### 1. Update Application Code

The application code is already updated with:
- ✅ StudentsModule
- ✅ BoardingModule
- ✅ New endpoints
- ✅ TypeORM entities
- ✅ Guards and validation

### 2. Restart Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Docker
docker-compose restart backend
```

### 3. Test New Features

Use the test file: `requests-new-features.http`

```bash
# Or use curl
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "Provider@123",
    "fullName": "Test Provider",
    "role": "boarding_provider"
  }'
```

---

## 🐛 Troubleshooting

### Issue: Table Already Exists

```
ERROR: relation "boarding_posts" already exists
```

**Solution:**
```sql
-- Check if table exists
SELECT * FROM boarding_posts LIMIT 1;

-- If it exists and is correct, migration is already done
-- If it exists but is incorrect, drop and recreate:
DROP TABLE boarding_posts CASCADE;
-- Then run migration again
```

### Issue: Foreign Key Constraint Fails

```
ERROR: insert or update on table "boarding_posts" violates foreign key constraint
```

**Solution:**
Ensure the `users` table exists and has the correct structure:
```sql
SELECT * FROM users LIMIT 1;
```

### Issue: Function Does Not Exist

```
ERROR: function update_updated_at_column() does not exist
```

**Solution:**
Run the complete schema file which includes the function:
```bash
psql -U postgres -d uni_app_db -f database/schema.sql
```

### Issue: Permission Denied

```
ERROR: permission denied for table boarding_posts
```

**Solution:**
Grant permissions:
```sql
GRANT ALL PRIVILEGES ON TABLE boarding_posts TO postgres;
GRANT USAGE, SELECT ON SEQUENCE boarding_posts_post_id_seq TO postgres;
```

---

## 📈 Performance Optimization

After migration, consider:

### 1. Analyze Tables

```sql
ANALYZE boarding_posts;
ANALYZE students;
ANALYZE users;
```

### 2. Vacuum Database

```sql
VACUUM ANALYZE;
```

### 3. Check Index Usage

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'boarding_posts';
```

---

## ✅ Migration Checklist

- [ ] Backup existing database
- [ ] Create migration SQL file
- [ ] Test migration on development environment
- [ ] Apply migration to production
- [ ] Verify table creation
- [ ] Verify indexes creation
- [ ] Verify triggers creation
- [ ] Verify foreign keys
- [ ] Restart application
- [ ] Test new endpoints
- [ ] Monitor application logs
- [ ] Run performance analysis
- [ ] Update documentation
- [ ] Notify team members

---

## 📞 Support

If you encounter issues:

1. Check application logs: `npm run start:dev`
2. Check database logs: `docker-compose logs postgres`
3. Verify schema: `\d boarding_posts` in psql
4. Review error messages carefully
5. Restore from backup if needed

---

**Migration Complete! 🎉**

Your database now supports Student Profile Management and Boarding Posts features.

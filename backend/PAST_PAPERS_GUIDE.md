# 📚 Past Papers Repository - Complete Guide

## 🎯 Overview

The Past Papers Repository is a secure file management system that allows administrators to upload, manage, and distribute examination papers to students. The system includes:

- **PDF File Upload** - Admin-only upload with metadata
- **Approval System** - Papers require approval before being visible
- **Advanced Filtering** - Search by university, faculty, year, etc.
- **Secure Download** - Protected file serving
- **Role-Based Access** - Admin upload, all authenticated users can view

---

## 📦 Features Implemented

### ✅ 1. Database Schema

**Table:** `past_papers`

```sql
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
```

**Indexes:**
- `idx_past_papers_uploaded_by_user_id` - For filtering by uploader
- `idx_past_papers_university` - For university filtering
- `idx_past_papers_faculty` - For faculty filtering
- `idx_past_papers_is_approved` - For approved papers
- `idx_past_papers_search` - Composite index for common searches

### ✅ 2. File Upload System

**Technology:** Multer with disk storage

**Configuration:**
- **Upload Directory:** `./uploads/past-papers`
- **File Type:** PDF only
- **Max File Size:** 10MB
- **Filename Format:** `paper-{timestamp}-{random}.pdf`

### ✅ 3. API Endpoints

#### Admin Upload (Protected - Admin Only)
```http
POST /api/v1/past-papers/upload
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Form Data:
- file: (PDF file)
- university: "Stanford University"
- faculty: "Computer Science"
- subjectName: "Data Structures"
- academicYear: 2
- examYear: 2023
```

#### Get All Approved Papers (Protected - All Users)
```http
GET /api/v1/past-papers?university=Stanford&faculty=CS&academicYear=2
Authorization: Bearer {token}
```

#### Download Paper (Protected - All Users)
```http
GET /api/v1/past-papers/download/:paperId
Authorization: Bearer {token}
```

#### Approve Paper (Protected - Admin Only)
```http
POST /api/v1/past-papers/:id/approve
Authorization: Bearer {admin_token}
```

#### Delete Paper (Protected - Admin Only)
```http
DELETE /api/v1/past-papers/:id
Authorization: Bearer {admin_token}
```

---

## 🚀 Quick Start

### 1. Apply Database Migration

```bash
# Apply migration
psql -U postgres -d uni_app_db -f database/migration-past-papers.sql

# Or with Docker
docker-compose exec -T postgres psql -U postgres -d uni_app_db < database/migration-past-papers.sql
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

The following packages are added:
- `multer` - File upload handling
- `@types/multer` - TypeScript types

### 3. Create Upload Directory

The directory is created automatically, but you can create it manually:

```bash
mkdir -p uploads/past-papers
```

### 4. Restart Application

```bash
npm run start:dev
```

---

## 🧪 Testing the API

### Test 1: Upload a Past Paper (Admin)

```bash
# 1. Login as admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uniapp.com",
    "password": "Admin@123"
  }'

# Save the token from response

# 2. Upload a PDF
curl -X POST http://localhost:3000/api/v1/past-papers/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/exam.pdf" \
  -F "university=Stanford University" \
  -F "faculty=Computer Science" \
  -F "subjectName=Data Structures" \
  -F "academicYear=2" \
  -F "examYear=2023"
```

### Test 2: Approve the Paper (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/past-papers/1/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test 3: Search for Papers (Any User)

```bash
# Login as student
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Student@123"
  }'

# Search papers
curl -X GET "http://localhost:3000/api/v1/past-papers?university=Stanford&faculty=Computer%20Science&academicYear=2" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Test 4: Download a Paper (Any User)

```bash
curl -X GET http://localhost:3000/api/v1/past-papers/download/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output downloaded_paper.pdf
```

---

## 📝 Request/Response Examples

### Upload Response

```json
{
  "message": "Past paper uploaded successfully",
  "data": {
    "paperId": 1,
    "university": "Stanford University",
    "faculty": "Computer Science",
    "subjectName": "Data Structures",
    "academicYear": 2,
    "examYear": 2023,
    "filePath": "uploads/past-papers/paper-1698765432123-987654321.pdf",
    "uploadedByUserId": 1,
    "isApproved": false,
    "createdAt": "2024-10-27T10:30:00.000Z",
    "updatedAt": "2024-10-27T10:30:00.000Z"
  }
}
```

### Search Response

```json
{
  "message": "Past papers retrieved successfully",
  "count": 2,
  "data": [
    {
      "paperId": 1,
      "university": "Stanford University",
      "faculty": "Computer Science",
      "subjectName": "Data Structures",
      "academicYear": 2,
      "examYear": 2023,
      "filePath": "uploads/past-papers/paper-1698765432123-987654321.pdf",
      "uploadedByUserId": 1,
      "isApproved": true,
      "createdAt": "2024-10-27T10:30:00.000Z",
      "updatedAt": "2024-10-27T10:35:00.000Z"
    }
  ]
}
```

---

## 🔐 Security Features

### Role-Based Access Control

| Endpoint | Admin | Student | Provider | Prospective |
|----------|-------|---------|----------|-------------|
| Upload | ✅ | ❌ | ❌ | ❌ |
| Approve | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| Search | ✅ | ✅ | ✅ | ✅ |
| Download | ✅ | ✅ | ✅ | ✅ |

### File Upload Security

- ✅ **File Type Validation** - Only PDF files allowed
- ✅ **File Size Limit** - Maximum 10MB
- ✅ **Unique Filenames** - Prevents overwrites
- ✅ **Secure Storage** - Files stored outside web root
- ✅ **Access Control** - Authentication required for download

### Approval System

- Papers are **not approved** by default (`is_approved = false`)
- Only **approved papers** are visible in search results
- Only **admins** can approve papers
- Prevents unauthorized content from being distributed

---

## 🎯 Query Parameters

### Filter Past Papers

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `university` | string | Filter by university name | `?university=Stanford` |
| `faculty` | string | Filter by faculty name | `?faculty=Computer%20Science` |
| `subjectName` | string | Search in subject name | `?subjectName=Data` |
| `academicYear` | integer | Filter by academic year | `?academicYear=2` |
| `examYear` | integer | Filter by exam year | `?examYear=2023` |

**Multiple Filters:**
```
GET /api/v1/past-papers?university=Stanford&faculty=CS&academicYear=2&examYear=2023
```

---

## 📊 File Structure

```
backend/
├── src/
│   ├── modules/
│   │   └── past-papers/
│   │       ├── entities/
│   │       │   ├── past-paper.entity.ts
│   │       │   └── index.ts
│   │       ├── dto/
│   │       │   ├── upload-past-paper.dto.ts
│   │       │   ├── filter-past-papers.dto.ts
│   │       │   └── index.ts
│   │       ├── past-papers.service.ts
│   │       ├── past-papers.controller.ts
│   │       └── past-papers.module.ts
│   └── config/
│       └── multer.config.ts
├── uploads/
│   └── past-papers/              # PDF files stored here
│       └── paper-*.pdf
└── database/
    └── migration-past-papers.sql
```

---

## 🛠️ Configuration

### Multer Configuration

**File:** `src/config/multer.config.ts`

```typescript
export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/past-papers',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `paper-${uniqueSuffix}.pdf`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};
```

### Customization Options

**Change Upload Directory:**
```typescript
const uploadDir = './uploads/past-papers'; // Change this
```

**Change File Size Limit:**
```typescript
limits: {
  fileSize: 20 * 1024 * 1024, // 20MB
}
```

**Allow Multiple File Types:**
```typescript
fileFilter: (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Invalid file type'), false);
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Only PDF files are allowed"

**Cause:** Trying to upload non-PDF file

**Solution:** Only upload PDF files

### Issue: "File too large"

**Cause:** File exceeds 10MB limit

**Solution:** 
- Compress the PDF
- Or increase limit in `multer.config.ts`

### Issue: "File not found on server"

**Cause:** File was deleted from filesystem

**Solution:** 
- Re-upload the paper
- Check `uploads/past-papers` directory exists

### Issue: "Forbidden resource"

**Cause:** Non-admin trying to upload

**Solution:** Login with admin credentials

### Issue: "No papers found"

**Cause:** Papers not approved yet

**Solution:** Admin must approve papers first

---

## 📈 Statistics Endpoint

Get statistics about past papers:

```bash
curl -X GET http://localhost:3000/api/v1/past-papers/stats/summary \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 10,
    "approved": 8,
    "pending": 2
  }
}
```

---

## 🔄 Workflow

### Admin Workflow

1. **Login** as admin
2. **Upload** PDF with metadata
3. **Review** uploaded papers
4. **Approve** papers for students
5. **Monitor** statistics

### Student Workflow

1. **Login** as student
2. **Search** for papers by university/faculty/year
3. **View** approved papers list
4. **Download** needed papers

---

## ✅ Validation Rules

### Upload DTO

- **university:** Required, max 255 characters
- **faculty:** Required, max 255 characters
- **subjectName:** Required, max 255 characters
- **academicYear:** Required, integer, 1-10
- **examYear:** Required, integer, 1900-2100
- **file:** Required, PDF only, max 10MB

### Filter DTO

- **university:** Optional, string
- **faculty:** Optional, string
- **subjectName:** Optional, string
- **academicYear:** Optional, integer, min 1
- **examYear:** Optional, integer, min 1900

---

## 🎯 Best Practices

### For Admins

1. **Verify PDFs** before uploading
2. **Use consistent naming** for universities/faculties
3. **Approve promptly** after review
4. **Monitor storage** space regularly
5. **Delete outdated** papers

### For Developers

1. **Backup uploads** directory regularly
2. **Monitor file sizes** and storage
3. **Implement cleanup** for old files
4. **Add logging** for uploads/downloads
5. **Consider CDN** for large scale

---

## 🚀 Future Enhancements

Potential improvements:

1. **Cloud Storage** - AWS S3, Google Cloud Storage
2. **OCR** - Extract text from PDFs
3. **Preview** - PDF preview in browser
4. **Batch Upload** - Upload multiple files
5. **Categories** - Additional categorization
6. **Tags** - Flexible tagging system
7. **Ratings** - Student feedback on papers
8. **Analytics** - Download statistics
9. **Notifications** - Alert students of new papers
10. **Versioning** - Multiple versions of same paper

---

**Past Papers Repository is production-ready! 📚**

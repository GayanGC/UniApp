# ⚡ Quick Reference - Past Papers API

## 🚀 Quick Start

```bash
# 1. Apply migration
psql -U postgres -d uni_app_db -f database/migration-past-papers.sql

# 2. Install dependencies
npm install

# 3. Start server
npm run start:dev
```

---

## 📡 API Endpoints

### Upload Paper (Admin Only)
```bash
POST /api/v1/past-papers/upload
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

# Form fields:
- file: (PDF file, max 10MB)
- university: "Stanford University"
- faculty: "Computer Science"
- subjectName: "Data Structures"
- academicYear: 2
- examYear: 2023
```

### Search Papers (All Users)
```bash
GET /api/v1/past-papers?university=Stanford&faculty=CS&academicYear=2
Authorization: Bearer {token}
```

### Download Paper (All Users)
```bash
GET /api/v1/past-papers/download/:paperId
Authorization: Bearer {token}
```

### Approve Paper (Admin Only)
```bash
POST /api/v1/past-papers/:id/approve
Authorization: Bearer {admin_token}
```

### Delete Paper (Admin Only)
```bash
DELETE /api/v1/past-papers/:id
Authorization: Bearer {admin_token}
```

---

## 🧪 cURL Examples

### Upload
```bash
curl -X POST http://localhost:3000/api/v1/past-papers/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@exam.pdf" \
  -F "university=Stanford" \
  -F "faculty=CS" \
  -F "subjectName=Algorithms" \
  -F "academicYear=2" \
  -F "examYear=2023"
```

### Search
```bash
curl -X GET "http://localhost:3000/api/v1/past-papers?university=Stanford&academicYear=2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Download
```bash
curl -X GET http://localhost:3000/api/v1/past-papers/download/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output paper.pdf
```

### Approve
```bash
curl -X POST http://localhost:3000/api/v1/past-papers/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔑 Query Parameters

| Parameter | Type | Example |
|-----------|------|---------|
| `university` | string | `?university=Stanford` |
| `faculty` | string | `?faculty=Computer%20Science` |
| `subjectName` | string | `?subjectName=Data` |
| `academicYear` | integer | `?academicYear=2` |
| `examYear` | integer | `?examYear=2023` |

**Multiple filters:**
```
?university=Stanford&faculty=CS&academicYear=2&examYear=2023
```

---

## 🔐 Access Control

| Endpoint | Admin | Student | Provider | Prospective |
|----------|-------|---------|----------|-------------|
| Upload | ✅ | ❌ | ❌ | ❌ |
| Approve | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| Search | ✅ | ✅ | ✅ | ✅ |
| Download | ✅ | ✅ | ✅ | ✅ |

---

## 📝 Validation Rules

### Upload
- **file:** Required, PDF only, max 10MB
- **university:** Required, max 255 chars
- **faculty:** Required, max 255 chars
- **subjectName:** Required, max 255 chars
- **academicYear:** Required, integer 1-10
- **examYear:** Required, integer 1900-2100

### Filter
- All parameters optional
- Case-insensitive matching
- Partial text search for subject

---

## 💾 Database Schema

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
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

---

## 📊 Response Examples

### Upload Success
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
    "filePath": "uploads/past-papers/paper-1234567890-123456789.pdf",
    "isApproved": false,
    "createdAt": "2024-10-27T10:30:00.000Z"
  }
}
```

### Search Results
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
      "isApproved": true
    }
  ]
}
```

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Only PDF files are allowed` | Wrong file type | Upload PDF only |
| `File too large` | File > 10MB | Compress or split file |
| `Forbidden resource` | Wrong role | Login as admin |
| `File not found on server` | File deleted | Re-upload paper |
| `Past paper not found` | Invalid ID | Check paper ID |

---

## 🛠️ Configuration

**File Upload:**
- Location: `./uploads/past-papers`
- Max Size: 10MB
- Allowed: PDF only
- Naming: `paper-{timestamp}-{random}.pdf`

**Approval:**
- Default: `is_approved = false`
- Only approved papers visible in search
- Admin-only approval

---

## 📁 File Structure

```
backend/
├── src/modules/past-papers/
│   ├── entities/
│   │   └── past-paper.entity.ts
│   ├── dto/
│   │   ├── upload-past-paper.dto.ts
│   │   └── filter-past-papers.dto.ts
│   ├── past-papers.service.ts
│   ├── past-papers.controller.ts
│   └── past-papers.module.ts
├── uploads/past-papers/
│   └── paper-*.pdf
└── database/
    └── migration-past-papers.sql
```

---

## 🔄 Workflow

### Admin Workflow
1. Login as admin
2. Upload PDF with metadata
3. Approve uploaded papers
4. Monitor statistics

### Student Workflow
1. Login as student
2. Search for papers
3. Download needed papers

---

## 📈 Statistics

```bash
GET /api/v1/past-papers/stats/summary
Authorization: Bearer {admin_token}

Response:
{
  "data": {
    "total": 10,
    "approved": 8,
    "pending": 2
  }
}
```

---

## 🐛 Troubleshooting

**Upload fails:**
- Check file is PDF
- Check file size < 10MB
- Verify admin token
- Check uploads directory exists

**No papers found:**
- Papers must be approved first
- Check filter parameters
- Verify papers exist in database

**Download fails:**
- Check file exists on disk
- Verify paper ID is correct
- Check authentication token

---

## 📚 Documentation

- **Full Guide:** `PAST_PAPERS_GUIDE.md`
- **Summary:** `PAST_PAPERS_COMPLETE.md`
- **Migration:** `database/migration-past-papers.sql`

---

**Quick Reference for Past Papers API** 📚

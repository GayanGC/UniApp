# ⚡ Campus Guide API - Quick Reference

## 🚀 Quick Start

```bash
# Apply migration
psql -U postgres -d uni_app_db -f database/migration-campus-guide.sql

# Restart server
npm run start:dev
```

---

## 📡 API Endpoints

### Admin Endpoints (Protected)

**Create Campus:**
```bash
POST /api/v1/campus-guide/campus
Authorization: Bearer {admin_token}

{
  "name": "Stanford University",
  "latitude": 37.4275,
  "longitude": -122.1697,
  "address": "450 Serra Mall, Stanford, CA 94305"
}
```

**Create POI:**
```bash
POST /api/v1/campus-guide/poi
Authorization: Bearer {admin_token}

{
  "campusId": 1,
  "name": "Campus Cafe",
  "description": "Student cafeteria",
  "latitude": 37.4280,
  "longitude": -122.1700,
  "category": "Restaurant"
}
```

**Delete Campus:**
```bash
DELETE /api/v1/campus-guide/campus/:id
Authorization: Bearer {admin_token}
```

**Delete POI:**
```bash
DELETE /api/v1/campus-guide/poi/:id
Authorization: Bearer {admin_token}
```

---

### Public Endpoints (No Auth Required)

**Get All Campuses:**
```bash
GET /api/v1/campus-guide/all
```

**Get Campuses with POIs:**
```bash
GET /api/v1/campus-guide/all-with-pois
```

**Get Single Campus:**
```bash
GET /api/v1/campus-guide/campus/:id
```

**Get POIs by Campus:**
```bash
GET /api/v1/campus-guide/pois/:campusId
```

**Get POIs by Category:**
```bash
GET /api/v1/campus-guide/pois/category/:category
```

---

## 🧪 cURL Examples

### Create Campus
```bash
curl -X POST http://localhost:3000/api/v1/campus-guide/campus \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Stanford University",
    "latitude": 37.4275,
    "longitude": -122.1697,
    "address": "450 Serra Mall, Stanford, CA 94305"
  }'
```

### Create POI
```bash
curl -X POST http://localhost:3000/api/v1/campus-guide/poi \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campusId": 1,
    "name": "Campus Cafe",
    "description": "Student cafeteria",
    "latitude": 37.4280,
    "longitude": -122.1700,
    "category": "Restaurant"
  }'
```

### Get All Campuses (Public)
```bash
curl http://localhost:3000/api/v1/campus-guide/all
```

### Get POIs for Campus (Public)
```bash
curl http://localhost:3000/api/v1/campus-guide/pois/1
```

---

## 📝 POI Categories

Common categories:
- `Restaurant`
- `Bookshop`
- `ATM`
- `Boarding`
- `Library`
- `Gym`
- `Parking`
- `Medical`
- `Sports`
- (Custom categories allowed)

---

## 🔐 Access Control

| Endpoint | Access Level |
|----------|-------------|
| Create Campus | Admin Only |
| Create POI | Admin Only |
| Delete Campus | Admin Only |
| Delete POI | Admin Only |
| Get Campuses | **Public** |
| Get POIs | **Public** |

---

## 💾 Database Schema

### Campuses Table
```sql
campus_id    SERIAL PRIMARY KEY
name         VARCHAR(255) UNIQUE
latitude     DECIMAL(10, 8)
longitude    DECIMAL(11, 8)
address      VARCHAR(500)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### Campus POIs Table
```sql
poi_id       SERIAL PRIMARY KEY
campus_id    INTEGER (FK)
name         VARCHAR(255)
description  VARCHAR(500)
latitude     DECIMAL(10, 8)
longitude    DECIMAL(11, 8)
category     VARCHAR(100)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

---

## 📊 Response Examples

### Get All Campuses
```json
{
  "message": "Campuses retrieved successfully",
  "count": 1,
  "data": [
    {
      "campusId": 1,
      "name": "Stanford University",
      "latitude": 37.4275,
      "longitude": -122.1697,
      "address": "450 Serra Mall, Stanford, CA 94305",
      "createdAt": "2024-10-27T10:00:00.000Z"
    }
  ]
}
```

### Get POIs
```json
{
  "message": "POIs retrieved successfully",
  "count": 2,
  "data": [
    {
      "poiId": 1,
      "campusId": 1,
      "name": "Campus Cafe",
      "description": "Student cafeteria",
      "latitude": 37.4280,
      "longitude": -122.1700,
      "category": "Restaurant"
    }
  ]
}
```

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Campus with this name already exists` | Duplicate name | Use unique campus name |
| `Campus not found` | Invalid campus ID | Check campus ID exists |
| `Forbidden resource` | Not admin | Login as admin |
| `Unauthorized` | No token | Provide JWT token |

---

## 🗺️ Coordinate Format

**Latitude:** -90 to 90 (DECIMAL 10,8)  
**Longitude:** -180 to 180 (DECIMAL 11,8)

**Examples:**
- Stanford: 37.4275, -122.1697
- MIT: 42.3601, -71.0942
- Oxford: 51.7548, -1.2544

---

## 🎯 Workflow

### Admin Workflow
```
1. Login as admin
2. POST /campus-guide/campus (add university)
3. POST /campus-guide/poi (add POIs)
4. Manage data as needed
```

### Public/Student Workflow
```
1. GET /campus-guide/all (no auth needed)
2. GET /campus-guide/pois/:campusId
3. Display on map
4. Browse POIs
```

---

**Quick Reference for Campus Guide API** 🗺️

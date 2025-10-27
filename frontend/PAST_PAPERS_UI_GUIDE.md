# 📚 Past Papers UI - Quick Guide

## 🚀 Quick Start

### Access the Page

1. **Login as Student**
   ```
   URL: http://localhost:3001/login
   Email: student@test.com
   Password: Student@123
   ```

2. **Navigate to Past Papers**
   - From dashboard, click "Past Papers" card
   - Or go directly to: `http://localhost:3001/student/past-papers`

---

## 🔍 Using Filters

### Apply Filters

1. Enter filter values:
   - **University:** e.g., "Stanford University"
   - **Faculty:** e.g., "Computer Science"
   - **Subject:** e.g., "Data Structures"
   - **Academic Year:** Select from dropdown (Year 1-10)
   - **Exam Year:** Select from dropdown (recent years)

2. Click **"Apply Filters"** button

3. URL updates with query parameters:
   ```
   /student/past-papers?university=Stanford&faculty=CS&academicYear=2
   ```

4. Filtered results display

### Clear Filters

- Click **"Clear All"** button
- Or click the "X Clear All" link in filter header
- All filters reset and URL returns to base

### Share Filtered Results

- Copy URL from browser
- Share with other students
- They'll see the same filtered results

---

## 📥 Downloading Papers

### Download a Paper

1. Find the paper you want
2. Click the **"Download"** button
3. Button shows "Loading..." during download
4. File downloads automatically with descriptive name

### Downloaded Filename Format

```
{University}_{Faculty}_{Subject}_{ExamYear}.pdf

Example:
Stanford_University_Computer_Science_Data_Structures_2023.pdf
```

### Download Errors

If download fails:
- Check your internet connection
- Verify you're still logged in
- Try again
- Error message will display if there's an issue

---

## 🎨 UI Elements

### Filter Component

```
┌─────────────────────────────────────────┐
│ 🔍 Filter Papers          X Clear All   │
├─────────────────────────────────────────┤
│ University    Faculty      Subject      │
│ [________]    [________]   [________]   │
│                                         │
│ Academic Year  Exam Year                │
│ [Year 1 ▼]    [2024 ▼]                 │
│                                         │
│ [Apply Filters]  [Clear]                │
└─────────────────────────────────────────┘
```

### Paper Card

```
┌─────────────────────────────────────────┐
│ Data Structures                         │
│                                         │
│ 🎓 University: Stanford University      │
│ 📚 Faculty: Computer Science            │
│ 📅 Academic Year: Year 2                │
│ 📅 Exam Year: 2023                      │
│                              [Download] │
└─────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────┐
│              📄                         │
│                                         │
│      No Past Papers Found               │
│                                         │
│  We couldn't find any past papers       │
│  matching your criteria.                │
│                                         │
│  Try adjusting your filters or check    │
│  back later for new uploads.            │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Mobile View
- Single column layout
- Stacked filters
- Full-width cards
- Touch-friendly buttons

### Tablet View
- 2-column filter grid
- Optimized spacing
- Readable card layout

### Desktop View
- 3-column filter grid
- Maximum information density
- Hover effects

---

## 🔐 Access Control

### Who Can Access?

✅ **Students** - Full access  
❌ **Providers** - No access  
❌ **Prospective** - No access  
❌ **Admin** - No access (separate admin interface)

### What Happens if Unauthorized?

- Redirected to `/unauthorized` page
- Or redirected to `/login` if not authenticated

---

## 💡 Tips & Tricks

### Efficient Searching

1. **Start Broad** - Begin with just university
2. **Narrow Down** - Add faculty if too many results
3. **Specific Search** - Add subject for exact papers
4. **Year Filter** - Use academic/exam year for recent papers

### Bookmarking

- Bookmark filtered URLs for quick access
- Example: Bookmark all Year 2 CS papers
  ```
  /student/past-papers?faculty=Computer%20Science&academicYear=2
  ```

### Keyboard Navigation

- Tab through filter fields
- Enter to apply filters
- Escape to clear (if implemented)

---

## 🐛 Troubleshooting

### No Papers Showing

**Possible Causes:**
- No papers match your filters
- Papers not yet approved by admin
- Network connection issue

**Solutions:**
- Try broader filters
- Clear all filters
- Check internet connection
- Refresh the page

### Download Not Working

**Possible Causes:**
- Session expired
- Network issue
- File not found on server

**Solutions:**
- Login again
- Check internet connection
- Try different paper
- Contact support

### Filters Not Applying

**Possible Causes:**
- JavaScript error
- Browser cache issue

**Solutions:**
- Refresh the page
- Clear browser cache
- Try different browser

### Page Won't Load

**Possible Causes:**
- Not logged in
- Wrong user role
- Backend not running

**Solutions:**
- Login as student
- Check user role
- Verify backend is running

---

## 🎯 Common Use Cases

### Find Papers for Current Course

```
1. Select your academic year (e.g., Year 2)
2. Enter your faculty (e.g., Engineering)
3. Enter subject (e.g., Thermodynamics)
4. Click Apply Filters
5. Download relevant papers
```

### Browse All Available Papers

```
1. Go to /student/past-papers
2. Don't apply any filters
3. Scroll through all approved papers
4. Download as needed
```

### Find Recent Exam Papers

```
1. Select current exam year (e.g., 2024)
2. Optionally add faculty
3. Click Apply Filters
4. View most recent papers
```

### Search by University

```
1. Enter university name
2. Leave other filters empty
3. Click Apply Filters
4. Browse all papers from that university
```

---

## 📊 Understanding the Data

### What Papers Are Shown?

- ✅ Only **approved** papers
- ✅ All universities and faculties
- ✅ All academic and exam years
- ❌ Unapproved papers (hidden)

### Paper Information

Each paper shows:
- **Subject Name** - Course/module name
- **University** - Institution name
- **Faculty** - Department/faculty
- **Academic Year** - Year level (1-10)
- **Exam Year** - Year the exam was held

### Sorting

Papers are sorted by:
1. Exam Year (newest first)
2. Creation Date (newest first)

---

## ✅ Best Practices

### For Students

1. **Use Specific Filters** - Get exactly what you need
2. **Download Early** - Don't wait until exam time
3. **Organize Downloads** - Create folders by subject
4. **Share Links** - Help classmates with filtered URLs
5. **Report Issues** - Contact admin if papers are wrong

### For Studying

1. **Start with Recent** - Use latest exam year
2. **Practice Multiple** - Download several papers
3. **Check Syllabus** - Ensure papers match current syllabus
4. **Time Yourself** - Practice under exam conditions
5. **Review Answers** - If available

---

## 🔄 Workflow Example

### Typical Student Workflow

```
1. Login to Uni App
   ↓
2. Go to Student Dashboard
   ↓
3. Click "Past Papers"
   ↓
4. Enter filters:
   - University: My University
   - Faculty: My Faculty
   - Academic Year: My Year
   ↓
5. Click "Apply Filters"
   ↓
6. Browse results
   ↓
7. Download needed papers
   ↓
8. Study and prepare!
```

---

## 📞 Support

### Need Help?

- **Technical Issues:** Contact IT support
- **Missing Papers:** Contact admin
- **Access Problems:** Check with registrar
- **Download Issues:** Try different browser

### Feedback

- Report bugs to development team
- Suggest improvements
- Request specific papers from admin

---

## 🎓 Quick Reference

### URLs

- **Main Page:** `/student/past-papers`
- **With Filters:** `/student/past-papers?university=X&faculty=Y`
- **Dashboard:** `/student/dashboard`

### Keyboard Shortcuts

- **Tab:** Navigate between fields
- **Enter:** Apply filters (when in filter field)
- **Ctrl/Cmd + Click:** Open in new tab

### Filter Options

- **University:** Free text
- **Faculty:** Free text
- **Subject:** Free text
- **Academic Year:** 1-10
- **Exam Year:** Last 10 years

---

**Happy Studying! 📚**

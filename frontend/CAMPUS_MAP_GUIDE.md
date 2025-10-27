# 🗺️ Campus Map - Quick Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Google Maps API Key

Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your API key:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Start Server
```bash
npm run dev
```

### 4. Access Map
```
http://localhost:3001/campus-guide/map
```

---

## 🔑 Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Maps JavaScript API**
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key
6. (Optional) Restrict key to your domain

---

## 🗺️ Map Features

### Campus Markers
- **Icon:** Blue circle with school icon
- **Action:** Click to view details
- **Info:** Campus name, address, POIs

### POI Markers
- **Icon:** Colored circle with map pin
- **Colors:** Category-based
- **Appear:** When campus is selected

### Info Window
- **Trigger:** Click campus marker
- **Shows:** Campus details and POI list
- **Close:** Click X or click elsewhere

---

## 🎨 POI Categories & Colors

| Category | Color | Hex |
|----------|-------|-----|
| 🔴 Restaurant | Red | #EF4444 |
| 🔵 Bookshop | Blue | #3B82F6 |
| 🟢 ATM | Green | #10B981 |
| 🟠 Boarding | Orange | #F59E0B |
| 🟣 Library | Purple | #8B5CF6 |
| 🌸 Gym | Pink | #EC4899 |
| ⚫ Other | Gray | #6B7280 |

---

## 📍 Default Map Settings

- **Center:** Sri Lanka (7.8731° N, 80.7718° E)
- **Zoom:** 8 (country view)
- **Map Type:** Roadmap
- **Controls:** Enabled

---

## 🎯 User Workflow

### View Campuses
```
1. Open /campus-guide/map
2. Map loads with all campus markers
3. Pan and zoom to explore
```

### View POIs
```
1. Click any campus marker
2. Info Window opens
3. POIs load automatically
4. POI markers appear on map
5. Browse POI list
```

### Close Info Window
```
1. Click X button
2. Or click elsewhere on map
3. POI markers disappear
```

---

## 🔧 Customization

### Change Default Center
```typescript
// In page.tsx
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 };
```

### Change Default Zoom
```typescript
const DEFAULT_ZOOM = 8; // 1-20
```

### Add POI Category
```typescript
const POI_COLORS: Record<string, string> = {
  NewCategory: '#HEXCOLOR',
};
```

---

## 🐛 Troubleshooting

### Map Not Loading

**Error:** "Google Maps API Key not configured"

**Fix:**
- Add API key to `.env.local`
- Restart dev server
- Check key is valid

### No Markers Appearing

**Issue:** Blank map

**Fix:**
- Check backend is running
- Verify campuses exist in database
- Check browser console for errors

### POIs Not Loading

**Issue:** No POIs when clicking campus

**Fix:**
- Verify POIs exist for campus
- Check network tab for API errors
- Ensure backend endpoint works

---

## 📱 Responsive Behavior

### Desktop
- Full map view
- Legend bottom-left
- Campus count top-right

### Mobile
- Touch-friendly markers
- Compact legend
- Gesture controls
- Responsive info window

---

## 🔐 Access Control

- ✅ **Public Access** - No login required
- ✅ **No Authentication** - Perfect for prospective students
- ✅ **Shareable** - Can share map URL

---

## 📊 API Endpoints Used

```
GET /api/v1/campus-guide/all
- Fetches all campuses
- Public endpoint
- No auth required

GET /api/v1/campus-guide/pois/:campusId
- Fetches POIs for campus
- Public endpoint
- No auth required
```

---

## 💡 Tips

### Performance
- POIs load only when campus clicked
- Efficient marker rendering
- Optimized re-renders

### UX
- Click campus to see POIs
- Use legend to identify categories
- Pan and zoom freely
- Close info window to clear POIs

### Development
- Check browser console for errors
- Use React DevTools for debugging
- Monitor network tab for API calls

---

## 🎨 UI Elements

### Header
- Title: "Campus Guide"
- Description: "Explore university locations"
- Back to Home link

### Legend
- Shows all marker types
- Color-coded categories
- Fixed position

### Campus Count
- Shows total campuses
- Top-right corner
- Updates dynamically

### Info Window
- Campus name
- Address
- POI list
- Loading indicator
- Close button

---

## 🔄 Data Flow

```
Page Load
  ↓
Fetch Campuses (GET /all)
  ↓
Display Campus Markers
  ↓
User Clicks Campus
  ↓
Fetch POIs (GET /pois/:id)
  ↓
Display POI Markers
  ↓
Show Info Window
```

---

## ✅ Checklist

Before deploying:
- [ ] Google Maps API key configured
- [ ] Backend running and accessible
- [ ] Campuses added to database
- [ ] POIs added for campuses
- [ ] Map loads correctly
- [ ] Markers appear
- [ ] Info window works
- [ ] POIs load on click
- [ ] Responsive on mobile
- [ ] No console errors

---

## 📚 Resources

- [Google Maps Documentation](https://developers.google.com/maps)
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Quick Reference for Campus Map** 🗺️

# React Router Setup Guide - IoT RFID Frontend

## ✅ What Has Been Done

Your IoT RFID frontend project now has **React Router v6** integrated for proper page navigation and routing.

### Files Modified/Created:

1. **`src/main.jsx`** - Updated entry point
   - Added RouterProvider and router configuration
   - Wrapped AuthProvider around RouterProvider

2. **`src/routes.jsx`** - New routing configuration
   - Centralized route definitions
   - Maps all pages to their respective routes

3. **`src/App.jsx`** - Refactored to use React Router
   - Now derives active menu from URL pathname using `useLocation()`
   - Uses `useNavigate()` for navigation
   - Removed state-based menu management

## 📍 Available Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginPage | User login page |
| `/` | Home | Dashboard with cameras and stats |
| `/residents` | ResidentsPage | Manage residents |
| `/camera` | CameraPage | Camera management |
| `/history` | HistoryPage | Access logs history |
| `/rfid` | RfidCardsPage | RFID card management |
| `/settings` | SettingsPage | Application settings |
| `/search` | SearchPage | Search functionality |
| `/profile` | ProfilePage | User profile |

## 🎯 How It Works

### Navigation Flow:
1. User clicks a menu item in the Sidebar
2. Sidebar calls `onMenuChange()` with menu name
3. `handleMenuChange()` in App.jsx converts menu to route and calls `navigate()`
4. Router updates URL and triggers route change
5. `useLocation()` detects URL change
6. `getActiveMenuFromPath()` derives active menu from new pathname
7. App re-renders with appropriate page content

### Example:
```
User clicks "Người dùng" button
  ↓
onMenuChange('resident') called
  ↓
navigate('/residents') executed
  ↓
URL changes to http://localhost:5174/residents
  ↓
useLocation() detects change
  ↓
getActiveMenuFromPath() returns 'resident'
  ↓
ResidentsPage renders in main content area
```

## 🚀 Development Server

Start the dev server:
```bash
npm run dev
```
Server runs on: `http://localhost:5174/`

## 📦 Build

Build for production:
```bash
npm run build
```
Build output: `dist/` directory

## 🔄 Navigation Methods

### From Sidebar/Header:
- Buttons call `onMenuChange()` which navigates via route

### Programmatic Navigation:
Users can also navigate directly via URL:
- `http://localhost:5174/residents`
- `http://localhost:5174/camera`
- etc.

## ✨ Key Features

✅ **URL-based Navigation** - Each page has a unique URL
✅ **Browser History** - Back/forward buttons work correctly
✅ **Deep Linking** - Can share URLs to specific pages
✅ **Route Protection** - Login check via AuthContext
✅ **Preserved Functionality** - All existing features intact
✅ **Maintained State** - API calls and data flow unchanged

## 🛠️ If You Need to Add More Routes

1. Add the page component path to `src/routes.jsx`:
```javascript
{
  path: '/new-page',
  element: <AppContent />,
}
```

2. Add the menu mapping in `src/App.jsx` `getActiveMenuFromPath()`:
```javascript
if (path.includes('new-page')) return 'newPage';
```

3. Add the route handler in `handleMenuChange()`:
```javascript
const routes = {
  // ... existing routes
  newPage: '/new-page',
};
```

4. Add Sidebar button that calls:
```javascript
onMenuChange('newPage');
```

## 📝 Notes

- The app maintains all existing functionality (cameras, dashboard, API calls)
- AuthContext is still the source of truth for authentication
- Redux/Context state management remains unchanged
- All styling and CSS are preserved

## ✓ Status

✅ Installation complete
✅ Configuration complete
✅ Build successful
✅ Development server ready
✅ All routes functional

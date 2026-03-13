# 🎨 Frontend Client - Employee Work Tracking System

## 📁 Project Structure

```
client/
├── public/                 # Static files
│   ├── index.html         # Main HTML template
│   ├── favicon.ico        # App icon
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots file
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Login.js              # Login page with authentication
│   │   ├── ManagerDashboard.js   # Manager dashboard view
│   │   ├── EmployeeDashboard.js  # Employee dashboard view
│   │   └── MapView.js            # Interactive map component
│   ├── config/            # Configuration files
│   │   └── api.js         # API base URL configuration
│   ├── App.js             # Main app component with routing
│   ├── App.css            # Global styles
│   ├── index.js           # App entry point
│   └── index.css          # Base CSS styles
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
└── .env.local            # Environment variables
```

---

## 🚀 Quick Start

### Install Dependencies
```bash
cd client
npm install
```

### Run Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

---

## 📦 Dependencies

### Core Libraries
- **react** (19.2.4) - UI library
- **react-dom** (19.2.4) - React DOM renderer
- **react-router-dom** (7.13.0) - Routing
- **react-scripts** (5.0.1) - Build tooling

### UI Framework
- **@mui/material** (7.3.7) - Material-UI components
- **@mui/icons-material** (7.3.7) - Material icons
- **@emotion/react** (11.14.0) - CSS-in-JS
- **@emotion/styled** (11.14.1) - Styled components

### Maps
- **react-leaflet** (5.0.0) - React wrapper for Leaflet
- **leaflet** (1.9.4) - Interactive maps library

### Utilities
- **axios** (1.13.4) - HTTP client
- **framer-motion** (12.33.0) - Animation library
- **react-toastify** (11.0.5) - Toast notifications

---

## 🎨 Components Overview

### 1. Login.js
**Purpose**: User authentication page

**Features**:
- Email/password input fields
- Role selection (Manager/Employee)
- Quick login buttons for demo
- Form validation
- JWT token handling
- Animated background

**Props**:
- `onLogin(userData, token)` - Callback after successful login

**State**:
- `formData` - Email, password, role
- `loading` - Loading state
- `error` - Error messages

---

### 2. ManagerDashboard.js
**Purpose**: Manager's main interface

**Features**:
- Dashboard statistics (4 stat cards)
- Live map with employee locations
- Task management interface
- Work update approvals
- Create task dialog
- Real-time data fetching

**Props**:
- `user` - Current user object
- `onLogout()` - Logout callback

**State**:
- `activeTab` - Current tab (0: Map, 1: Tasks, 2: Approvals)
- `tasks` - All tasks array
- `updates` - Work updates array
- `dashboardStats` - Statistics object
- `employees` - Employee list
- `openTaskDialog` - Dialog visibility
- `newTask` - New task form data

**API Calls**:
- `GET /api/reports/dashboard` - Dashboard stats
- `GET /api/tasks` - All tasks
- `GET /api/updates` - All updates
- `GET /api/auth/employees` - Employee list
- `POST /api/tasks` - Create task
- `PUT /api/updates/:id/status` - Approve/reject update

---

### 3. EmployeeDashboard.js
**Purpose**: Employee's main interface

**Features**:
- Personal task list
- Task status management (Start/Complete)
- Work update submission
- Update history
- Location map view
- Progress tracking

**Props**:
- `user` - Current user object
- `onLogout()` - Logout callback

**State**:
- `activeTab` - Current tab (0: Tasks, 1: Updates, 2: Location)
- `tasks` - Assigned tasks
- `myUpdates` - Personal updates
- `openUpdateDialog` - Dialog visibility
- `currentUpdateTask` - Task being updated
- `updateData` - Update form data

**API Calls**:
- `GET /api/tasks` - Assigned tasks
- `GET /api/updates/my-updates` - Personal updates
- `POST /api/updates` - Submit update
- `PUT /api/tasks/:id/status` - Update task status

---

### 4. MapView.js
**Purpose**: Interactive map with markers

**Features**:
- Leaflet map integration
- Employee location markers (green)
- Task location markers (blue)
- Geo-fence circles
- Marker popups with details
- Zoom and pan controls

**Props**:
- `employees` - Array of employee objects with locations
- `tasks` - Array of task objects with locations
- `center` - Map center coordinates [lat, lng]
- `zoom` - Initial zoom level

**Custom Icons**:
- Green marker for active employees
- Red marker for inactive employees
- Blue marker for tasks

---

## 🎨 Styling System

### Global Styles (App.css)
```css
CSS Variables:
--primary: #6366f1 (Indigo)
--primary-dark: #4f46e5
--secondary: #8b5cf6 (Purple)
--accent: #ec4899 (Pink)
--success: #10b981 (Green)
--warning: #f59e0b (Orange)
--danger: #ef4444 (Red)
--bg-primary: #f8fafc
--bg-card: #ffffff
--text-primary: #1e293b
--text-secondary: #64748b
--border-light: rgba(0, 0, 0, 0.12)
```

### Custom Classes:
- `.glass-card` - Glassmorphism effect
- `.btn-gradient` - Gradient button
- `.input-glass` - Glass input field
- `.fade-in-up` - Fade in animation

### Material-UI Theme:
- Primary color: Indigo (#6366f1)
- Secondary color: Purple (#8b5cf6)
- Border radius: 16px
- Font family: Inter, Poppins, Roboto

---

## 🔧 Configuration

### API Configuration (config/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  'http://localhost:5000';
```

### Environment Variables (.env.local)
```
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

---

## 🛣️ Routing Structure

### Routes (App.js)
```
/ → Redirect to /login or dashboard
/login → Login page
/manager → Manager dashboard (protected)
/employee → Employee dashboard (protected)
```

### Route Protection:
- Checks localStorage for token and user
- Redirects to /login if not authenticated
- Role-based redirection (manager vs employee)

---

## 📱 Responsive Design

### Breakpoints:
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 900px (small desktop)
- lg: 1200px (desktop)
- xl: 1536px (large desktop)

### Grid System:
- Uses Material-UI Grid with 12 columns
- Responsive column spans (xs, sm, md, lg, xl)
- Flexible layouts with flexbox

---

## 🎭 Animations

### Framer Motion Animations:
1. **Page Transitions**:
   - Fade in on mount
   - Slide up effect
   - Duration: 0.5s

2. **Card Animations**:
   - Staggered entrance
   - Hover scale effect
   - Smooth transitions

3. **Button Animations**:
   - Hover lift effect
   - Click scale down
   - Color transitions

4. **Background Animations**:
   - Floating particles
   - Binary number rain
   - Opacity pulsing

---

## 🔐 Authentication Flow

### Login Process:
1. User enters credentials
2. POST to `/api/auth/login`
3. Receive JWT token and user data
4. Store in localStorage
5. Redirect to appropriate dashboard

### Token Storage:
```javascript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));
```

### Protected Requests:
```javascript
headers: { 
  Authorization: `Bearer ${localStorage.getItem('token')}` 
}
```

### Logout:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
// Redirect to /login
```

---

## 🗺️ Map Integration

### Leaflet Setup:
```javascript
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
```

### Tile Provider:
- OpenStreetMap (free, no API key required)
- URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

### Custom Markers:
- SVG-based markers with custom colors
- Dynamic icon creation based on status
- Popup content with task/employee details

### Geo-fence Circles:
- Radius from task.geoFenceRadius
- Semi-transparent fill
- Blue border color

---

## 📊 State Management

### Local State (useState):
- Component-specific data
- Form inputs
- UI state (dialogs, tabs)

### Data Fetching:
- useEffect for initial load
- Axios for HTTP requests
- Manual refetch after mutations

### No Global State:
- Props passed from App.js
- Token in localStorage
- Simple architecture for demo

---

## 🎯 Key Features

### Manager Features:
✅ Dashboard with 4 stat cards  
✅ Live map with employee tracking  
✅ Task creation with geo-fencing  
✅ Task assignment to employees  
✅ Work update approval workflow  
✅ Analytics and reporting  

### Employee Features:
✅ Personal task list  
✅ Task status updates (Start/Complete)  
✅ Work update submission  
✅ Progress tracking  
✅ Location verification  
✅ Update history  

### UI/UX Features:
✅ Modern glassmorphism design  
✅ Smooth animations  
✅ Responsive layout  
✅ Toast notifications  
✅ Loading states  
✅ Error handling  
✅ Form validation  

---

## 🧪 Testing

### Run Tests:
```bash
npm test
```

### Test Files:
- `App.test.js` - Basic app rendering test

### Testing Libraries:
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

---

## 🏗️ Build Process

### Development Build:
```bash
npm start
# Runs on http://localhost:3000
# Hot reload enabled
# Source maps included
```

### Production Build:
```bash
npm run build
# Creates optimized build in /build folder
# Minified and compressed
# Ready for deployment
```

### Build Output:
```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
└── manifest.json
```

---

## 🚀 Deployment

### Static Hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables:
Set `REACT_APP_API_URL` to production API URL

### Build Command:
```bash
npm run build
```

### Serve Static Files:
```bash
npm install -g serve
serve -s build
```

---

## 🐛 Common Issues

### Issue: Map not loading
**Solution**: Check internet connection (needs OpenStreetMap tiles)

### Issue: API calls failing
**Solution**: Verify backend is running on port 5000

### Issue: Login not working
**Solution**: Check backend database is seeded with users

### Issue: Blank page
**Solution**: Check browser console for errors, clear cache

---

## 📝 Code Style

### Naming Conventions:
- Components: PascalCase (Login.js)
- Functions: camelCase (handleLogin)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- CSS classes: kebab-case (glass-card)

### File Organization:
- One component per file
- Related styles in same file or App.css
- Shared utilities in config/

---

## 🎓 Learning Resources

### React:
- https://react.dev/

### Material-UI:
- https://mui.com/

### Leaflet:
- https://leafletjs.com/
- https://react-leaflet.js.org/

### Framer Motion:
- https://www.framer.com/motion/

---

## ✅ Checklist

- [x] All components created
- [x] Routing configured
- [x] Authentication implemented
- [x] API integration complete
- [x] Maps working
- [x] Animations added
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Form validation
- [x] Protected routes

---

**🎉 Frontend is complete and ready to use!**

**Run `npm start` to launch the development server.**

# Employee Work Tracking System with Geo-Fencing

A full-stack MERN application that tracks field employees in real time using GPS-based geo-fencing. Managers assign tasks with location boundaries, employees submit location-verified progress updates, and managers approve or reject them.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Material-UI, React Leaflet, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Maps | Leaflet + OpenStreetMap |

---

## Features

### Manager
- Create tasks with GPS coordinates and geo-fence radius (100–500m)
- Assign tasks to employees
- View live employee locations on interactive map
- Approve or reject employee work updates
- Dashboard with stats: active employees, task completion rate, pending approvals

### Employee
- View assigned tasks with location details
- Start and complete tasks
- Submit progress updates with current location
- System auto-verifies if employee is inside the geo-fence
- View update history and approval status

---

## Project Structure

```
-Geotracking/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Login.js            # Authentication page
│   │   ├── ManagerDashboard.js # Manager interface
│   │   ├── EmployeeDashboard.js# Employee interface
│   │   └── MapView.js          # Interactive map with markers
│   ├── config/
│   │   └── api.js              # API base URL config
│   ├── App.js                  # Routing and auth logic
│   └── App.css                 # Global styles
│
├── server/                     # Node.js backend
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Task.js             # Task schema
│   │   ├── Attendance.js       # Attendance schema
│   │   └── WorkUpdate.js       # Work update schema
│   ├── routes/
│   │   ├── auth.js             # Login, register, employees
│   │   ├── tasks.js            # Task CRUD + status update
│   │   ├── updates.js          # Work updates + attendance
│   │   └── reports.js          # Dashboard stats
│   ├── utils/
│   │   └── geo.js              # Haversine formula
│   ├── seed.js                 # Seed demo users
│   ├── seed-tasks.js           # Seed demo tasks
│   └── server.js               # Express app entry point
│
├── public/                     # Static HTML
├── .env                        # Environment variables
└── package.json                # Frontend dependencies
```

---

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB running locally on port 27017

### 1. Clone and Install

```bash
# Install frontend dependencies
cd -Geotracking
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Setup

The `.env` file in the root is already configured:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/geotracking
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### 3. Seed the Database

```bash
cd server
node seed.js        # Creates demo users
node seed-tasks.js  # Creates demo tasks
```

### 4. Run the Application

Open two terminals:

```bash
# Terminal 1 - Backend
cd -Geotracking/server
npm start

# Terminal 2 - Frontend
cd -Geotracking
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager | manager@example.com | password |
| Employee | employee@example.com | password |
| Employee | john@example.com | password |
| Employee | sarah@example.com | password |

> Use the Quick Login buttons on the login page for instant access.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT token |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/employees` | Get all employees (manager only) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (role-based) |
| POST | `/api/tasks` | Create task (manager only) |
| PUT | `/api/tasks/:id` | Update task |
| PUT | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete task (manager only) |

### Work Updates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/updates` | Get updates (role-based) |
| GET | `/api/updates/my-updates` | Get own updates (employee) |
| POST | `/api/updates` | Submit work update |
| PUT | `/api/updates/:id/status` | Approve/reject update (manager) |
| POST | `/api/updates/attendance` | Check in / check out |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Dashboard statistics |
| GET | `/api/reports/performance/:id` | Employee performance |
| GET | `/api/reports/summary` | Daily/weekly summary |

---

## Geo-Fencing Logic

When an employee submits a work update, the backend calculates the distance between the employee's current location and the task location using the **Haversine formula**:

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}
```

If `distance <= geoFenceRadius`, the update is marked `isGeoVerified: true`.

---

## Authentication Flow

```
1. User submits email + password + role
2. Backend finds user in MongoDB
3. Backend generates JWT token (expires in 24h)
4. Frontend stores token in localStorage
5. Every API request sends: Authorization: Bearer <token>
6. Backend middleware verifies token before processing
```

---

## Database Schema

### User
```
name, email, password, role (manager|employee), lastLogin
```

### Task
```
title, description, assignedTo (ref: User), assignedBy (ref: User),
location { latitude, longitude }, geoFenceRadius (100-500m),
status (pending|in_progress|completed|cancelled),
priority (low|medium|high), completionPercentage
```

### WorkUpdate
```
taskId (ref: Task), employeeId (ref: User),
description, completionPercentage,
location { latitude, longitude },
isGeoVerified, status (pending|approved|rejected),
managerComments, timestamp
```

### Attendance
```
employeeId (ref: User), taskId (ref: Task),
checkInTime, checkOutTime,
checkInLocation, checkOutLocation,
totalHours, date, status (active|completed)
```

---

## View Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect using: `mongodb://localhost:27017`
3. Open the `geotracking` database
4. Browse collections: `users`, `tasks`, `attendances`, `workupdates`

---

## Interview Q&A

**What is geo-fencing?**
A virtual boundary around a real-world location. Defined by a center point (lat/lng) and a radius in meters. The Haversine formula checks if an employee's GPS coordinates fall inside that boundary.

**How does JWT authentication work?**
On login, the server generates a signed token containing the user's ID and role. The frontend stores it and sends it with every request. The backend verifies the signature before processing.

**How is role-based access implemented?**
The JWT payload contains the user's role. Middleware checks the role before allowing access — only managers can create tasks or approve updates.

**Why MongoDB?**
Flexible document model suits location data and work updates. No rigid schema needed. Scales well for real-time tracking.

**What would you improve in production?**
- Real-time updates with Socket.io
- bcrypt password hashing
- Refresh tokens
- Rate limiting and input sanitization
- React Native mobile app for field workers
- MongoDB Atlas for cloud database

---

## Running Tests

```bash
# Test all API endpoints
cd -Geotracking
node test-api.js

# Test full stack connection
node test-connection.js

# Diagnose any issues
node diagnose.js
```

---

## License

MIT

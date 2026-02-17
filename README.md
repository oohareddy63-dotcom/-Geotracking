# Employee Work Tracking System with Geo-Fencing

A modern, full-stack web application for tracking employee work activities with geo-fencing capabilities. Built with React, Material UI, Node.js, Express, and MongoDB.

## 🚀 Features

### Manager Dashboard
- **Task Management**: Create and assign tasks with geo-fence locations
- **Live Monitoring**: Real-time employee location tracking on interactive maps
- **Approval Workflow**: Review and approve/reject employee work updates
- **Analytics Dashboard**: View completion rates, active employees, and performance metrics
- **Reports**: Generate daily/weekly reports with export options

### Employee Dashboard
- **Task Interaction**: View assigned tasks with progress tracking
- **Geo-Fencing**: Automatic location validation for work submissions
- **Check-in/Out**: Time tracking with location verification
- **Work Updates**: Submit progress updates with photo proof
- **Real-time Status**: Live geo-fence status indicators

### Core Features
- **Authentication**: Simple role-based login (Manager/Employee)
- **Geo-Fencing**: Configurable radius-based location validation
- **Interactive Maps**: Leaflet-powered maps with employee markers
- **Real-time Updates**: Live location tracking and status updates
- **Performance Scoring**: Automated employee performance ratings
- **Responsive Design**: Mobile and desktop optimized
- **Modern UI**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Material UI** - Component library
- **Framer Motion** - Animations
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd geotracking
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/geotracking?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm start
```

### 4. Database Setup
- Create a MongoDB Atlas cluster or use local MongoDB
- Update the `MONGODB_URI` in `.env` with your connection string

## 🔐 Demo Credentials

### Manager Account
- Email: manager@example.com
- Password: password
- Role: Manager

### Employee Account
- Email: employee@example.com
- Password: password
- Role: Employee

## 📱 Usage

### For Managers
1. Login with manager credentials
2. Create tasks with location coordinates and geo-fence radius
3. Assign tasks to employees
4. Monitor live employee locations on the map
5. Review and approve work updates
6. View analytics and generate reports

### For Employees
1. Login with employee credentials
2. View assigned tasks
3. Check-in to start work session
4. Submit work updates with progress and photos
5. Check-out when work is complete
6. Monitor geo-fence status in real-time

## 🌍 Geo-Fencing Logic

- **Distance Calculation**: Uses Haversine formula for accurate distance measurement
- **Radius Validation**: Configurable radius (100-500 meters)
- **Status Indicators**:
  - 🟢 Green: Inside geo-fence
  - 🔴 Red: Outside geo-fence
- **Update Validation**: Submissions outside geo-fence are marked as unverified

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tasks
- `GET /api/tasks` - Get tasks (role-based)
- `POST /api/tasks` - Create task (manager only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (manager only)

### Updates
- `GET /api/updates` - Get work updates
- `POST /api/updates` - Submit work update
- `PUT /api/updates/:id/status` - Approve/reject update
- `POST /api/updates/attendance` - Check-in/check-out

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/performance/:employeeId` - Employee performance
- `GET /api/reports/summary` - Daily/weekly reports

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern frosted glass effects
- **Smooth Animations**: Page transitions and micro-interactions
- **Responsive Layout**: Optimized for all screen sizes
- **Dark/Light Mode**: Theme toggle capability
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: Real-time feedback messages

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Session timeout handling

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
serve -s build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@geotracking.com or create an issue in the repository.

## 🔄 Future Enhancements

- [ ] Push notifications for task assignments
- [ ] Advanced reporting with charts and graphs
- [ ] Mobile app development
- [ ] Integration with GPS tracking devices
- [ ] Advanced analytics and AI insights
- [ ] Multi-language support
- [ ] Offline mode capabilities
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 0cc41d0211a3e1d28b249b4a02ab479648fe798b

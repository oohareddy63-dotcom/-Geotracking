// In production (Render), frontend and backend are on the same domain
// In development, backend runs on port 5000
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? ''  // same origin in production
    : 'http://localhost:5000');

export default API_BASE_URL;

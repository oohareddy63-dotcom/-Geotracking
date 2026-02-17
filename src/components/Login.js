import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';
import API_BASE_URL from '../config/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      onLogin(response.data.user, response.data.token);
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password, role) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        role
      });
      onLogin(response.data.user, response.data.token);
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Employee Work Tracking
              </Typography>
            </motion.div>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  className="input-glass"
                  sx={{ mb: 2 }}
                />
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-glass"
                  sx={{ mb: 2 }}
                />
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <FormControl fullWidth required sx={{ mb: 3 }} className="input-glass">
                  <InputLabel id="role-label" sx={{ color: 'var(--text-secondary)' }}>Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-light)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-glow)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary)',
                      },
                    }}
                  >
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="btn-gradient"
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 48,
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '16px',
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </motion.div>

              {/* Quick Login Buttons */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" align="center" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Quick Login (Demo Users):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickLogin('manager@example.com', 'password', 'manager')}
                    sx={{ minWidth: '120px' }}
                  >
                    Manager
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickLogin('employee@example.com', 'password', 'employee')}
                    sx={{ minWidth: '120px' }}
                  >
                    Employee
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickLogin('john@example.com', 'password', 'employee')}
                    sx={{ minWidth: '120px' }}
                  >
                    John
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickLogin('sarah@example.com', 'password', 'employee')}
                    sx={{ minWidth: '120px' }}
                  >
                    Sarah
                  </Button>
                </Box>
              </Box>
            </Box>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Demo Credentials:<br />
                Manager: manager@example.com / password<br />
                Employee: employee@example.com / password
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Box>

      {/* Animated background elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: '12px',
              color: 'rgba(25, 118, 210, 0.1)',
              fontFamily: 'monospace',
            }}
          >
            {Math.random() > 0.5 ? '0' : '1'}
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};

export default Login;

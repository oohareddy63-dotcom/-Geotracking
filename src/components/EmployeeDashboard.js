import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Login as CheckInIcon,
  Logout as CheckOutIcon,
  Update as UpdateIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoIcon,
  Logout as LogoutIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('unknown');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateData, setUpdateData] = useState({
    description: '',
    completionPercentage: 0,
    proofImages: []
  });
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    fetchTasks();
    getCurrentLocation();
    checkAttendanceStatus();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          checkGeoFenceStatus(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const checkGeoFenceStatus = (lat, lon) => {
    // Check against all assigned tasks
    const inFence = tasks.some(task => {
      if (!task.location) return false;
      const distance = calculateDistance(
        lat, lon,
        task.location.latitude, task.location.longitude
      );
      return distance <= task.geoFenceRadius;
    });
    setGeoStatus(inFence ? 'inside' : 'outside');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkAttendanceStatus = async () => {
    try {
      // This would need a specific endpoint to check current attendance status
      // For now, we'll assume no active attendance
      setAttendanceStatus(null);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const handleCheckInOut = async (type) => {
    if (!currentLocation) {
      toast.error('Location not available. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/updates/attendance', {
        taskId: selectedTask?._id,
        type,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success(`${type === 'checkin' ? 'Checked in' : 'Checked out'} successfully!`);
      setAttendanceStatus(type === 'checkin' ? 'active' : null);
    } catch (error) {
      toast.error('Error updating attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!currentLocation) {
      toast.error('Location not available. Please try again.');
      return;
    }

    if (geoStatus === 'outside') {
      toast.warning('You are outside the geo-fence. Update will be marked as unverified.');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/updates', {
        taskId: selectedTask._id,
        description: updateData.description,
        completionPercentage: updateData.completionPercentage,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        proofImages: updateData.proofImages
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Update submitted successfully!');
      setOpenUpdateDialog(false);
      setUpdateData({ description: '', completionPercentage: 0, proofImages: [] });
      fetchTasks();
    } catch (error) {
      toast.error('Error submitting update');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateDialogForTask = (task) => {
    setSelectedTask(task);
    setUpdateData({
      description: '',
      completionPercentage: task.completionPercentage || 0,
      proofImages: []
    });
    setOpenUpdateDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Employee Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back, {user.name}
          </Typography>
        </motion.div>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={geoStatus === 'inside' ? 'Inside Geo-Fence' : 'Outside Geo-Fence'}
            color={geoStatus === 'inside' ? 'success' : 'warning'}
            icon={<LocationIcon />}
          />
          <IconButton onClick={onLogout} color="primary">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Location Status */}
      {currentLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert severity={geoStatus === 'inside' ? 'success' : 'warning'} sx={{ mb: 3 }}>
            Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            {geoStatus === 'outside' && ' - You are outside the designated work area.'}
          </Alert>
        </motion.div>
      )}

      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {tasks.map((task, index) => (
          <Grid item xs={12} md={6} lg={4} key={task._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {task.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {task.location?.latitude?.toFixed(4)}, {task.location?.longitude?.toFixed(4)}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip
                      label={task.status}
                      color={task.status === 'completed' ? 'success' : 'primary'}
                      size="small"
                    />
                    <Typography variant="body2">
                      {task.completionPercentage}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={task.completionPercentage}
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UpdateIcon />}
                      onClick={() => openUpdateDialogForTask(task)}
                      fullWidth
                    >
                      Update
                    </Button>
                    {!attendanceStatus && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckInIcon />}
                        onClick={() => {
                          setSelectedTask(task);
                          handleCheckInOut('checkin');
                        }}
                        disabled={!currentLocation}
                      >
                        Check In
                      </Button>
                    )}
                    {attendanceStatus === 'active' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<CheckOutIcon />}
                        onClick={() => handleCheckInOut('checkout')}
                        disabled={!currentLocation}
                      >
                        Check Out
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button for Location Refresh */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={getCurrentLocation}
      >
        <MyLocationIcon />
      </Fab>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Work Update</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedTask && (
              <Typography variant="h6" gutterBottom>
                {selectedTask.title}
              </Typography>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Work Description"
              value={updateData.description}
              onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Completion Percentage"
              value={updateData.completionPercentage}
              onChange={(e) => setUpdateData({ ...updateData, completionPercentage: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 2 }}
            />

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PhotoIcon />
              <Typography variant="body2" color="textSecondary">
                Proof Images (Optional)
              </Typography>
              <Button variant="outlined" size="small" component="label">
                Upload
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    // Handle file upload here
                    const files = Array.from(e.target.files);
                    setUpdateData({ ...updateData, proofImages: files });
                  }}
                />
              </Button>
            </Box>

            {geoStatus === 'outside' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You are currently outside the geo-fence. This update will be marked as unverified.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitUpdate}
            variant="contained"
            disabled={loading || !updateData.description.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeDashboard;

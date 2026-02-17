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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import MapView from './MapView';
import '../App.css';
import API_BASE_URL from '../config/api';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [myUpdates, setMyUpdates] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [currentUpdateTask, setCurrentUpdateTask] = useState(null);
  const [updateData, setUpdateData] = useState({
    description: '',
    completionPercentage: 0,
    location: { latitude: 0, longitude: 0 }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
    fetchUpdates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reports/employee-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/updates/my-updates`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleSendUpdate = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/updates`, {
        taskId: currentUpdateTask._id,
        description: updateData.description,
        completionPercentage: parseInt(updateData.completionPercentage),
        location: {
          latitude: parseFloat(updateData.location.latitude),
          longitude: parseFloat(updateData.location.longitude)
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Update sent successfully!');
      setOpenUpdateDialog(false);
      setUpdateData({
        description: '',
        completionPercentage: 0,
        location: { latitude: 0, longitude: 0 }
      });
      fetchUpdates();
      fetchTasks();
    } catch (error) {
      toast.error('Error sending update');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
        status: 'in_progress'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task started!');
      fetchTasks();
    } catch (error) {
      toast.error('Error starting task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
        status: 'completed'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task completed!');
      fetchTasks();
    } catch (error) {
      toast.error('Error completing task');
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card" sx={{
        height: '100%',
        backgroundColor: 'var(--bg-card)',
        border: 'none',
        backdropFilter: 'none',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        }
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} className="fade-in-up">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Employee Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user.name}
          </Typography>
        </motion.div>
        <Box>
          <IconButton 
            onClick={onLogout}
            sx={{
              background: 'linear-gradient(135deg, var(--danger), #DC2626)',
              color: 'white',
              width: 48,
              height: 48,
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
                transform: 'scale(1.1)',
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Tasks"
            value={tasks.length}
            icon={<AssignmentIcon />}
            color="#1976d2"
            subtitle="Assigned to you"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={tasks.filter(t => t.status === 'completed').length}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
            subtitle="Tasks finished"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={tasks.filter(t => t.status === 'in_progress').length}
            icon={<AssessmentIcon />}
            color="#ed6c02"
            subtitle="Active tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Updates"
            value={myUpdates.filter(u => u.status === 'pending').length}
            icon={<CheckCircleIcon />}
            color="#d32f2f"
            subtitle="Waiting approval"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper className="glass-card" sx={{ width: '100%', mb: 4, border: 'none', backdropFilter: 'none' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex' }}>
            <Button
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                color: activeTab === 0 ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 0 ? 'bold' : 'normal',
                textTransform: 'none',
                fontSize: '16px',
                background: activeTab === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderRight: '1px solid var(--border-light)',
                '&:last-child': {
                  borderRight: 'none'
                },
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                }
              }}
              onClick={() => setActiveTab(0)}
            >
              <AssignmentIcon sx={{ mr: 1 }} />
              My Tasks
            </Button>
            <Button
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                color: activeTab === 1 ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 1 ? 'bold' : 'normal',
                textTransform: 'none',
                fontSize: '16px',
                background: activeTab === 1 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderRight: '1px solid var(--border-light)',
                '&:last-child': {
                  borderRight: 'none'
                },
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                }
              }}
              onClick={() => setActiveTab(1)}
            >
              <CheckCircleIcon sx={{ mr: 1 }} />
              Updates
            </Button>
            <Button
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                color: activeTab === 2 ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 2 ? 'bold' : 'normal',
                textTransform: 'none',
                fontSize: '16px',
                background: activeTab === 2 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                }
              }}
              onClick={() => setActiveTab(2)}
            >
              <MapIcon sx={{ mr: 1 }} />
              Location
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                My Tasks
              </Typography>
              {tasks.length === 0 ? (
                <Alert severity="info" className="glass-card" sx={{ border: 'none', backdropFilter: 'none' }}>
                  You don't have any assigned tasks yet.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {tasks.map((task) => (
                    <Grid item xs={12} md={6} lg={4} key={task._id}>
                      <Card className="glass-card" sx={{ border: 'none', backdropFilter: 'none', height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                            {task.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'var(--accent)' }} />
                            {task.location?.latitude?.toFixed(4)}, {task.location?.longitude?.toFixed(4)}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Chip
                              label={task.status}
                              color={
                                task.status === 'completed' ? 'success' : 
                                task.status === 'in_progress' ? 'warning' : 
                                'info'
                              }
                              size="small"
                              sx={{
                                background: task.status === 'completed' ? 'var(--success)' : 
                                         task.status === 'in_progress' ? 'var(--warning)' : 
                                         'var(--primary)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                              {task.completionPercentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={task.completionPercentage}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 4,
                              background: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(90deg, var(--${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'primary'}), var(--accent))`
                              }
                            }}
                          />
                          <Box mt={2} display="flex" gap={1}>
                            {task.status === 'pending' && (
                              <Button
                                size="small"
                                variant="contained"
                                className="btn-gradient"
                                onClick={() => handleStartTask(task._id)}
                                sx={{ flex: 1, fontSize: '12px', py: 0.5 }}
                              >
                                Start
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  className="input-glass"
                                  onClick={() => {
                                    setCurrentUpdateTask(task);
                                    setOpenUpdateDialog(true);
                                  }}
                                  sx={{ flex: 1, fontSize: '12px', py: 0.5 }}
                                >
                                  Update
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  className="btn-gradient"
                                  onClick={() => handleCompleteTask(task._id)}
                                  sx={{ flex: 1, fontSize: '12px', py: 0.5 }}
                                >
                                  Complete
                                </Button>
                              </>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                My Updates
              </Typography>
              <List>
                {myUpdates.map((update) => (
                  <React.Fragment key={update._id}>
                    <ListItem className="glass-card" sx={{ mb: 1, border: 'none', backdropFilter: 'none' }}>
                      <ListItemText
                        primary={`${update.taskId?.title}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{update.description}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(update.timestamp).toLocaleString()}
                            </Typography>
                            <Box mt={1}>
                              <Chip
                                label={update.isGeoVerified ? 'Geo-Verified' : 'Outside Geo-Fence'}
                                color={update.isGeoVerified ? 'success' : 'warning'}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Chip
                                label={`${update.completionPercentage}% Complete`}
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={update.status.toUpperCase()}
                          color={
                            update.status === 'approved' ? 'success' : 
                            update.status === 'rejected' ? 'error' : 
                            'warning'
                          }
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                My Location
              </Typography>
              <MapView employees={[{ ...user, location: { latitude: 40.7128, longitude: -74.0060 } }]} tasks={tasks} />
            </motion.div>
          )}
        </Box>
      </Paper>

      {/* Update Task Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="glass-card" sx={{ m: 0, p: 2, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none', color: 'var(--text-primary)' }}>
          Send Task Update
        </DialogTitle>
        <DialogContent dividers className="glass-card" sx={{ p: 3, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none' }}>
          {currentUpdateTask && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                {currentUpdateTask.title}
              </Typography>
              <TextField
                fullWidth
                label="Update Description"
                multiline
                rows={3}
                value={updateData.description}
                onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Completion Percentage"
                type="number"
                value={updateData.completionPercentage}
                onChange={(e) => setUpdateData({ ...updateData, completionPercentage: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Current Latitude"
                    type="number"
                    value={updateData.location.latitude}
                    onChange={(e) => setUpdateData({ 
                      ...updateData, 
                      location: { ...updateData.location, latitude: e.target.value } 
                    })}
                    className="input-glass"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Current Longitude"
                    type="number"
                    value={updateData.location.longitude}
                    onChange={(e) => setUpdateData({ 
                      ...updateData, 
                      location: { ...updateData.location, longitude: e.target.value } 
                    })}
                    className="input-glass"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="glass-card" sx={{ p: 2, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none' }}>
          <Button onClick={() => setOpenUpdateDialog(false)} className="input-glass" sx={{ borderRadius: '8px', minWidth: '80px' }}>
            Cancel
          </Button>
          <Button onClick={handleSendUpdate} className="btn-gradient" disabled={loading} sx={{ borderRadius: '8px', minWidth: '100px' }}>
            {loading ? 'Sending...' : 'Send Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeDashboard;
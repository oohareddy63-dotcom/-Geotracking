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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Map as MapIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocationOn as LocationIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import MapView from './MapView';
import API_BASE_URL from '../config/api';

const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    latitude: '',
    longitude: '',
    geoFenceRadius: 200
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
    fetchUpdates();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/employees`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reports/dashboard`, {
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
      const response = await axios.get(`${API_BASE_URL}/api/updates`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleCreateTask = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, {
        ...newTask,
        location: {
          latitude: parseFloat(newTask.latitude),
          longitude: parseFloat(newTask.longitude)
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task created successfully!');
      setOpenTaskDialog(false);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        latitude: '',
        longitude: '',
        geoFenceRadius: 200
      });
      fetchTasks();
    } catch (error) {
      toast.error('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (updateId, status, comments = '') => {
    try {
      await axios.put(`${API_BASE_URL}/api/updates/${updateId}/status`, {
        status,
        managerComments: comments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Update ${status}`);
      fetchUpdates();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        height: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${color}40`,
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
            Manager Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user.name}
          </Typography>
        </motion.div>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskDialog(true)}
            sx={{ 
              mr: 2,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              color: 'white',
              borderRadius: '10px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary-dark), #153E75)',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
              }
            }}
          >
            Create Task
          </Button>
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
            title="Active Employees"
            value={dashboardStats.activeEmployees || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle="Currently working"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={dashboardStats.totalTasks || 0}
            icon={<AssessmentIcon />}
            color="#2e7d32"
            subtitle={`${dashboardStats.completedTasks || 0} completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${dashboardStats.completionRate || 0}%`}
            icon={<CheckCircleIcon />}
            color="#ed6c02"
            subtitle="Task completion"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Updates"
            value={dashboardStats.pendingUpdates || 0}
            icon={<PendingIcon />}
            color="#d32f2f"
            subtitle="Awaiting approval"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper className="glass-card" sx={{ width: '100%', mb: 4, border: 'none', backdropFilter: 'none' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Live Map" icon={<MapIcon />} iconPosition="start" />
          <Tab label="Task Management" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Update Approvals" icon={<CheckCircleIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Live Employee Tracking
              </Typography>
              <MapView employees={dashboardStats.todaysAttendance || []} tasks={tasks} />
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Task Management
              </Typography>
              <Grid container spacing={2}>
                {tasks.map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task._id}>
                    <Card className="glass-card" sx={{ border: 'none', backdropFilter: 'none', height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon sx={{ fontSize: 16, mr: 1 }} />
                          {task.assignedTo?.name || 'Unassigned'}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                          <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'var(--accent)' }} />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {task.location?.latitude?.toFixed(4)}, {task.location?.longitude?.toFixed(4)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                          <Chip
                            label={task.status}
                            color={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'info'}
                            size="small"
                            sx={{
                              background: task.status === 'completed' ? 'var(--success)' : 
                                       task.status === 'in_progress' ? 'var(--warning)' : 
                                       'var(--primary)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1, color: 'var(--text-secondary)' }}>
                              {task.completionPercentage}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--primary)' }}>
                              {task.priority?.toUpperCase()}
                            </Typography>
                          </Box>
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Update Approvals
              </Typography>
              <List>
                {updates.filter(update => update.status === 'pending').map((update) => (
                  <React.Fragment key={update._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${update.employeeId?.name} - ${update.taskId?.title}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">{update.description}</Typography>
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
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleUpdateStatus(update._id, 'approved')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleUpdateStatus(update._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </motion.div>
          )}
        </Box>
      </Paper>

      {/* Create Task Dialog */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle className="glass-card" sx={{ m: 0, p: 2, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none', color: 'var(--text-primary)' }}>
          Create New Task
        </DialogTitle>
        <DialogContent dividers className="glass-card" sx={{ p: 3, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={newTask.latitude}
                onChange={(e) => setNewTask({ ...newTask, latitude: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={newTask.longitude}
                onChange={(e) => setNewTask({ ...newTask, longitude: e.target.value })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Geo-Fence Radius (meters)"
                type="number"
                value={newTask.geoFenceRadius}
                onChange={(e) => setNewTask({ ...newTask, geoFenceRadius: parseInt(e.target.value) })}
                className="input-glass"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="input-glass">
                <InputLabel sx={{ color: 'var(--text-secondary)' }}>Assign to Employee</InputLabel>
                <Select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  displayEmpty
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
                  <MenuItem value="" disabled>
                    <em>Select Employee</em>
                  </MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="glass-card" sx={{ p: 2, background: 'var(--bg-card)', backdropFilter: 'none', border: 'none' }}>
          <Button onClick={() => setOpenTaskDialog(false)} className="input-glass" sx={{ borderRadius: '8px', minWidth: '80px' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} className="btn-gradient" disabled={loading} sx={{ borderRadius: '8px', minWidth: '120px' }}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagerDashboard;

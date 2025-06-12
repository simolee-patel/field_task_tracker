import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Paper,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Tooltip,
} from '@mui/material';
import { blue, green, orange, grey } from '@mui/material/colors';

import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

function TasksPage() {
  
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const userStatusOptions = ['pending', 'in_progress', 'completed'];

useEffect(() => {
  const t = localStorage.getItem('token');
  if (!t) return;

  setToken(t);
  try {
    const payload = JSON.parse(atob(t.split('.')[1]));
    setIsAdmin(payload.role === 'admin');
    setUser({ name: payload.name, role: payload.role, id: payload.id });

    if (payload.role === 'admin') {
      fetch('/api/users', { headers: { Authorization: `Bearer ${t}` } })
        .then(res => res.json())
        .then(setUsers);
    }

    fetchTasks(payload.role === 'admin', payload.id, t);

    // ✅ Socket.IO event listeners
    socket.on('taskCreated', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks(prev =>
        prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', ({ id }) => {
      setTasks(prev => prev.filter(task => task._id !== id));
    });

    // ✅ Clean up listeners on unmount
    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  } catch (err) {
    console.error('Invalid token');
  }
}, []);


  const fetchTasks = async (isAdmin, uid, tkn, selectedUser = '') => {
    const endpoint = isAdmin && selectedUser
      ? `/api/tasks/${selectedUser}`
      : isAdmin
      ? '/api/tasks'
      : `/api/tasks/${uid}`;

    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks(isAdmin, user?.id, token, selectedUserId);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDeleteTask = async taskId => {
    if (!window.confirm('Delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      fetchTasks(isAdmin, user?.id, token, selectedUserId);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddTask = async () => {
    if (!title || !assignedTo) return;

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, assignedTo }),
      });

      setTitle('');
      setDescription('');
      setAssignedTo('');
      fetchTasks(isAdmin, user?.id, token);
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

return (
  <>
    <Header user={user} />
    <Container sx={{ mt: 4 }}>
      {isAdmin && (
        <Box mb={4}>
          <Typography variant="h6">Create Task</Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Assign to"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            sx={{ mb: 2 }}
          >
            {users.map(u => (
              <MenuItem key={u._id} value={u._id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleAddTask} fullWidth>
            ➕ Add Task
          </Button>
        </Box>
      )}

      <Box mb={3}>
        {isAdmin && (
          <TextField
            select
            fullWidth
            label="Filter by User"
            value={selectedUserId}
            onChange={e => {
              const uid = e.target.value;
              setSelectedUserId(uid);
              fetchTasks(true, user?.id, token, uid);
            }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Users</MenuItem>
            {users.map(u => (
              <MenuItem key={u._id} value={u._id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          label="Filter by Status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {userStatusOptions.map(status => (
            <MenuItem key={status} value={status}>
              {status.replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {tasks.length === 0 ? (
        <Typography align="center" color="textSecondary">
          🎉 No tasks available.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {tasks
            .filter(task => statusFilter === 'all' || task.status === statusFilter)
            .map(task => {
              const statusColors = {
                pending: '#FFA726',       // orange
                in_progress: '#42A5F5',   // blue
                completed: '#66BB6A',     // green
              };

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: `6px solid ${statusColors[task.status] || '#ccc'}`,
                      p: 2,
                      '&:hover': { boxShadow: 8 },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {task.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      👤 Assigned to: {task.assignedTo?.name || 'Unassigned'}
                    </Typography>

                    <Box mt={2}>
                      {!isAdmin && task.assignedTo?._id === user?.id ? (
                        <FormControl fullWidth>
                          <Select
                            value={task.status}
                            onChange={e => handleStatusChange(task._id, e.target.value)}
                          >
                            {userStatusOptions.map(status => (
                              <MenuItem key={status} value={status}>
                                {status.replace('_', ' ')}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography>
                          Status:{' '}
                          <strong style={{ color: statusColors[task.status] || '#000' }}>
                            {task.status.replace('_', ' ')}
                          </strong>
                        </Typography>
                      )}
                    </Box>

                    {isAdmin && (
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      )}
    </Container>
  </>
);

}

export default TasksPage;

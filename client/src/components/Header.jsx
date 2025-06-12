import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (err) {
      console.error('Invalid token');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ height: 50, justifyContent: 'center' }}>
      <Toolbar sx={{ minHeight: '50px !important', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
          Task Manager
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">{user.name || user.email}</Typography>
            <Button color="inherit" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;

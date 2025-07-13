import React, { useContext } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 600, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || 'LHB User'}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          You are logged in as <strong>{user?.role}</strong>
        </Typography>

        <Button variant="outlined" onClick={logout} sx={{ mt: 4 }}>
          Logout
        </Button>
      </Box>
    </AppLayout>
  );
};

export default Dashboard;

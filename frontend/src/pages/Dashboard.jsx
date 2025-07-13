import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'LHB User'}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are logged in as <strong>{user?.role}</strong>
      </Typography>

      <Button variant="outlined" onClick={logout} sx={{ mt: 4 }}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;

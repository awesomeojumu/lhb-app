import React, { useContext } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import calculateProfileCompletion from '../utils/calculateProfileCompletion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const profileCompletion = calculateProfileCompletion(user);

  return (
    <AppLayout>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          gutterBottom
        >
          Welcome, {user?.firstName || 'Soldier'}!
        </Typography>

        <Typography
          variant="body2"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          gutterBottom
        >
          We honour you,{' '}
          <strong>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()}
          </strong>
        </Typography>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1">Profile Completion</Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={profileCompletion}
                  size={80}
                  thickness={5}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">
                    {`${profileCompletion}%`}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default Dashboard;

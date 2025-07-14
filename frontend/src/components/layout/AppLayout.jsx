import React, { useContext, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';

const AppLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f7f9fb' }}>
      <Navbar
        toggleSidebar={toggleSidebar}
        user={user}
        logo={logo}
        appName="LHB Dashboard"
      />

      {/* Spacer that pushes content below the fixed navbar */}
      <Toolbar />

      <Box sx={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 'calc(100vh - 64px)',
            transition: 'margin 0.3s ease',
            ml: sidebarOpen ? '5px' : '5px',
            display: 'flex',
            justifyContent: 'center',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

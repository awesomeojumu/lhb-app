import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Tooltip,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const drawerWidth = open ? 200 : 70;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    // { text: 'KPIs', icon: <AssignmentIcon />, path: '/kpis' },
    // { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: '64px', // align below navbar
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip key={text} title={!open ? text : ''} placement="right">
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              {open && <ListItemText primary={text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

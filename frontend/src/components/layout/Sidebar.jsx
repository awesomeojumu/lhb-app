import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const drawerWidth = open ? 200 : 70;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    // Add more items as needed
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', sm: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: isMobile ? 0 : '64px', // shift below navbar on desktop
          pt: isMobile ? '64px' : 0, // padding below navbar on mobile
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <Tooltip
            key={text}
            title={!open && !isMobile ? text : ''}
            placement="right"
          >
            <ListItemButton
              onClick={() => {
                navigate(path);
                if (isMobile) onClose?.(); // auto-close drawer on mobile
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              {(open || isMobile) && <ListItemText primary={text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

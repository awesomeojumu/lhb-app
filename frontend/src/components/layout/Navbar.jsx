import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; // ✅ Corrected path
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../../assets/logo.jpg";



const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext); // ✅ Access user from context
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '';

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Sidebar toggle + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleSidebar} edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="LHB Logo" style={{ height: 40 }} />
            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
              LHB Dashboard
            </Typography>
          </Box>
        </Box>

        {/* Right: Avatar menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {getInitials(user?.firstName || user?.name || 'U')}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{ elevation: 3, sx: { minWidth: 220, mt: 1.5 } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight="bold">{user?.firstName || 'Soldier'}!</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role || 'Role'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

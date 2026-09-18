import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { NotificationsOutlined, AccountCircleOutlined } from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleOpenProfile = () => {
    navigate('/profile');
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgColor: 'background.paper' }}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Brand */}
        <Button
          component={({ to, ...rest }) => (
            <a href="/" {...rest} />}
          )
          variant="contained"
          color="primary"
          size="large"
          sx={{ mr: 2 }}
        >
          InvoiceExtractor
        </Button>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Notification Icon */}
        <Badge badgeContent={4} color="error">
          <IconButton
            size="large"
            aria-label="notifications"
          >
            <NotificationsOutlined />
          </IconButton>
        </Badge>

        {/* User Menu */}
        {isAuthenticated && (
          <>
            <Box sx={{ mr: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                startIcon={<AccountCircleOutlined />}
              >
                {user?.full_name || 'Profile'}
              </Button>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="medium"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
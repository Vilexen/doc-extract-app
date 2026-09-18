import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  InboxOutlined,
  UploadOutlined,
  TabletOutlined,
  BarChartOutlined,
  SettingOutlined,
  PersonOutlined,
  LogoutOutlined
} from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { isAdmin } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <div sx={{ p: 3 }}>
        <Typography variant="h6" component="h1" noWrap>
          InvoiceExtractor
        </Typography>
      </div>
      <Divider />
      <List>
        {/* Navigation items */}
        <ListItem button onClick={() => handleNavigate('/dashboard')}>
          <ListItemIcon>
            <DashboardOutlined />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => handleNavigate('/upload')}>
          <ListItemIcon>
            <UploadOutlined />
          </ListItemIcon>
          <ListItemText primary="Upload Invoices" />
        </ListItem>

        <ListItem button onClick={() => handleNavigate('/invoices')}>
          <ListItemIcon>
            <InboxOutlined />
          </ListItemIcon>
          <ListItemText primary="Invoices" />
        </ListItem>

        <ListItem button onClick={() => handleNavigate('/vendors')}>
          <ListItemIcon>
            <TabletOutlined />
          </ListItemIcon>
          <ListItemText primary="Vendors" />
        </ListItem>

        <ListItem button onClick={() => handleNavigate('/analytics')}>
          <ListItemIcon>
            <BarChartOutlined />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>

        <Divider />

        {isAdmin && (
          <>
            <ListItem button onClick={() => handleNavigate('/users')}>
              <ListItemIcon>
                <PersonOutlined />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>

            <ListItem button onClick={() => handleNavigate('/settings')}>
              <ListItemIcon>
                <SettingOutlined />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <ListItem button onClick={() => {
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
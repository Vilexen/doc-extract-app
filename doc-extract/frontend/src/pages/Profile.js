import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
  Chip,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import {
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  SaveOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile'); // profile, password, notifications

  useEffect(() => {
    // Initialize form values with current user data
    setFormValues({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  }, [user]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form values
      setFormValues({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the update user API
      // For now, we'll just update the local state and Redux
      dispatch(updateUser(formValues));
      setEditMode(false);
      setLoading(false);

      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setLoading(false);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the change password API
      // For now, we'll just simulate success
      if (passwordValues.newPassword !== passwordValues.confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      setLoading(false);
      setPasswordValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      setLoading(false);
      alert(error.message || 'Failed to change password. Please try again.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Profile Settings
          </Typography>
          <Button
            variant={editMode ? 'contained' : 'outlined'}
            color="primary"
            size="medium"
            onClick={handleEditToggle}
            sx={{ mb: 2 }}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
            <FormControlLabel
              value="profile"
              control={<Radio
                checked={activeTab === 'profile'}
                onChange={() => handleTabChange('profile')}
                color="primary"
              }}
              label="Profile"
            />
            <FormControlLabel
              value="password"
              control={<Radio
                checked={activeTab === 'password'}
                onChange={() => handleTabChange('password')}
                color="primary"
              }}
              label="Password"
            />
            <FormControlLabel
              value="notifications"
              control={<Radio
                checked={activeTab === 'notifications'}
                onChange={() => handleTabChange('notifications')}
                color="primary"
              }}
              label="Notifications"
            />
          </Box>
        </Box>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <Box>
            {!editMode ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ width: 120, height: 120 }} alt="User">
                  {(user?.full_name || 'U')[0]}
                </Avatar>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  {user?.full_name || 'User Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
                <Chip
                  label={user?.role?.toUpperCase() || 'USER'}
                  color={user?.role === 'admin' ? 'error' : user?.role === 'accountant' ? 'warning' : 'info'}
                  sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member since: Jan 2026
                  </Typography>
                </Box>
              </Box>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}>
                <Stack spacing={3}>
                  <TextField
                    label="Full Name"
                    value={formValues.full_name || ''}
                    onChange={(e) => setFormValues({ ...formValues, full_name: e.target.value })}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <PersonOutlined fontSize="small" />
                      )
                    }}
                  />
                  <TextField
                    label="Email Address"
                    value={formValues.email || ''}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    type="email"
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <EmailOutlined fontSize="small" />
                      )
                    }}
                  />
                  <TextField
                    label="Phone Number"
                    value={formValues.phone || ''}
                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <PhoneOutlined fontSize="small" />
                      )
                    }}
                  />
                  <TextField
                    label="Address"
                    value={formValues.address || ''}
                    onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <HomeOutlined fontSize="small" />
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} />
                        <span sx={{ ml: 2 }}>Saving...</span>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Stack>
              </form>
            )}
          </Box>
        )}

        {/* Password Tab Content */}
        {activeTab === 'password' && (
          <Box sx={{ p: 3 }}>
            <FormControlLabel
              label="Change Password"
              control={<Radio
                checked={true}
                color="primary"
              }}
            />
            <form onSubmit={(e) => {
              e.preventDefault();
              handlePasswordChange();
            }}>
              <Stack spacing={3}>
                <TextField
                  label="Current Password"
                  value={passwordValues.currentPassword || ''}
                  onChange={(e) => setPasswordValues({ ...passwordValues, currentPassword: e.target.value })}
                  type="password"
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <LockOutlined fontSize="small" />
                    )
                  }}
                />
                <TextField
                  label="New Password"
                  value={passwordValues.newPassword || ''}
                  onChange={(e) => setPasswordValues({ ...passwordValues, newPassword: e.target.value })}
                  type="password"
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <LockOutlined fontSize="small" />
                    )
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  value={passwordValues.confirmPassword || ''}
                  onChange={(e) => setPasswordValues({ ...passwordValues, confirmPassword: e.target.value })}
                  type="password"
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <LockOutlined fontSize="small" />
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} />
                      <span sx={{ ml: 2 }}>Changing Password...</span>
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>
            </Box>
          )}

          {/* Notifications Tab Content */}
          {activeTab === 'notifications' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Notification Preferences
              </Typography>
              <FormControlLabel
                control={<Radio
                  checked={true}
                  color="primary"
                />}
                label="Email notifications for invoice processing completion"
              />
              <FormControlLabel
                control={<Radio
                  checked={true}
                  color="primary"
                }}
                label="Email notifications for pending reviews"
              />
              <FormControlLabel
                control={<Radio
                  checked={false}
                  color="primary"
                }}
                label="Weekly analytics digest"
              />
              <FormControlLabel
                control={<Radio
                  checked={true}
                  color="primary"
                }}
                label="Security alerts"
              />
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                >
                  Save Notification Preferences
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
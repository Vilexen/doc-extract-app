import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { LockOutlined, PersonOutlined } from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';

const Login = ({ isRegister = false } = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoading: authLoading, error: authError } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      dispatch(loginStart());

      // Simulate API call
      // In a real app, this would be an actual API request
      const userData = {
        email,
        full_name: email.split('@')[0],
        role: 'user'
      };

      // Mock token
      const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      dispatch(loginSuccess({
        user: userData,
        token
      }));

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
      dispatch(loginFailure(err.message || 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: 4,
        mb: 4 * 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box sx={{ mb: 4, p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {isRegister ? 'Create Account' : 'Sign In'}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <form onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          {!isRegister && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <PersonOutlined fontSize="small" />
                  )
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <LockedOutlined fontSize="small" />
                  )
                }}
              />
            </>
          )}

          {isRegister && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <PersonOutlined fontSize="small" />
                  )
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <LockedOutlined fontSize="small" />
                  )
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <LockedOutlined fontSize="small" />
                  )
                }}
              />
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mb: 3, mt: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} />
                <span sx={{ ml: 2 }}>{isRegister ? 'Creating Account' : 'Signing In'}</span>
              </>
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </Button>

          <Box sx={{ mt: 3 }}>
            <Link
              component={({ to, ...rest }) => (
                <a href={isRegister ? '/login' : '/register'} {...rest} />}
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register"}
            </Link>
          </Box>
        </form>
      </Box>

      <Box sx={{ mt: 5, opacity: 0.6 }}>
        <Typography size="small" align="center">
          Invoice Extraction Platform v1.0.0
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
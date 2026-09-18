import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
      <Box sx={{ mb: 4 }}>
        <ErrorOutlined fontSize={100} color="error" />
      </Box>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            Return to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="medium"
            sx={{ ml: 2 }}
            onClick={() => navigate('/', { replace: true })}
          >
            Go to Home
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
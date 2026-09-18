import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import { useEffect } from 'react';

// Import pages (to be created)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Import layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Import services
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);

  // Check auth status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // In a real app, we would validate the token here
      // For now, we'll just set the user from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      // Dispatch login success action would go here
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <CssBaseline>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar - hidden on mobile */}
        <Box sx={{
          width: { xs: 0, sm: 240 },
          bgColor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column'
        }}>
          <Sidebar />
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Header />
          <main sx={{
            padding: 3,
            width: '100%',
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)' /* Adjust for header height */
          }}>
            <Container maxWidth="lg">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login isRegister />} />

                {/* Protected routes */}
                <Route
                  element={isAuthenticated ? (
                    <>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/invoices/:id" element={<InvoiceDetail />} />
                        <Route path="/vendors" element={<Vendors />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  ) : (
                    <Navigate to="/login" replace />
                  )}
                />
              </Routes>
            </Container>
          </main>
        </Box>
      </Box>
    </CssBaseline>
  );
}

export default App;
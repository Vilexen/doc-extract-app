import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  DashboardOutlined,
  InboxOutlined,
  UploadOutlined,
  BarChartOutlined,
  TabletOutlined,
  PersonOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getSummary } from '../controllers/analyticsController'; // This would be a thunk in reality

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    processedInvoices: 0,
    pendingReview: 0,
    totalAmount: 0,
    processingRate: 0,
    avgProcessingTime: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, we would call the analytics API here
        // For now, we'll use mock data
        const mockStats = {
          totalInvoices: 124,
          processedInvoices: 98,
          pendingReview: 15,
          totalAmount: 2456780.50,
          processingRate: 79,
          avgProcessingTime: 45
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Total Invoices"
                subheader="This month"
                icon={<DashboardOutlined sx={{ color: 'primary.main' }} />}
              </CardContent>
                <Typography variant="h3" align="center">
                  {stats.totalInvoices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Processed"
                subheader="Ready for export"
                icon={<InboxOutlined sx={{ color: 'success.main' }} />}
              </CardContent>
                <Typography variant="h3" align="center">
                  {stats.processedInvoices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Pending Review"
                subheader="Requires attention"
                icon={<UploadOutlined sx={{ color: 'warning.main' }} />}
              </CardContent>
                <Typography variant="h3" align="center">
                  {stats.pendingReview}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Total Value"
                subheader="INR"
                icon={<BarChartOutlined sx={{ color: 'info.main' }} />}
              </CardContent>
                <Typography variant="h3" align="center">
                  ₹{stats.totalAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional metrics */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Processing Rate"
                subheader="Percentage auto-processed"
                icon={{
                  fontSize: '2rem',
                  backgroundColor: 'success.light',
                  color: 'success.main',
                  p: 1,
                  borderRadius: 2,
                  '& > *': { fontSize: '1.5rem' }
                }}
              </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Typography variant="h2" align="center" color="success.main">
                    {stats.processingRate}%
                  </Typography>
                  <Typography variant="body2" align="center">
                    of invoices processed automatically
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Avg Processing Time"
                subheader="Per invoice"
                icon={{
                  fontSize: '2rem',
                  backgroundColor: 'info.light',
                  color: 'info.main',
                  p: 1,
                  borderRadius: 2,
                  '& > *': { fontSize: '1.5rem' }
                }}
              </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Typography variant="h2" align="center" color="info.main">
                    {stats.avgProcessingTime}s
                  </Typography>
                  <Typography variant="body2" align="center">
                    average processing time
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="User Role"
                subheader="Current permissions"
                icon={{
                  fontSize: '2rem',
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  p: 1,
                  borderRadius: 2,
                  '& > *': { fontSize: '1.5rem' }
                }}
              </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Typography variant="h5" align="center" color="primary.main">
                    {(user?.role || 'user').toUpperCase()}
                  </Typography>
                  <Typography variant="body2" align="center">
                    access level
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="System Status"
                subheader="Operational"
                icon={{
                  fontSize: '2rem',
                  backgroundColor: 'success.light',
                  color: 'success.main',
                  p: 1,
                  borderRadius: 2,
                  '& > *': { fontSize: '1.5rem' }
                }}
              </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Chip label="Online" color="success" />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    All systems operational
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick actions */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: 64, width: '100%' }}
                startIcon={<UploadOutlined />}
              >
                Upload New Invoice
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ height: 64, width: '100%' }}
                startIcon={<InboxOutlined />}
              >
                Review Invoices
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ height: 64, width: '100%' }}
                startIcon={<BarChartOutlined />}
              >
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
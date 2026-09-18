import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Divider,
  Chip,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import {
  BarChartOutlined,
  ShowChartOutlined,
  TrendingUpOutlined,
  InsertChartOutlined,
  PieChartOutlineOutlined,
  CheckCircleOutlineOutlined,
  DownloadOutlined,
  PrintOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAnalyticsSummary,
  fetchAnalyticsTrends,
  fetchVendorAnalytics,
  clearError
} from '../slices/analyticsSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { summary, trends, vendorStats, loading, error } = useSelector(state => state.analytics);
  const [timeRange, setTimeRange] = React.useState('30D'); // 7D, 30D, 90D, 1Y

  useEffect(() => {
    // Clear any previous error
    dispatch(clearError());
    // Fetch analytics data
    dispatch(fetchAnalyticsSummary());
    dispatch(fetchAnalyticsTrends({ timeRange }));
    dispatch(fetchVendorAnalytics({ limit: 10 })); // Top 10 vendors
  }, [dispatch, timeRange]);

  if (loading) {
    return (
      <Box sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Analytics
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={48} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Analytics Dashboard
          </Typography>
          <Select
            label="Time Range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ width: 200 }}
            labelId="time-range-label"
            id="time-range-select"
          >
            <MenuItem value="7D">Last 7 Days</MenuItem>
            <MenuItem value="30D">Last 30 Days</MenuItem>
            <MenuItem value="90D">Last 90 Days</MenuItem>
            <MenuItem value="1Y">Year to Date</MenuItem>
          </Select>
        </Box>

        {/* Snackbar for error messages */}
        {error && (
          <Snackbar open={true} autoHideDuration={6000}>
            <Alert onClose={() => dispatch(clearError())} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Summary Cards */}
        <Box sx={{ mb: 4 }}>
          {summary ? (
            <>
              <Typography variant="h5" gutterBottom>
                Overview
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Total Invoices"
                    subheader="Processed this period"
                    icon={<ShowChartOutlined sx={{ color: 'primary.main' }} />}
                  </CardHeader>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {summary.totalInvoices?.toLocaleString() || '0'}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Processing Rate"
                    subheader="Percentage auto-processed"
                    icon={<TrendingUpOutlined sx={{ color: 'success.main' }} />}
                  </CardHeader>
                  <CardContent>
                    <Typography variant="h3" align="center" color="success.main">
                      {summary.processingRate?.toFixed(1) || '0'}%
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Total Value"
                    subheader="INR processed"
                    icon={<InsertChartOutlined sx={{ color: 'info.main' }} />}
                  </CardHeader>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      ₹{summary.totalAmount?.toLocaleString() || '0'}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Avg Processing Time"
                    subheader="Per invoice (seconds)"
                    icon={<ShowChartOutlined sx={{ color: 'warning.main' }} />}
                  </CardHeader>
                  <CardContent>
                    <Typography variant="h3" align="center" color="warning.main">
                      {summary.avgProcessingTime?.toFixed(1) || '0'}s
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No analytics data available.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Charts Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trends
          </Typography>
          {trends ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Invoice Volume Trend"
                    subheader="Monthly invoice count"
                    icon={<BarChartOutlined sx={{ color: 'primary.main' }} />}
                  </CardHeader>
                  <CardContent>
                    {/* In a real app, we would render a chart here */}
                    <Box sx={{ pt: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        [Invoice Volume Chart Would Appear Here]
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Last 3 months: {trends.invoiceVolume?.map(v => v.value || 0).join(' → ') || 'N/A'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader
                      title="Processing Time Trend"
                      subheader="Average time per invoice"
                      icon={<TrendingUpOutlined sx={{ color: 'info.main' }} />}
                    </CardHeader>
                    <CardContent>
                      {/* In a real app, we would render a chart here */}
                      <Box sx={{ pt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          [Processing Time Chart Would Appear Here]
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Last 3 months: {trends.processingTime?.map(v => v.value || 0).join(' → ') || 'N/A'}s
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardHeader
                        title="Success Rate Trend"
                        subheader="Percentage requiring no manual review"
                        icon={<CheckCircleOutlineOutlined sx={{ color: 'success.main' }} />}
                      </CardHeader>
                      <CardContent>
                        {/* In a real app, we would render a chart here */}
                        <Box sx={{ pt: 4, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            [Success Rate Chart Would Appear Here]
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              Last 3 months: {trends.successRate?.map(v => v.value || 0).join(' → ') || 'N/A'}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
          : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No trend data available.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Vendor Performance */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Top Vendors by Invoice Count
          </Typography>
          {vendorStats ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
              {vendorStats.map((vendor) => (
                <Card key={vendor.vendorName} sx={{ height: '100%' }}>
                  <CardHeader
                    title={vendor.vendorName}
                    subheader={`GSTIN: ${vendor.vendorTaxId}`}
                    icon={<PersonOutlined sx={{ color: 'secondary.main' }} />}
                  </CardHeader>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography><b>Invoice Count:</b> {vendor.invoiceCount?.toLocaleString() || '0'}</Typography>
                      <Typography><b>Total Value:</b> ₹{vendor.totalAmount?.toLocaleString() || '0'}</Typography>
                      <Typography><b>Avg Invoice Value:</b> ₹{vendor.avgAmount?.toLocaleString() || '0'}</Typography>
                      <Typography><b>Processed:</b> {vendor.processedCount?.toLocaleString() || '0'} ({vendor.processingRate?.toFixed(1) || '0'}%)</Typography>
                      <Typography><b>Pending:</b> {vendor.pendingCount?.toLocaleString() || '0'}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No vendor data available.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Export Section */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<DownloadOutlined />}
          >
            Export Analytics Report
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="medium"
            startIcon={<PrintOutlined />}
            sx={{ ml: 2 }}
          >
            Print Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Analytics;
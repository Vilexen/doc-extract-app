import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  Stack,
  Divider,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  VisibilityOutlined,
  WarningOutlined,
  CheckCircleOutlineOutlined,
  UploadOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInvoices, clearError } from '../slices/invoiceSlice';

const Invoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items: invoices, total, loading, error } = useSelector(state => state.invoices);
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
    status: '',
    vendor_id: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    // Clear any previous error
    dispatch(clearError());
    // Fetch invoices with current filters
    dispatch(fetchInvoices(filters));
  }, [dispatch, filters.page, filters.limit, filters.status, filters.vendor_id, filters.startDate, filters.endDate, filters.search]);

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'grey';
      case 'processing': return 'info';
      case 'extracted': return 'orange';
      case 'validated': return 'blue';
      case 'reviewed': return 'purple';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'grey';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'processing': return 'Processing';
      case 'extracted': return 'Extracted';
      case 'validated': return 'Validated';
      case 'reviewed': return 'Reviewed';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Box sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Invoices
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
            Invoices
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<UploadOutlined />}
          >
            Upload New Invoice
          </Button>
        </Box>

        {/* Snackbar for error messages */}
        {error && (
          <Snackbar open={true} autoHideDuration={6000}>
            <Alert onClose={() => dispatch(clearError())} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Filters */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Search invoices"
              placeholder="Search by invoice number or vendor..."
              value={filters.search}
              onChange={handleSearchChange}
              sx={{ xs: 12, sm: 6 }}
              InputProps={{
                startAdornment: (
                  <InboxOutlined fontSize="small" />
                )
              }}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={handleStatusChange}
              sx={{ xs: 12, sm: 6 }}
              labelId="status-label"
              id="status-select"
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="extracted">Extracted</MenuItem>
              <MenuItem value="validated">Validated</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setFilters({ ...filters, page: 1, limit: 10, status: '', vendor_id: '', startDate: '', endDate: '', search: '' })}
              sx={{ xs: 12, sm: 'auto' }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        {/* Invoices Table */}
        <Box sx={{ mt: 2 }}>
          {invoices.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="invoice table">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell align="left">Vendor</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Confidence</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell component="th" scope="row">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell align="left">
                        {invoice.vendor_name || 'Unknown Vendor'}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {invoice.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusLabel(invoice.status)}
                          color={getStatusColor(invoice.status)}
                          sx={{ height: 24, fontSize: 0.875rem }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {invoice.confidence_score?.toFixed(1) ?? 0}%
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="View Details">
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => navigate(`/invoices/${invoice.id}`)}
                              startIcon={<VisibilityOutlined fontSize="small" />}
                            >
                              View
                            </Button>
                          </Tooltip>
                          <Tooltip title="Download">
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<DownloadOutlined fontSize="small" />}
                            >
                              Download
                            </Button>
                          </Tooltip>
                          {invoice.status === 'draft' || invoice.status === 'processing' ? (
                            <Tooltip title="Delete">
                              <Button
                                variant="text"
                                size="small"
                                color="error"
                                startIcon={<DeleteOutlined fontSize="small" />}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          ) : null}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No invoices found matching your criteria.
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {invoices.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page {filters.page} of {Math.ceil(total / filters.limit)} • {total} invoices
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={filters.page >= Math.ceil(total / filters.limit)}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Invoices;
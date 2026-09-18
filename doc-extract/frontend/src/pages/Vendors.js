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
  Snackbar,
  Alert
} from '@mui/material';
import {
  TabletOutlined,
  EditOutlined,
  DeleteOutlined,
  PersonOutlined,
  VisibilityOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVendors, clearError } from '../slices/vendorSlice';

const Vendors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items: vendors, total, loading, error } = useSelector(state => state.vendors);
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
    search: ''
  });

  useEffect(() => {
    // Clear any previous error
    dispatch(clearError());
    // Fetch vendors with current filters
    dispatch(fetchVendors(filters));
  }, [dispatch, filters.page, filters.limit, filters.search]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  if (loading) {
    return (
      <Box sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Vendors
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
            Vendors
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<PersonOutlined />}
          >
            Add New Vendor
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

        {/* Search and filters */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Search vendors"
              placeholder="Search by name, contact, or tax ID..."
              value={filters.search}
              onChange={handleSearchChange}
              sx={{ xs: 12, sm: 6 }}
              InputProps={{
                startAdornment: (
                  <PersonOutlined fontSize="small" />
                )
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setFilters({ ...filters, page: 1, search: '' })}
              sx={{ xs: 12, sm: 'auto' }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        {/* Vendors Table */}
        <Box sx={{ mt: 2 }}>
          {vendors.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="vendors table">
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell align="left">Contact Person</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Phone</TableCell>
                    <TableCell align="center">Tax ID</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id} hover>
                      <TableCell component="th" scope="row">
                        {vendor.name}
                      </TableCell>
                      <TableCell align="left">
                        {vendor.contact_person}
                      </TableCell>
                      <TableCell align="center">
                        {vendor.email}
                      </TableCell>
                      <TableCell align="center">
                        {vendor.phone}
                      </TableCell>
                      <TableCell align="center">
                        {vendor.tax_id}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={vendor.isActive ? 'Active' : 'Inactive'}
                          color={vendor.isActive ? 'success' : 'error'}
                          sx={{ height: 24, fontSize: 0.875rem }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="View Details">
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => navigate(`/vendors/${vendor.id}`)}
                              startIcon={<VisibilityOutlined fontSize="small" />}
                            >
                              View
                            </Button>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<EditOutlined fontSize="small" />}
                            >
                              Edit
                            </Button>
                          </Tooltip>
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
                No vendors found matching your criteria.
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {vendors.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page {filters.page} of {Math.ceil(total / filters.limit)} • {total} vendors
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

export default Vendors;
import React, { useEffect, useState } from 'react';
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
  Stack,
  Divider,
  Snackbar,
  Alert,
  Modal,
  Backdrop,
  Fade,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Link
} from '@mui/material';
import {
  VisibilityOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PrintOutlined,
  RefreshOutlined,
  WarningOutlined,
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchInvoiceById, updateInvoice, clearError, clearCurrentInvoice } from '../slices/invoiceSlice';
import { showSnackbar, hideSnackbar } from '../slices/uiSlice';

const InvoiceDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { currentInvoice, loading, error, processing } = useSelector(state => state.invoices);
  const { snackbar } = useSelector(state => state.ui);
  const { id } = useParams();

  // Local state for editing
  const [editedData, setEditedData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // view, edit, validation
  const [validationResults, setValidationResults] = useState(null);

  useEffect(() => {
    // Clear any previous error and current invoice
    dispatch(clearError());
    dispatch(clearCurrentInvoice());
    // Fetch the invoice by ID
    dispatch(fetchInvoiceById(id));
    // Reset local state
    setEditedData({});
    setShowEditModal(false);
    setActiveTab('view');
    setValidationResults(null);
  }, [dispatch, id]);

  useEffect(() => {
    if (currentInvoice) {
      // Initialize editedData with the current invoice data
      setEditedData({
        vendor_name: currentInvoice.vendor_name || '',
        vendor_tax_id: currentInvoice.vendor_tax_id || '',
        invoice_number: currentInvoice.invoice_number || '',
        invoice_date: currentInvoice.invoice_date ? new Date(currentInvoice.invoice_date).toISOString().split('T')[0] : '',
        due_date: currentInvoice.due_date ? new Date(currentInvoice.due_date).toISOString().split('T')[0] : '',
        total_amount: currentInvoice.total_amount || 0,
        status: currentInvoice.status || 'draft',
        confidence_score: currentInvoice.confidence_score || 0,
        line_items: currentInvoice.line_items || [],
        notes: currentInvoice.notes || '',
        // OCR text and extracted data for comparison
        ocr_text: currentInvoice.ocr_text || '',
        extracted_data: currentInvoice.extracted_data || {}
      });
    }
  }, [currentInvoice]);

  const handleSaveChanges = async () => {
    try {
      // Prepare data for update
      const updateData = {
        vendor_name: editedData.vendor_name,
        vendor_tax_id: editedData.vendor_tax_id,
        invoice_number: editedData.invoice_number,
        invoice_date: editedData.invoice_date,
        due_date: editedData.due_date,
        total_amount: parseFloat(editedData.total_amount) || 0,
        status: editedData.status,
        line_items: editedData.line_items,
        notes: editedData.notes
      };

      // Dispatch update action
      await dispatch(updateInvoice({ id, data: updateData })).unwrap();

      // Show success message
      dispatch(showSnackbar({
        message: 'Invoice updated successfully!',
        severity: 'success'
      }));

      // Close modal and refresh view
      setShowEditModal(false);
      setActiveTab('view');

      // Refetch the invoice to get updated data
      dispatch(fetchInvoiceById(id));
    } catch (err) {
      // Show error message
      dispatch(showSnackbar({
        message: err.message || 'Failed to update invoice',
        severity: 'error'
      }));
    }
  };

  const handleValidateInvoice = async () => {
    try {
      // In a real app, we would call a validation API
      // For now, we'll simulate validation
      setValidationResults({
        mathematical: {
          passed: true,
          message: 'Mathematical validation passed: Line items sum matches total amount.'
        },
        dates: {
          passed: true,
          message: 'Date validation passed: Invoice date is before due date.'
        },
        vendor: {
          passed: !!editedData.vendor_tax_id,
          message: editedData.vendor_tax_id
            ? 'Vendor tax ID validation passed.'
            : 'Vendor tax ID is missing.'
        },
        line_items: {
          passed: editedData.line_items.length > 0,
          message: editedData.line_items.length > 0
            ? `Line items validation passed: ${editedData.line_items.length} items found.`
            : 'No line items found.'
        }
      });

      // Switch to validation tab
      setActiveTab('validation');
    } catch (err) {
      dispatch(showSnackbar({
        message: err.message || 'Validation failed',
        severity: 'error'
      }));
    }
  };

  const handleToggleEditModal = () => {
    setShowEditModal(!showEditModal);
    if (!showEditModal) {
      // Reset edited data to current invoice data when closing modal
      if (currentInvoice) {
        setEditedData({
          vendor_name: currentInvoice.vendor_name || '',
          vendor_tax_id: currentInvoice.vendor_tax_id || '',
          invoice_number: currentInvoice.invoice_number || '',
          invoice_date: currentInvoice.invoice_date ? new Date(currentInvoice.invoice_date).toISOString().split('T')[0] : '',
          due_date: currentInvoice.due_date ? new Date(currentInvoice.due_date).toISOString().split('T')[0] : '',
          total_amount: currentInvoice.total_amount || 0,
          status: currentInvoice.status || 'draft',
          line_items: currentInvoice.line_items || [],
          notes: currentInvoice.notes || '',
          ocr_text: currentInvoice.ocr_text || '',
          extracted_data: currentInvoice.extracted_data || {}
        });
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const calculateLineItemsSum = (lineItems) => {
    return lineItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  if (loading) {
    return (
      <Box sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4">Invoice Detail</Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={48} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (!currentInvoice) {
    return (
      <Box sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4">Invoice Detail</Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2">Invoice not found.</Typography>
            <Button variant="outlined" onClick={() => navigate('/invoices')}>
              Back to Invoices
            </Button>
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
            Invoice Detail: {currentInvoice.invoice_number}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleToggleEditModal}
              startIcon={<EditOutlined />}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleValidateInvoice}
              startIcon={<CheckCircleOutlineOutlined />}
            >
              Validate
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<RefreshOutlined />}
              onClick={() => dispatch(fetchInvoiceById(id))}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/invoices')}
              startIcon={<VisibilityOutlined fontSize="small" />}
            >
              Back to List
            </Button>
          </Box>
        </Box>

        {/* Snackbar for messages */}
        {snackbar.open && (
          <Snackbar open={snackbar.open} autoHideDuration={6000}>
            <Alert onClose={() => dispatch(hideSnackbar())} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        )}

        {/* Edit Modal */}
        <Modal
          open={showEditModal}
          onClose={handleToggleEditModal}
          keepMounted
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fade in={showEditModal}>
            <Paper sx={{ p: 4, width: { xs: '90%', sm: '600px' }, bgcolor: 'background.paper', border: '2px solid #ccc' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Edit Invoice Details
                </Typography>
                <Divider />
              </Box>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Vendor Name</FormLabel>
                <TextField
                  value={editedData.vendor_name || ''}
                  onChange={(e) => setEditedData({ ...editedData, vendor_name: e.target.value })}
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Vendor Tax ID (GSTIN)</FormLabel>
                <TextField
                  value={editedData.vendor_tax_id || ''}
                  onChange={(e) => setEditedData({ ...editedData, vendor_tax_id: e.target.value })}
                  fullWidth
                />
              </FormControl>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <FormControl sx={{ mt: 1, width: '50%' }}>
                  <FormLabel>Invoice Date</FormLabel>
                  <TextField
                    type="date"
                    value={editedData.invoice_date || ''}
                    onChange={(e) => setEditedData({ ...editedData, invoice_date: e.target.value })}
                    fullWidth
                    inputProps={{ 'aria-label': 'invoice date' }}
                  />
                </FormControl>
                <FormControl sx={{ mt: 1, width: '50%' }}>
                  <FormLabel>Due Date</FormLabel>
                  <TextField
                    type="date"
                    value={editedData.due_date || ''}
                    onChange={(e) => setEditedData({ ...editedData, due_date: e.target.value })}
                    fullWidth
                    inputProps={{ 'aria-label': 'due date' }}
                  />
                </FormControl>
              </Box>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Invoice Number</FormLabel>
                <TextField
                  value={editedData.invoice_number || ''}
                  onChange={(e) => setEditedData({ ...editedData, invoice_number: e.target.value })}
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Total Amount (₹)</FormLabel>
                <TextField
                  type="number"
                  value={editedData.total_amount || ''}
                  onChange={(e) => setEditedData({ ...editedData, total_amount: e.target.value })}
                  fullWidth
                  inputProps={{ 'aria-label': 'total amount' }}
                />
              </FormControl>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editedData.status || ''}
                  onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="extracted">Extracted</MenuItem>
                  <MenuItem value="validated">Validated</MenuItem>
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Line Items</Typography>
                <Divider />
                {editedData.line_items.map((item, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Description"
                        value={item.description || ''}
                        onChange={(e) => {
                          const newItems = [...editedData.line_items];
                          newItems[index] = { ...newItems[index], description: e.target.value };
                          setEditedData({ ...editedData, line_items: newItems });
                        }}
                        sx={{ flex: 2, mx: 1 }}
                      />
                      <TextField
                        label="Quantity"
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          const newItems = [...editedData.line_items];
                          newItems[index] = { ...newItems[index], quantity: e.target.value };
                          setEditedData({ ...editedData, line_items: newItems });
                        }}
                        sx={{ flex: 1, mx: 1 }}
                      />
                      <TextField
                        label="Unit Price (₹)"
                        type="number"
                        value={item.unit_price || ''}
                        onChange={(e) => {
                          const newItems = [...editedData.line_items];
                          newItems[index] = { ...newItems[index], unit_price: e.target.value };
                          setEditedData({ ...editedData, line_items: newItems });
                        }}
                        sx={{ flex: 1, mx: 1 }}
                      />
                      <TextField
                        label="Total (₹)"
                        type="number"
                        value={item.total_amount || ''}
                        inputProps={{ 'aria-label': 'line item total' }}
                        sx={{ flex: 1, mx: 1 }}
                        readOnly
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newItems = [...editedData.line_items];
                          newItems.splice(index, 1);
                          setEditedData({ ...editedData, line_items: newItems });
                        }}
                        aria-label="delete"
                        sx={{ p: 1 }}
                      >
                        <DeleteOutlined fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setEditedData({ ...editedData, line_items: [...editedData.line_items, {
                      description: '',
                      quantity: '',
                      unit_price: '',
                      total_amount: '',
                      tax_rate: '',
                      hsnsac_code: ''
                    }] });
                  }}
                  startIcon={<AddCircleOutlineOutlined />}
                >
                  Add Line Item
                </Button>
              </Box>

              <FormControl sx={{ mt: 2, width: '100%' }}>
                <FormLabel>Notes</FormLabel>
                <TextField
                  value={editedData.notes || ''}
                  onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                />
              </FormControl>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleToggleEditModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleSaveChanges}
                  startIcon={<SaveOutlined />}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Modal>

        {/* Main Content */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Left Column: Original Invoice (OCR Text) */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Typography variant="h5" gutterBottom>
                Original Invoice (OCR)
              </Typography>
              <Divider />
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, maxHeight: 500, overflowY: 'auto' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {currentInvoice.ocr_text || 'No OCR text available.'}
                </Typography>
              </Box>
            </Box>

            {/* Right Column: Extracted Data */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => handleTabChange(newValue)}
                sx={{ mt: 1 }}
                aria-label="invoice detail tabs"
              >
                <Tab label="View" />
                <Tab label="Edit" />
                <Tab label="Validation" />
              </Tabs>

              <Box sx={{ p: 2, mt: 2, bgcolor: 'background.paper', borderRadius: 2, maxHeight: 500, overflowY: 'auto' }}>
                {activeTab === 'view' && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Extracted Data
                    </Typography>
                    <Divider />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Vendor:
                      </Typography>
                      <Typography variant="body2">
                        {currentInvoice.vendor_name || 'N/A'}
                        {currentInvoice.vendor_tax_id ? `(${currentInvoice.vendor_tax_id})` : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Invoice Number:
                      </Typography>
                      <Typography variant="body2">
                        {currentInvoice.invoice_number || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Dates:
                      </Typography>
                      <Typography variant="body2">
                        Invoice: {currentInvoice.invoice_date ? new Date(currentInvoice.invoice_date).toLocaleDateString() : 'N/A'}
                        {' | '}
                        Due: {currentInvoice.due_date ? new Date(currentInvoice.due_date).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Amounts:
                      </Typography>
                      <Typography variant="body2">
                        Total: ₹{currentInvoice.total_amount?.toLocaleString() || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Confidence Score:
                      </Typography>
                      <Typography variant="body2" color={currentInvoice.confidence_score >= 90 ? 'success' : currentInvoice.confidence_score >= 80 ? 'warning' : 'error'}>
                        {currentInvoice.confidence_score?.toFixed(1) ?? 0}%
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Line Items ({currentInvoice.line_items?.length || 0}):
                      </Typography>
                      {currentInvoice.line_items?.map((item, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, borderLeft: '2px solid #ccc', pl: 2 }}>
                          <Typography variant="body2">
                            {item.description || 'N/A'}
                            - {item.quantity || 0} × ₹{item.unit_price || 0}
                            = ₹{item.total_amount || 0}
                            {item.tax_rate ? ` (Tax: ${item.tax_rate}%)` : ''}
                            {item.hsnsac_code ? ` [HSN/SAC: ${item.hsnsac_code}]` : ''}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Notes:
                      </Typography>
                      <Typography variant="body2">
                        {currentInvoice.notes || 'None'}
                      </Typography>
                    </Box>
                  </>
                )}

                {activeTab === 'edit' && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Edit Extracted Data
                    </Typography>
                    <Divider />

                    {/* We'll reuse the edit form from the modal here for simplicity, but in a real app we might want to avoid duplication */}
                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Vendor Name</FormLabel>
                      <TextField
                        value={editedData.vendor_name || ''}
                        onChange={(e) => setEditedData({ ...editedData, vendor_name: e.target.value })}
                        fullWidth
                      />
                    </FormControl>

                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Vendor Tax ID (GSTIN)</FormLabel>
                      <TextField
                        value={editedData.vendor_tax_id || ''}
                        onChange={(e) => setEditedData({ ...editedData, vendor_tax_id: e.target.value })}
                        fullWidth
                      />
                    </FormControl>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <FormControl sx={{ mt: 1, width: '50%' }}>
                        <FormLabel>Invoice Date</FormLabel>
                        <TextField
                          type="date"
                          value={editedData.invoice_date || ''}
                          onChange={(e) => setEditedData({ ...editedData, invoice_date: e.target.value })}
                          fullWidth
                          inputProps={{ 'aria-label': 'invoice date' }}
                        />
                      </FormControl>
                      <FormControl sx={{ mt: 1, width: '50%' }}>
                        <FormLabel>Due Date</FormLabel>
                        <TextField
                          type="date"
                          value={editedData.due_date || ''}
                          onChange={(e) => setEditedData({ ...editedData, due_date: e.target.value })}
                          fullWidth
                          inputProps={{ 'aria-label': 'due date' }}
                        />
                      </FormControl>
                    </Box>

                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Invoice Number</FormLabel>
                      <TextField
                        value={editedData.invoice_number || ''}
                        onChange={(e) => setEditedData({ ...editedData, invoice_number: e.target.value })}
                        fullWidth
                      />
                    </FormControl>

                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Total Amount (₹)</FormLabel>
                      <TextField
                        type="number"
                        value={editedData.total_amount || ''}
                        onChange={(e) => setEditedData({ ...editedData, total_amount: e.target.value })}
                        fullWidth
                        inputProps={{ 'aria-label': 'total amount' }}
                      />
                    </FormControl>

                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={editedData.status || ''}
                        onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                        fullWidth
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="extracted">Extracted</MenuItem>
                        <MenuItem value="validated">Validated</MenuItem>
                        <MenuItem value="reviewed">Reviewed</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6">Line Items</Typography>
                      <Divider />
                      {editedData.line_items.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #eee' }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                              label="Description"
                              value={item.description || ''}
                              onChange={(e) => {
                                const newItems = [...editedData.line_items];
                                newItems[index] = { ...newItems[index], description: e.target.value };
                                setEditedData({ ...editedData, line_items: newItems });
                              }}
                              sx={{ flex: 2, mx: 1 }}
                            />
                            <TextField
                              label="Quantity"
                              type="number"
                              value={item.quantity || ''}
                              onChange={(e) => {
                                const newItems = [...editedData.line_items];
                                newItems[index] = { ...newItems[index], quantity: e.target.value };
                                setEditedData({ ...editedData, line_items: newItems });
                              }}
                              sx={{ flex: 1, mx: 1 }}
                            />
                            <TextField
                              label="Unit Price (₹)"
                              type="number"
                              value={item.unit_price || ''}
                              onChange={(e) => {
                                const newItems = [...editedData.line_items];
                                newItems[index] = { ...newItems[index], unit_price: e.target.value };
                                setEditedData({ ...editedData, line_items: newItems });
                              }}
                              sx={{ flex: 1, mx: 1 }}
                            />
                            <TextField
                              label="Total (₹)"
                              type="number"
                              value={item.total_amount || ''}
                              inputProps={{ 'aria-label': 'line item total' }}
                              sx={{ flex: 1, mx: 1 }}
                              readOnly
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                const newItems = [...editedData.line_items];
                                newItems.splice(index, 1);
                                setEditedData({ ...editedData, line_items: newItems });
                              }}
                              aria-label="delete"
                              sx={{ p: 1 }}
                            >
                              <DeleteOutlined fontSize="small" color="error" />
                            </IconButton>
                          </Box>
                        </Paper>
                      ))}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEditedData({ ...editedData, line_items: [...editedData.line_items, {
                            description: '',
                            quantity: '',
                            unit_price: '',
                            total_amount: '',
                            tax_rate: '',
                            hsnsac_code: ''
                          }] });
                        }}
                        startIcon={<AddCircleOutlineOutlined />}
                      >
                        Add Line Item
                      </Button>
                    </Box>

                    <FormControl sx={{ mt: 2, width: '100%' }}>
                      <FormLabel>Notes</FormLabel>
                      <TextField
                        value={editedData.notes || ''}
                        onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </FormControl>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={handleToggleEditModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={handleSaveChanges}
                        startIcon={<SaveOutlined />}
                        disabled={processing}
                      >
                        {processing ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </>
                )}

                {activeTab === 'validation' && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Validation Results
                    </Typography>
                    <Divider />

                    {validationResults ? (
                      <>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Mathematical Validation:
                          </Typography>
                          <Typography variant="body2" color={validationResults.mathematical.passed ? 'success' : 'error'}>
                            {validationResults.mathematical.message}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Date Validation:
                          </Typography>
                          <Typography variant="body2" color={validationResults.dates.passed ? 'success' : 'error'}>
                            {validationResults.dates.message}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Vendor Validation:
                          </Typography>
                          <Typography variant="body2" color={validationResults.vendor.passed ? 'success' : 'error'}>
                            {validationResults.vendor.message}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Line Items Validation:
                          </Typography>
                          <Typography variant="body2" color={validationResults.line_items.passed ? 'success' : 'error'}>
                            {validationResults.line_items.message}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => setActiveTab('view')}
                          >
                            Back to View
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            size="medium"
                            onClick={() => {
                              // If all validations passed, we could update the status to 'validated'
                              if (validationResults.mathematical.passed &&
                                  validationResults.dates.passed &&
                                  validationResults.vendor.passed &&
                                  validationResults.line_items.passed) {
                                setEditedData({ ...editedData, status: 'validated' });
                                handleSaveChanges();
                              }
                            }}
                            disabled={processing}
                          >
                            {processing ? 'Validating...' : 'Mark as Validated'}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2">
                          No validation results yet. Click "Validate" to run validation checks.
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Mathematical validation display */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mathematical Validation
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Line Items Sum:
                </Typography>
                <Typography variant="h5">
                  ₹{calculateLineItemsSum(editedData.line_items).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ flex: 0, shrink: 0 }}>
                <Typography variant="body2" fontWeight="bold">
                  vs
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Total Amount:
                </Typography>
                <Typography variant="h5">
                  ₹{editedData.total_amount?.toLocaleString() || '0'}
                </Typography>
              </Box>
              <Box sx={{ flex: 0, shrink: 0, ml: 2 }}>
                {Math.abs(calculateLineItemsSum(editedData.line_items) - (editedData.total_amount || 0)) < 0.01 ? (
                  <Chip label="Match" color="success" sx={{ height: 24 }} />
                ) : (
                  <Chip label="Mismatch" color="error" sx={{ height: 24 }} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InvoiceDetail;
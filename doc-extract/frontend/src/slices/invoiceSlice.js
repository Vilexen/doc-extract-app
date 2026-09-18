import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceService from '../services/api';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params, { rejectWithValue }) => {
    try {
      const response = await invoiceService.invoices.getInvoices(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.invoices.getInvoiceById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.invoices.updateInvoice(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.invoices.deleteInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const startInvoiceProcessing = createAsyncThunk(
  'invoices/startProcessing',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.invoices.startProcessing(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    currentInvoice: null,
    processing: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchInvoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // fetchInvoiceById
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // updateInvoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        // Update the item in the list
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Also update currentInvoice if it's the same
        if (state.currentInvoice && state.currentInvoice.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // deleteInvoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = state.total - 1;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // startInvoiceProcessing
      .addCase(startInvoiceProcessing.pending, (state) => {
        state.processing = true;
      })
      .addCase(startInvoiceProcessing.fulfilled, (state, action) => {
        state.processing = false;
        // Update the invoice status
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentInvoice && state.currentInvoice.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(startInvoiceProcessing.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload.message;
      });
  }
});

export const { clearError, clearCurrentInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
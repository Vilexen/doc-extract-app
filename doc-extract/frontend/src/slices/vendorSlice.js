import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorService from '../services/api';

// Async thunks
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vendorService.getVendors(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchVendorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vendorService.getVendorById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendors/createVendor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await vendorService.createVendor(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vendorService.updateVendor(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/deleteVendor',
  async (id, { rejectWithValue }) => {
    try {
      await vendorService.deleteVendor(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    currentVendor: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchVendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // fetchVendorById
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // createVendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, add the new vendor to the list
        state.items.unshift(action.payload);
        state.total = state.total + 1;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // updateVendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        // Update the item in the list
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Also update currentVendor if it's the same
        if (state.currentVendor && state.currentVendor.id === action.payload.id) {
          state.currentVendor = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // deleteVendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = state.total - 1;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  }
});

export const { clearError, clearCurrentVendor } = vendorSlice.actions;

export default vendorSlice.reducer;
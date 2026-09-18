import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/api';

// Async thunks
export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getSummary();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAnalyticsTrends = createAsyncThunk(
  'analytics/fetchTrends',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTrends(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchVendorAnalytics = createAsyncThunk(
  'analytics/fetchVendorAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getVendors(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    summary: null,
    trends: null,
    vendorStats: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAnalyticsSummary
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // fetchAnalyticsTrends
      .addCase(fetchAnalyticsTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchAnalyticsTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // fetchVendorAnalytics
      .addCase(fetchVendorAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorStats = action.payload;
      })
      .addCase(fetchVendorAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  }
});

export const { clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
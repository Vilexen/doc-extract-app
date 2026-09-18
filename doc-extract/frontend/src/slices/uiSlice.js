import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    snackbar: {
      open: false,
      message: '',
      severity: 'info' // info, success, warning, error
    },
    sidebarOpen: true, // for desktop
    currentStep: 0 // for wizard or multi-step forms
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showSnackbar: (state, action) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity || 'info';
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    }
  }
});

export const {
  setLoading,
  showSnackbar,
  hideSnackbar,
  toggleSidebar,
  setSidebarOpen,
  setCurrentStep
} = uiSlice.actions;

export default uiSlice.reducer;
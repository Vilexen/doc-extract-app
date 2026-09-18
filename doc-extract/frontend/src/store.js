import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import reducers (to be created)
import authReducer from './slices/authSlice';
import invoiceReducer from './slices/invoiceSlice';
import vendorReducer from './slices/vendorSlice';
import uiReducer from './slices/uiSlice';
import analyticsReducer from './slices/analyticsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // only persist auth state
};

// Create persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    invoices: invoiceReducer,
    vendors: vendorReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

export default store;
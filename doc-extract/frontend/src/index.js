import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';

// Create root container
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Service worker registration (for PWA capabilities in future)
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}

function registerServiceWorker() {
  // Placeholder for service worker registration
  // In production, this would cache assets for offline use
  console.log('Service worker registration placeholder');
}
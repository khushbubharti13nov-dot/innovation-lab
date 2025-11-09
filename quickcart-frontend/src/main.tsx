import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import './assets/styles/main.scss';

import { AuthProvider } from './contexts/AuthContext'; // <-- Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap the app */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
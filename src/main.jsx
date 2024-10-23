import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './routes/Router';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './contexts/store.contsxt';
import { AuthProvider } from './contexts/auth.context';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  </React.StrictMode>
);
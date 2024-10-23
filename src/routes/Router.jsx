import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Dashbord from '../pages/Dashbord';
import Register from '../pages/Register';
import Login from '../pages/Login';
import { StoreProvider } from '../contexts/store.contsxt';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ใช้ Layout เป็น element หลัก
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'dashbord',
        element: (
          <StoreProvider>
            <Dashbord />
          </StoreProvider>
        ),
      },
    {
        path: 'register',
        element: <Register />,
    },

    {
        path: 'login',
        element: <Login />,
    },
      // เพิ่มเส้นทางอื่น ๆ ตามต้องการ
    ],
  },
]);


export default router;
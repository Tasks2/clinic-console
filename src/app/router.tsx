import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/AppLayout'
import LoginPage from '../pages/LoginPage'
import StockPage from '../pages/StockPage'
import StockDetailPage from '../pages/StockDetailPage'
import ProtectedRoute from '../features/auth/protectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <StockPage />,
          },
          {
            path: '/stock',
            element: <StockPage />,
          },
          {
            path: '/stock/:id',
            element: <StockDetailPage />,
          },
        ],
      },
    ],
  },
])

import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import StockPage from '../pages/StockPage'
import StockDetailPage from '../pages/StockDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/stock',
    element: <StockPage />,
  },
  {
    path: '/stock/:id',
    element: <StockDetailPage />,
  },
])

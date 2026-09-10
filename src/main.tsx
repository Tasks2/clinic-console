import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
// import App from './App.tsx'
import { router } from './app/router.tsx'
import { queryClient } from './lib/queryClient.ts'
import { AuthProvider } from './features/auth/authContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
       <RouterProvider router={router} />
      {/* <App/> */}
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)

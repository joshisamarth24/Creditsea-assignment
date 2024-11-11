import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from './components/ui/button'
import VerifierDashboard from './pages/VerifierDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ApplicationForm from './pages/ApplicationForm'
import LoanDashboard from './pages/LoanDashboard'
import AuthForm from './pages/AuthForm'
import { Toaster } from 'react-hot-toast'
import Users from './pages/Users'


const PrivateRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token')
  
  if (!isAuthenticated) {
    // Redirect them to the auth page if not authenticated
    return <Navigate to="/auth" />
  }
  
  return children
}

const App = () => {
  return (
    
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public route - Authentication */}
        <Route path="/auth" element={<AuthForm />} />
        
        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/verifier"
          element={
            <PrivateRoute>
              <VerifierDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/application"
          element={
            <PrivateRoute>
              <ApplicationForm />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/loans"
          element={
            <PrivateRoute>
              <LoanDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Redirect root to auth page */}
        <Route path="/" element={<Navigate to="/auth" />} />
        
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
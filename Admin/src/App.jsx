import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
// Admin dashboard component is defined in AdminDashboard.jsx
import AdminDashboard from './pages/AdminDashboard'
import AddAdmin from './pages/AddAdmin'
import AdminContextProvider from './context/AdmineContext'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/" replace />
}

const App = () => {
  const [isLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AdminContextProvider>
                <AdminDashboard />
              </AdminContextProvider>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-management" 
          element={
            <ProtectedRoute>
              <AdminContextProvider>
                <AddAdmin />
              </AdminContextProvider>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

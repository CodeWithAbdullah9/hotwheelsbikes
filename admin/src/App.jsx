import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import api from './api'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import POS from './pages/POS'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Logs from './pages/Logs'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function ProtectedRoute({ children }) {
  const { admin } = useAuth()
  if (!admin) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hw_admin')) } catch { return null }
  })

  const login = (token, adminData) => {
    localStorage.setItem('hw_token', token)
    localStorage.setItem('hw_admin', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('hw_token')
    localStorage.removeItem('hw_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={admin ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="inventory"  element={<Inventory />} />
            <Route path="orders"     element={<Orders />} />
            <Route path="pos"        element={<POS />} />
            <Route path="customers"  element={<Customers />} />
            <Route path="reports"    element={<Reports />} />
            <Route path="settings"   element={<Settings />} />
            <Route path="logs"       element={<Logs />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

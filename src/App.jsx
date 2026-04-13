import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'

function AppInner() {
  const { token, user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  if (token) return user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />
  if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />
  return <LandingPage onGetStarted={() => setShowAuth(true)} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

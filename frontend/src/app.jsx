import './app.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/login/login'
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
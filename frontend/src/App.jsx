import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StudyPlan from './pages/StudyPlan'
import Analytics from './pages/Analytics'
import Assistant from './pages/Assistant'
import MissedTasks from './pages/MissedTasks'
import Profile from './pages/Profile' 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="plan" element={<StudyPlan />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="missed" element={<MissedTasks />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
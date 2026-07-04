import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HeroPage from './pages/HeroPage'
import ExercisesPage from './pages/ExercisesPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import LeaderboardPage from './pages/LeaderboardPage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HeroPage />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

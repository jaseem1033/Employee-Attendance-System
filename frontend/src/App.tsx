import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import Profile from './pages/Profile'
import Checkin from './pages/Checkin'
import MyHistory from './pages/MyHistory'
import AttendanceHistory from './pages/AttendanceHistory'
import MySummary from './pages/MySummary'
import AllAttendance from './pages/AllAttendance'
import ManagerReports from './pages/ManagerReports'
import NavBar from './components/NavBar'
import { useAppSelector } from './store/store'

export default function App() {
  const auth = useAppSelector((s) => s.auth)
  const location = useLocation()
  const hideNavPaths = ['/login', '/register']
  const showNav = !hideNavPaths.some(p => location.pathname.startsWith(p))

  return (
    <div>
      {showNav && <NavBar />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to={auth.user ? (auth.user.role === 'manager' ? '/manager' : '/employee') : '/login'} replace />} />
          <Route
            path="/login"
            element={
              auth.user ? (
                <Navigate to={auth.user.role === 'manager' ? '/manager' : '/employee'} replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              auth.user ? (
                <Navigate to={auth.user.role === 'manager' ? '/manager' : '/employee'} replace />
              ) : (
                <Register />
              )
            }
          />

          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/checkin" element={<Checkin />} />
          <Route path="/employee/history" element={<AttendanceHistory />} />
          <Route path="/employee/summary" element={<MySummary />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/all" element={<AllAttendance />} />
          <Route path="/manager/reports" element={<ManagerReports />} />

        </Routes>
      </main>
    </div>
  )
}

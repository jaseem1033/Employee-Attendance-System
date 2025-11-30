import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import Checkin from './pages/Checkin'
import MyHistory from './pages/MyHistory'
import MySummary from './pages/MySummary'
import AllAttendance from './pages/AllAttendance'
import NavBar from './components/NavBar'
import { useAppSelector } from './store/store'

export default function App() {
  const auth = useAppSelector((s) => s.auth)

  return (
    <div>
      <NavBar />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to={auth.user ? (auth.user.role === 'manager' ? '/manager' : '/employee') : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/checkin" element={<Checkin />} />
          <Route path="/employee/history" element={<MyHistory />} />
          <Route path="/employee/summary" element={<MySummary />} />

          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/all" element={<AllAttendance />} />

        </Routes>
      </main>
    </div>
  )
}

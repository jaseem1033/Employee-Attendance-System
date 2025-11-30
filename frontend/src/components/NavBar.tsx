import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { useAppSelector, useAppDispatch } from '../store/store'
import { logout } from '../store/authSlice'

export default function NavBar() {
  const auth = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <header className="site-header">
      <Link to="/" className="site-brand">
        <img src={logo} alt="Employee Attendance System logo" className="brand-logo" />
        <div className="site-title">Employee Attendance System</div>
      </Link>

      <nav className="nav-links">
        {!auth.user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {auth.user && auth.user.role === 'employee' && (
          <>
            <Link to="/employee/history" className="nav-link">Attendance History</Link>
          </>
        )}

        {auth.user && auth.user.role === 'manager' && (
          <>
            <Link to="/manager/reports" className="nav-link">Reports</Link>
          </>
        )}

        {auth.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/profile" className="profile-pill">
              <div className="avatar">{(auth.user.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <span style={{ fontSize: 14 }}>{auth.user.name}</span>
            </Link>
            <button className="logout-btn" onClick={() => { dispatch(logout()); navigate('/login', { replace: true }) }}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}

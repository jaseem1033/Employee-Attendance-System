import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/store'
import { logout } from '../store/authSlice'

export default function NavBar() {
  const auth = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 6, background: 'linear-gradient(180deg,#2563eb,#4f46e5)' }} aria-hidden />
        <Link to="/" style={{ fontWeight: 700, color: '#0f1724', textDecoration: 'none' }}>Employee Attendance System</Link>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {!auth.user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {auth.user && auth.user.role === 'employee' && (
          <>
            <Link to="/employee/history">Attendance History</Link>
          </>
        )}

        {auth.user && auth.user.role === 'manager' && (
          <>
            {/* Manager Dashboard removed from navbar; keep other manager links */}
            <Link to="/manager/reports">Reports</Link>
          </>
        )}

        {auth.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#0f1724' }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: '#e6eefc', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(auth.user.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <span style={{ fontSize: 14 }}>{auth.user.name}</span>
            </Link>
            <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }} onClick={() => { dispatch(logout()); navigate('/login', { replace: true }) }}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}

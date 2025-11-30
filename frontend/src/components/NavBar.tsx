import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/store'
import { logout } from '../store/authSlice'

export default function NavBar() {
  const auth = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <span style={{ marginLeft: 12 }} />
      {!auth.user && (
        <>
          <Link to="/login">Login</Link>
          <span style={{ marginLeft: 8 }} />
          <Link to="/register">Register</Link>
        </>
      )}

      {auth.user && auth.user.role === 'employee' && (
        <>
          <Link to="/employee">Dashboard</Link>
          <span style={{ marginLeft: 8 }} />
          <Link to="/employee/history">History</Link>
        </>
      )}

      {auth.user && auth.user.role === 'manager' && (
        <>
          <Link to="/manager">Dashboard</Link>
          <span style={{ marginLeft: 8 }} />
          <Link to="/manager/all">All Attendance</Link>
        </>
      )}

      {auth.user && (
        <button style={{ marginLeft: 12 }} onClick={() => dispatch(logout())}>Logout</button>
      )}
    </nav>
  )
}

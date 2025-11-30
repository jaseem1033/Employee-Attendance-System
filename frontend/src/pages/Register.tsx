import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { register } from '../store/authSlice'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [department, setDepartment] = useState('')
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)
  const navigate = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(register({ name, email, password, role, department })).unwrap()
      navigate('/login')
    } catch (err) {}
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p className="muted">Register a new employee or manager account</p>
        </div>

        <form onSubmit={handle} className="auth-form" aria-label="register form">
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input id="name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email address</label>
            <input id="email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
          </div>

          <div className="form-row">
            <label htmlFor="department">Department</label>
            <input id="department" className="input" value={department} onChange={e => setDepartment(e.target.value)} placeholder="Engineering" />
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {auth.error && <div className="error" role="alert">{auth.error}</div>}

          <div className="form-row">
            <button className="btn btn-primary" type="submit" disabled={auth.loading}>{auth.loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>

        <div className="auth-footer muted">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}

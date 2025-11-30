import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { login } from '../store/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)
  const navigate = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res: any = await dispatch(login({ email, password })).unwrap()
      if (res.user.role === 'manager') navigate('/manager')
      else navigate('/employee')
    } catch (err) {
      // error is handled in slice; keep UI responsive
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p className="muted">Sign in to your account</p>
        </div>

        <form onSubmit={handle} className="auth-form" aria-label="login form">
          <div className="form-row">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-row form-row-inline">
            <label className="checkbox">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link to="/register" className="link-small">Create account</Link>
          </div>

          {auth.error && <div className="error" role="alert">{auth.error}</div>}

          <div className="form-row">
            <button className="btn btn-primary" type="submit" disabled={auth.loading}>
              {auth.loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="auth-footer muted">By signing in you agree to your company policies.</div>
      </div>
    </div>
  )
}

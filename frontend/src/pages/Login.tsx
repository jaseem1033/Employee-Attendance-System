import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { login } from '../store/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)
  const navigate = useNavigate()



  
  const computeErrors = (overrides?: { email?: string; password?: string }) => {
    const errs: Record<string,string> = {}
    const emailVal = overrides?.email ?? email
    const passwordVal = overrides?.password ?? password
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(emailVal.trim())) errs.email = 'Please enter a valid email address'
    if (!passwordVal || passwordVal.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }
  
  const validate = () => {
    const errs = computeErrors()
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  
  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!validate()) return
    try {
        const res: any = await dispatch(login({ email: email.trim(), password })).unwrap()
        // Replace history entry so Back doesn't return to login
        navigate(res.user.role === 'manager' ? '/manager' : '/employee', { replace: true });
    } catch (err) {
      // error is handled in slice
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="form-title">Employee Attendance System</div>
        <div className="auth-header" style={{ textAlign: 'left', marginBottom: 8 }}>
          <h1>Welcome Back</h1>
          <p className="muted">Sign in to your account</p>
        </div>

        <form onSubmit={handle} className="auth-form" aria-label="login form" noValidate>
          <div className="form-row">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={e => {
                const v = e.target.value
                setEmail(v)
                setTouched(t => ({ ...t, email: true }))
                setErrors(computeErrors({ email: v }))
              }}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              placeholder="you@company.com"
              required
            />
            {(errors.email && (touched.email || submitted)) && <div className="error" role="alert">{errors.email}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={e => {
                const v = e.target.value
                setPassword(v)
                setTouched(t => ({ ...t, password: true }))
                setErrors(computeErrors({ password: v }))
              }}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              placeholder="••••••••"
              required
            />
            {(errors.password && (touched.password || submitted)) && <div className="error" role="alert">{errors.password}</div>}
          </div>

          {/* removed remember checkbox and forgot-password link per request */}

          {auth.error && <div className="error" role="alert">{auth.error}</div>}

          <div className="form-row btn-row">
            <button className="btn btn-primary" type="submit" disabled={auth.loading || Object.keys(computeErrors()).length > 0} onClick={() => setSubmitted(true)}>
              {auth.loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate('/register')}>Register</button>
          </div>
        </form>

        <div className="auth-footer muted">By signing in you agree to your company policies.</div>
      </div>
    </div>
  )
}

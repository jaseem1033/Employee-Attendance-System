import React, { useState, useEffect } from 'react'
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

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const computeErrors = () => {
    const errs: Record<string, string> = {}
    if (!name || name.trim().length < 2) errs.name = 'Please enter your full name'
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) errs.email = 'Please enter a valid email address'

    // password: min 8, at least one uppercase and one lowercase
    const pwdRe = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!pwdRe.test(password)) errs.password = 'Password must be 8+ chars with upper and lower case letters'

    // role must be valid
    if (!['employee', 'manager'].includes(role)) errs.role = 'Invalid role selected'

    // department required
    if (!department || department.trim().length === 0) errs.department = 'Please enter your department'

    return errs
  }

  const validate = () => {
    const errs = computeErrors()
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // run validation live while user types so errors clear and submit becomes available
  useEffect(() => {
    // keep errors state in sync but don't force-show them — we only display when touched or after submit
    setErrors(computeErrors())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, role, department])

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const res: any = await dispatch(register({ name: name.trim(), email: email.trim(), password, role, department: department.trim() })).unwrap()
      const message = res?.message || 'Registration successful'
      setSuccess(message)
      // wait briefly so user sees success message, then navigate to login (replace history)
      setTimeout(() => navigate('/login', { replace: true }), 1400)
    } catch (err) {}
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p className="muted">Register a new employee or manager account</p>
        </div>

        <form onSubmit={handle} className="auth-form" aria-label="register form" noValidate>
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input id="name" className="input" value={name} onChange={e => setName(e.target.value)} onBlur={() => setTouched(t => ({ ...t, name: true }))} placeholder="Jane Doe" required />
            {(errors.name && (touched.name || submitted)) && <div className="error" role="alert">{errors.name}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="email">Email address</label>
            <input id="email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email: true }))} placeholder="you@company.com" required />
            {(errors.email && (touched.email || submitted)) && <div className="error" role="alert">{errors.email}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setTouched(t => ({ ...t, password: true }))} placeholder="Minimum 8 characters" required />
            {(errors.password && (touched.password || submitted)) && <div className="error" role="alert">{errors.password}</div>}
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>Minimum 8 characters, including UPPER and lower case letters.</div>
          </div>

          <div className="form-row">
            <label htmlFor="department">Department</label>
            <input id="department" className="input" value={department} onChange={e => setDepartment(e.target.value)} onBlur={() => setTouched(t => ({ ...t, department: true }))} placeholder="Engineering" />
            {(errors.department && (touched.department || submitted)) && <div className="error" role="alert">{errors.department}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" className="input" value={role} onChange={e => setRole(e.target.value)} onBlur={() => setTouched(t => ({ ...t, role: true }))}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
            {(errors.role && (touched.role || submitted)) && <div className="error" role="alert">{errors.role}</div>}
          </div>

          {auth.error && <div className="error" role="alert">{auth.error}</div>}

          <div className="form-row">
            <button className="btn btn-primary" type="submit" disabled={auth.loading || Object.keys(computeErrors()).length > 0} onClick={() => setSubmitted(true)}>{auth.loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>

        {success && <div className="success" role="status" style={{ marginTop: 12 }}>{success}</div>}

        <div className="auth-footer muted">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { login } from '../store/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      // ignore; error in slice
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handle}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      {auth.error && <div style={{ color: 'red' }}>{auth.error}</div>}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

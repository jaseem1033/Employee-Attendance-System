import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { register } from '../store/authSlice'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)
  const navigate = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(register({ name, email, password, role })).unwrap()
      navigate('/login')
    } catch (err) {}
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={handle}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {auth.error && <div style={{ color: 'red' }}>{auth.error}</div>}
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

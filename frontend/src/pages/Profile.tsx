import React, { useEffect, useState } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

type User = { id: number; name: string; email: string; role: string; employeeId?: string; department?: string; created_at?: string }

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await client.get('/auth/me')
        if (cancelled) return
        setUser(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || 'Failed to load profile')
        // if 401, redirect to login
        if (err?.response?.status === 401) {
          navigate('/login', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [navigate])

  if (loading) return <div>Loading profile…</div>
  if (error) return <div className="error" role="alert">{error}</div>
  if (!user) return <div>No user data</div>
  return (
    <div className="profile-page">
      <div className="profile-card card">
        <div className="profile-header">
          <div className="avatar-large" aria-hidden>
            {(user.name || 'U').split(' ').map(n => n[0]).slice(0,2).join('')}
          </div>
          <div className="profile-title">
            <h2 className="title">Profile</h2>
            <div className="subtitle muted">Manage your account details</div>
          </div>
        </div>

        <div className="profile-body">
          <div className="kv-grid">
            <div className="kv">
              <div className="kv-label">Name</div>
              <div className="kv-value kv-important">{user.name}</div>
            </div>

            <div className="kv">
              <div className="kv-label">Email</div>
              <div className="kv-value kv-important">{user.email}</div>
            </div>

            <div className="kv">
              <div className="kv-label">Role</div>
              <div className="kv-value">{user.role}</div>
            </div>

            <div className="kv">
              <div className="kv-label">Employee ID</div>
              <div className="kv-value">{user.employeeId || (user as any).employee_id || '-'}</div>
            </div>

            <div className="kv">
              <div className="kv-label">Department</div>
              <div className="kv-value">{user.department || '-'}</div>
            </div>

            <div className="kv">
              <div className="kv-label">Created At</div>
              <div className="kv-value">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

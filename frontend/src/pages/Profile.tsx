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
    <div>
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 720 }}>
        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Name</div>
          <div style={{ fontWeight: 700 }}>{user.name}</div>
        </div>
        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Email</div>
          <div>{user.email}</div>
        </div>

        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Role</div>
          <div>{user.role}</div>
        </div>
        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Employee ID</div>
          <div>{user.employeeId || (user as any).employee_id || '-'}</div>
        </div>

        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Department</div>
          <div>{user.department || '-'}</div>
        </div>
        <div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Created At</div>
          <div>{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
        </div>
      </div>
    </div>
  )
}

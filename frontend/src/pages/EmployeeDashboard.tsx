import React, { useState, useEffect, useCallback } from 'react'
import { useAppSelector } from '../store/store'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function EmployeeDashboard() {
  const auth = useAppSelector(s => s.auth)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState<any | null>(null)
  const [loadingDashboard, setLoadingDashboard] = useState(false)

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true)
    try {
      const res = await client.get('/dashboard/employee')
      setDashboard(res.data)
    } catch (err) {
      setDashboard(null)
    } finally {
      setLoadingDashboard(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  // derive display values from loaded dashboard
  const stats = React.useMemo(() => {
    if (!dashboard) return {
      todayStatus: loadingDashboard ? 'Loading…' : 'Not checked in',
      present: '-',
      absent: '-',
      late: '-',
      totalHours: '-'
    }

    const today = dashboard.todayStatus?.status ? dashboard.todayStatus.status.replace('_', ' ') : 'Not checked in'

    const monthly = dashboard.monthlySummary || {}

    // sum totalHours from history array
    const history = Array.isArray(dashboard.history) ? dashboard.history : []
    const totalHours = history.reduce((acc: number, item: any) => {
      const v = Number(item.totalHours ?? item.total_hours ?? 0)
      return acc + (isNaN(v) ? 0 : v)
    }, 0)

    return {
      todayStatus: today,
      present: monthly.present ?? 0,
      absent: monthly.absent ?? 0,
      late: monthly.late ?? 0,
      totalHours: `${totalHours}h`
    }
  }, [dashboard, loadingDashboard])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">Employee Dashboard</div>
          <div className="dashboard-sub muted">Welcome back{auth.user ? `, ${auth.user.name}` : ''}</div>
        </div>

        <div className="actions">
          <Link to="/employee/checkin"><button className="btn btn-primary">Mark Attendance</button></Link>
          <button
            className="btn btn-primary"
            onClick={async () => {
              setLoading(true)
              try {
                await client.post('/attendance/checkin', {})
                setMessage('Checked in')
                // refresh dashboard after successful checkin
                await loadDashboard()
              } catch (err: any) {
                const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
                const lower = (apiMsg || '').toLowerCase()
                if (lower.includes('already checked in')) setMessage('You have already checked in today')
                else setMessage(apiMsg || 'Error')
              } finally {
                setLoading(false)
                setTimeout(() => setMessage(''), 3500)
              }
            }}
            disabled={loading}
          >
            Quick Check In
          </button>

          <button
            className="btn btn-primary"
            onClick={async () => {
              setLoading(true)
              try {
                await client.post('/attendance/checkout', {})
                setMessage('Checked out')
                // refresh dashboard after successful checkout
                await loadDashboard()
              } catch (err: any) {
                const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
                const lower = (apiMsg || '').toLowerCase()
                if (lower.includes('already checked out')) setMessage('You have already checked out today')
                else if (lower.includes('have not checked in')) setMessage('You have not checked in today')
                else setMessage(apiMsg || 'Error')
              } finally {
                setLoading(false)
                setTimeout(() => setMessage(''), 3500)
              }
            }}
            disabled={loading}
          >
            Quick Check Out
          </button>

          <Link to="/employee/history"><button className="btn btn-primary">View My Attendance History</button></Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-present">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-label">Today's status</div>
            <div className="stat-value">{stats.todayStatus}</div>
          </div>
        </div>

        <div className="stat-card stat-present">
          <div className="stat-icon">●</div>
          <div className="stat-content">
            <div className="stat-label">Present this month</div>
            <div className="stat-value">{stats.present}</div>
          </div>
        </div>

        <div className="stat-card stat-absent">
          <div className="stat-icon">✕</div>
          <div className="stat-content">
            <div className="stat-label">Absent this month</div>
            <div className="stat-value">{stats.absent}</div>
          </div>
        </div>

        <div className="stat-card stat-late">
          <div className="stat-icon">!</div>
          <div className="stat-content">
            <div className="stat-label">Late this month</div>
            <div className="stat-value">{stats.late}</div>
          </div>
        </div>

        <div className="stat-card stat-hours">
          <div className="stat-icon">🕒</div>
          <div className="stat-content">
            <div className="stat-label">Total hours (month)</div>
            <div className="stat-value">{stats.totalHours}</div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ marginTop: 4, color: message.toLowerCase().includes('error') ? 'red' : 'green' }}>{message}</div>
      )}

      <div>
        <h3 style={{ marginBottom: 8 }}>Recent History</h3>
        {loadingDashboard && <div>Loading history…</div>}
        {!loadingDashboard && dashboard && Array.isArray(dashboard.history) && (
          <div className="card history-card">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.history.map((r: any) => (
                  <tr key={r.date + (r.checkInTime || r.check_in_time || '')}>
                    <td>{r.date}</td>
                    <td>{r.status}</td>
                    <td>{r.checkInTime ?? r.check_in_time}</td>
                    <td>{r.checkOutTime ?? r.check_out_time}</td>
                    <td>{r.totalHours ?? r.total_hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


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
      totalHours: '-',
      todayStatusType: 'unknown'
    }

    const today = dashboard.todayStatus?.status ? dashboard.todayStatus.status.replace('_', ' ') : 'Not checked in'
    const todayStatusType = dashboard.todayStatus?.status?.toLowerCase() || 'unknown'

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
      totalHours: `${totalHours}h`,
      todayStatusType
    }
  }, [dashboard, loadingDashboard])

  const getStatusBadgeClass = (status: string) => {
    const lower = status.toLowerCase()
    if (lower.includes('present') || lower.includes('checked_in')) return 'status-present'
    if (lower.includes('absent')) return 'status-absent'
    if (lower.includes('late')) return 'status-late'
    return 'status-unknown'
  }

  return (
    <div className="employee-dashboard">
      {/* Header Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-greeting">
            <h1 className="hero-title">Welcome back{auth.user ? `, ${auth.user.name?.split(' ')[0]}` : ''}</h1>
            <p className="hero-subtitle">Here's your attendance overview for today</p>
          </div>
          <div className="hero-actions">
            <Link to="/employee/checkin" className="btn-action btn-action-primary">
              <span className="btn-icon">📅</span>
              <span>Mark Attendance</span>
            </Link>
            <Link to="/employee/history" className="btn-action btn-action-secondary">
              <span className="btn-icon">📊</span>
              <span>View History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn quick-action-checkin"
            onClick={async () => {
              setLoading(true)
              try {
                await client.post('/attendance/checkin', {})
                setMessage('Successfully checked in!')
                await loadDashboard()
              } catch (err: any) {
                const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
                const lower = (apiMsg || '').toLowerCase()
                if (lower.includes('already checked in')) setMessage('You have already checked in today')
                else setMessage(apiMsg || 'Error checking in')
              } finally {
                setLoading(false)
                setTimeout(() => setMessage(''), 3500)
              }
            }}
            disabled={loading}
          >
            <div className="quick-action-icon">✓</div>
            <div className="quick-action-content">
              <div className="quick-action-label">Check In</div>
              <div className="quick-action-desc">Start your work day</div>
            </div>
          </button>

          <button
            className="quick-action-btn quick-action-checkout"
            onClick={async () => {
              setLoading(true)
              try {
                await client.post('/attendance/checkout', {})
                setMessage('Successfully checked out!')
                await loadDashboard()
              } catch (err: any) {
                const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
                const lower = (apiMsg || '').toLowerCase()
                if (lower.includes('already checked out')) setMessage('You have already checked out today')
                else if (lower.includes('have not checked in')) setMessage('You have not checked in today')
                else setMessage(apiMsg || 'Error checking out')
              } finally {
                setLoading(false)
                setTimeout(() => setMessage(''), 3500)
              }
            }}
            disabled={loading}
          >
            <div className="quick-action-icon">✓</div>
            <div className="quick-action-content">
              <div className="quick-action-label">Check Out</div>
              <div className="quick-action-desc">End your work day</div>
            </div>
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`alert-message ${message.toLowerCase().includes('error') || message.toLowerCase().includes('already') || message.toLowerCase().includes('not checked') ? 'alert-error' : 'alert-success'}`}>
          <span className="alert-icon">{message.toLowerCase().includes('error') || message.toLowerCase().includes('already') || message.toLowerCase().includes('not checked') ? '⚠️' : '✓'}</span>
          <span>{message}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-section">
        <h2 className="section-title">Monthly Overview</h2>
        <div className="stats-grid-modern">
          <div className="stat-card-modern stat-card-today">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-today">
                <span>📌</span>
              </div>
              <div className="stat-card-badge">
                <span className={`status-badge ${getStatusBadgeClass(stats.todayStatus)}`}>
                  {stats.todayStatus}
                </span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Today's Status</div>
              <div className="stat-card-value">{stats.todayStatus}</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-present">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-present">
                <span>✓</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Present Days</div>
              <div className="stat-card-value">{stats.present}</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-absent">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-absent">
                <span>✕</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Absent Days</div>
              <div className="stat-card-value">{stats.absent}</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-late">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-late">
                <span>⏰</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Late Arrivals</div>
              <div className="stat-card-value">{stats.late}</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-hours">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-hours">
                <span>🕒</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Total Hours</div>
              <div className="stat-card-value">{stats.totalHours}</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="history-section">
        <div className="section-header">
          <h2 className="section-title">Recent Attendance History</h2>
          <Link to="/employee/history" className="view-all-link">View All →</Link>
        </div>
        
        {loadingDashboard ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Loading history…</span>
          </div>
        ) : dashboard && Array.isArray(dashboard.history) && dashboard.history.length > 0 ? (
          <div className="history-card-modern">
            <div className="table-container">
              <table className="history-table-modern">
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
                  {dashboard.history.slice(0, 10).map((r: any, idx: number) => (
                    <tr key={r.date + (r.checkInTime || r.check_in_time || '') + idx}>
                      <td className="td-date-modern">
                        <div className="date-display">{r.date}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(r.status || 'unknown')}`}>
                          {r.status || 'N/A'}
                        </span>
                      </td>
                      <td className="td-time">{r.checkInTime ?? r.check_in_time ?? '-'}</td>
                      <td className="td-time">{r.checkOutTime ?? r.check_out_time ?? '-'}</td>
                      <td className="td-hours">{r.totalHours ?? r.total_hours ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-text">No attendance history available</p>
          </div>
        )}
      </div>
    </div>
  )
}


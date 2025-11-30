import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/store'
import client from '../api/client'
import WeeklyTrendChart from '../components/WeeklyTrendChart'
import DepartmentAttendanceChart from '../components/DepartmentAttendanceChart'

export default function ManagerDashboard() {
  const auth = useAppSelector(s => s.auth)
  const [dashboard, setDashboard] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await client.get('/dashboard/manager')
      setDashboard(res.data)
    } catch (err) {
      setDashboard(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  // Helper to read values from different API shapes (camelCase, snake_case, nested)
  const getNested = (obj: any, path: string) => {
    if (!obj) return undefined
    const parts = path.split('.')
    let cur: any = obj
    for (const p of parts) {
      if (cur == null) return undefined
      cur = cur[p]
    }
    return cur
  }

  const findFirst = (obj: any, ...paths: string[]) => {
    for (const p of paths) {
      const v = getNested(obj, p)
      if (v !== undefined && v !== null) return v
    }
    return undefined
  }

  const formatNum = (v: any) => {
    if (v === undefined || v === null) return '-'
    const n = Number(v)
    return Number.isNaN(n) ? '-' : n
  }

  const stats = React.useMemo(() => {
    if (!dashboard) return { totalEmployees: '-', presentToday: '-', absentToday: '-', lateToday: '-' }

    const totalEmployeesRaw = findFirst(dashboard, 'totalEmployees', 'total_employees', 'totals.totalEmployees', 'total')
    const presentRaw = findFirst(dashboard, 'today.present', 'today_present', 'presentToday', 'present_today', 'present')
    const absentRaw = findFirst(dashboard, 'today.absent', 'today_absent', 'absentToday', 'absent_today', 'absent')
    const lateRaw = findFirst(dashboard, 'today.late', 'today_late', 'lateToday', 'late_today', 'late')

    return {
      totalEmployees: totalEmployeesRaw === undefined || totalEmployeesRaw === null ? '-' : totalEmployeesRaw,
      presentToday: formatNum(presentRaw),
      absentToday: formatNum(absentRaw),
      lateToday: formatNum(lateRaw)
    }
  }, [dashboard])

  const lateArrivals = React.useMemo(() => {
    if (!dashboard) return []
    const v = findFirst(dashboard, 'lateArrivalsToday', 'late_arrivals_today', 'lateToday', 'late_today', 'late_arrivals')
    return Array.isArray(v) ? v : []
  }, [dashboard])

  const weeklyTrend = React.useMemo(() => {
    if (!dashboard) return []
    const v = findFirst(dashboard, 'weeklyTrend', 'weekly_trend', 'weekly')
    return Array.isArray(v) ? v : []
  }, [dashboard])

  const departmentWise = React.useMemo(() => {
    if (!dashboard) return []
    const v = findFirst(dashboard, 'departmentWiseAttendance', 'department_wise_attendance', 'departmentWise', 'departments')
    return Array.isArray(v) ? v : []
  }, [dashboard])

  const absentList = React.useMemo(() => {
    if (!dashboard) return []
    const v = findFirst(dashboard, 'absentToday', 'absent_today', 'absentees', 'absent')
    return Array.isArray(v) ? v : []
  }, [dashboard])

  return (
    <div className="manager-dashboard-modern">
      {/* Hero Section */}
      <div className="manager-hero">
        <div className="hero-content">
          <div className="hero-greeting">
            <h1 className="hero-title">Manager Dashboard</h1>
            <p className="hero-subtitle">Team overview and analytics{auth.user ? ` — ${auth.user.name}` : ''}</p>
          </div>
          <div className="hero-actions">
            <Link to="/manager/reports" className="btn-action btn-action-primary">
              <span className="btn-icon">📊</span>
              <span>View Reports</span>
            </Link>
          </div>
        </div>
      </div>
      

      {/* Statistics Cards */}
      <div className="stats-section">
        <h2 className="section-title">Today's Overview</h2>
        <div className="stats-grid-modern">
          <div className="stat-card-modern stat-card-employees">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-employees">
                <span>👥</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Total Employees</div>
              <div className="stat-card-value">{stats.totalEmployees}</div>
              <div className="stat-card-sublabel">In your department</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-present">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-present">
                <span>✓</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Present Today</div>
              <div className="stat-card-value">{stats.presentToday}</div>
              <div className="stat-card-sublabel">Employees at work</div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-absent">
            <div className="stat-card-header">
              <div className="stat-card-icon stat-icon-absent">
                <span>✕</span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">Absent Today</div>
              <div className="stat-card-value">{stats.absentToday}</div>
              <div className="stat-card-sublabel">Not present</div>
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
              <div className="stat-card-value">{stats.lateToday}</div>
              <div className="stat-card-sublabel">Arrived late today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="manager-sections">
        {/* Late Arrivals Section */}
        <div className="manager-section-card">
          <div className="section-header">
            <h3 className="section-title-inline">Late Arrivals Today</h3>
            {!loading && lateArrivals.length > 0 && (
              <span className="section-badge">{lateArrivals.length}</span>
            )}
          </div>
          {loading ? (
            <div className="loading-state-small">
              <div className="loading-spinner-small"></div>
              <span>Loading…</span>
            </div>
          ) : lateArrivals.length === 0 ? (
            <div className="empty-state-small">
              <div className="empty-icon-small">✓</div>
              <p className="empty-text-small">No late arrivals today</p>
            </div>
          ) : (
            <ul className="employee-list-modern">
              {lateArrivals.map((p: any) => (
                <li key={p.employee_id || p.id} className="employee-list-item">
                  <div className="employee-avatar-small">
                    {(p.name || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="employee-info">
                    <div className="employee-name">{p.name}</div>
                    <div className="employee-id">ID: {p.employee_id || p.id}</div>
                  </div>
                  <div className="employee-status-badge status-late">Late</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weekly Trend Section */}
        <div className="manager-section-card">
          <div className="section-header">
            <h3 className="section-title-inline">Weekly Attendance Trend</h3>
            <span className="section-subtitle-small">Last 7 days</span>
          </div>
          {loading ? (
            <div className="loading-state-small">
              <div className="loading-spinner-small"></div>
              <span>Loading chart…</span>
            </div>
          ) : weeklyTrend.length === 0 ? (
            <div className="empty-state-small">
              <div className="empty-icon-small">📊</div>
              <p className="empty-text-small">No trend data available</p>
            </div>
          ) : (
            <div className="chart-container">
              <WeeklyTrendChart data={weeklyTrend} />
            </div>
          )}
        </div>

        {/* Department-wise and Absent Today - Side by Side */}
        <div className="section-row-modern">
          <div className="manager-section-card section-card-half">
            <div className="section-header">
              <h3 className="section-title-inline">Department Attendance</h3>
            </div>
            {loading ? (
              <div className="loading-state-small">
                <div className="loading-spinner-small"></div>
                <span>Loading…</span>
              </div>
            ) : departmentWise.length === 0 ? (
              <div className="empty-state-small">
                <div className="empty-icon-small">📋</div>
                <p className="empty-text-small">No department data</p>
              </div>
            ) : (
              <div className="chart-container">
                <DepartmentAttendanceChart data={departmentWise} />
              </div>
            )}
          </div>

          <div className="manager-section-card section-card-half">
            <div className="section-header">
              <h3 className="section-title-inline">Absent Today</h3>
              {!loading && absentList.length > 0 && (
                <span className="section-badge">{absentList.length}</span>
              )}
            </div>
            {loading ? (
              <div className="loading-state-small">
                <div className="loading-spinner-small"></div>
                <span>Loading…</span>
              </div>
            ) : absentList.length === 0 ? (
              <div className="empty-state-small">
                <div className="empty-icon-small">✓</div>
                <p className="empty-text-small">No absentees today</p>
              </div>
            ) : (
              <ul className="employee-list-modern">
                {absentList.map((p: any) => (
                  <li key={p.employee_id || p.id} className="employee-list-item">
                    <div className="employee-avatar-small">
                      {(p.name || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="employee-info">
                      <div className="employee-name">{p.name}</div>
                      <div className="employee-id">ID: {p.employee_id || p.id}</div>
                    </div>
                    <div className="employee-status-badge status-absent">Absent</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


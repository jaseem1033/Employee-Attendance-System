import React, { useState, useEffect, useCallback } from 'react'
import DashboardCard from '../components/DashboardCard'
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

  const stats = React.useMemo(() => {
    if (!dashboard) return { totalEmployees: '-', presentToday: '-', absentToday: '-', lateToday: '-' }
    return {
      totalEmployees: dashboard.totalEmployees ?? (dashboard.totalEmployees === 0 ? 0 : '-'),
      presentToday: dashboard.today?.present ?? 0,
      absentToday: dashboard.today?.absent ?? 0,
      lateToday: dashboard.today?.late ?? 0
    }
  }, [dashboard])

  return (
    <div className="manager-dashboard">
      <div className="manager-header">
        <div>
          <h2 className="manager-title">Manager Dashboard</h2>
          <div className="muted manager-sub">Overview for managers{auth.user ? ` — ${auth.user.name}` : ''}</div>
        </div>
        <div className="manager-actions">
          <Link to="/manager/all"><button className="btn btn-primary">View All Attendance</button></Link>
          <Link to="/manager/reports"><button className="btn btn-outline">Reports</button></Link>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard title="Total employees" value={stats.totalEmployees} />
        <DashboardCard title="Present today" value={stats.presentToday} />
        <DashboardCard title="Absent today" value={stats.absentToday} />
        <DashboardCard title="Late today" value={stats.lateToday} />
      </div>

      <div className="sections">
        <div className="section-card card">
          <h3 className="section-title">Late Arrivals Today</h3>
          {loading && <div>Loading…</div>}
          {!loading && dashboard && Array.isArray(dashboard.lateArrivalsToday) && dashboard.lateArrivalsToday.length === 0 && (
            <div>No late arrivals today</div>
          )}
          {!loading && dashboard && Array.isArray(dashboard.lateArrivalsToday) && dashboard.lateArrivalsToday.length > 0 && (
            <ul className="person-list">
              {dashboard.lateArrivalsToday.map((p: any) => (
                <li key={p.employee_id}><span className="person-name">{p.name}</span> <span className="person-id">{p.employee_id}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="section-card card">
          <h3 className="section-title">Weekly Trend (last 7 days)</h3>
          {!loading && dashboard && Array.isArray(dashboard.weeklyTrend) && (
            <WeeklyTrendChart data={dashboard.weeklyTrend} />
          )}
        </div>

        <div className="section-row">
          <div className="section-card card half">
            <h3 className="section-title">Department-wise Attendance (today)</h3>
            {!loading && dashboard && Array.isArray(dashboard.departmentWiseAttendance) && (
              <DepartmentAttendanceChart data={dashboard.departmentWiseAttendance} />
            )}
          </div>

          <div className="section-card card half">
            <h3 className="section-title">Absent Today</h3>
            {!loading && dashboard && Array.isArray(dashboard.absentToday) && dashboard.absentToday.length === 0 && (
              <div>No absentees today</div>
            )}
            {!loading && dashboard && Array.isArray(dashboard.absentToday) && dashboard.absentToday.length > 0 && (
              <ul className="person-list">
                {dashboard.absentToday.map((p: any) => (
                  <li key={p.employee_id}><span className="person-name">{p.name}</span> <span className="person-id">{p.employee_id}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


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
    <div>
      <h2 style={{ marginTop: 0 }}>Manager Dashboard</h2>
      <p style={{ color: '#6b7280' }}>Overview for managers{auth.user ? ` — ${auth.user.name}` : ''}</p>

      <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <DashboardCard title="Total employees" value={stats.totalEmployees} />
        <DashboardCard title="Present today" value={stats.presentToday} />
        <DashboardCard title="Absent today" value={stats.absentToday} />
        <DashboardCard title="Late today" value={stats.lateToday} />
      </div>

      <div style={{ marginTop: 26 }}>
        <Link to="/manager/all"><button className="btn btn-primary">View All Attendance</button></Link>
        <Link to="/manager/reports" style={{ marginLeft: 12 }}><button className="btn btn-outline">Reports</button></Link>
      </div>

      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 8 }}>Late Arrivals Today</h3>
        {loading && <div>Loading…</div>}
        {!loading && dashboard && Array.isArray(dashboard.lateArrivalsToday) && dashboard.lateArrivalsToday.length === 0 && (
          <div>No late arrivals today</div>
        )}
        {!loading && dashboard && Array.isArray(dashboard.lateArrivalsToday) && dashboard.lateArrivalsToday.length > 0 && (
          <ul>
            {dashboard.lateArrivalsToday.map((p: any) => (
              <li key={p.employee_id}>{p.name} — {p.employee_id}</li>
            ))}
          </ul>
        )}

        {/* Absent Today moved to bottom */}

        <h3 style={{ marginTop: 16, marginBottom: 8 }}>Weekly Trend (last 7 days)</h3>
        {!loading && dashboard && Array.isArray(dashboard.weeklyTrend) && (
          <WeeklyTrendChart data={dashboard.weeklyTrend} />
        )}

        <h3 style={{ marginTop: 20, marginBottom: 8 }}>Department-wise Attendance (today)</h3>
        {!loading && dashboard && Array.isArray(dashboard.departmentWiseAttendance) && (
          <DepartmentAttendanceChart data={dashboard.departmentWiseAttendance} />
        )}
        
        <h3 style={{ marginTop: 20, marginBottom: 8 }}>Absent Today</h3>
        {!loading && dashboard && Array.isArray(dashboard.absentToday) && dashboard.absentToday.length === 0 && (
          <div>No absentees today</div>
        )}
        {!loading && dashboard && Array.isArray(dashboard.absentToday) && dashboard.absentToday.length > 0 && (
          <ul>
            {dashboard.absentToday.map((p: any) => (
              <li key={p.employee_id}>{p.name} — {p.employee_id}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


import React from 'react'
import DashboardCard from '../components/DashboardCard'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/store'

export default function ManagerDashboard() {
  const auth = useAppSelector(s => s.auth)

  const stats = {
    totalEmployees: 42,
    presentToday: 34,
    absentToday: 8,
    lateToday: 2
  }

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
    </div>
  )
}


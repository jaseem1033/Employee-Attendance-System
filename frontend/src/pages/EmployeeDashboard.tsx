import React from 'react'
import DashboardCard from '../components/DashboardCard'
import { useAppSelector } from '../store/store'
import { Link } from 'react-router-dom'

export default function EmployeeDashboard() {
  const auth = useAppSelector(s => s.auth)

  // placeholder values — in a real app these would be fetched from /api/dashboard/employee
  const stats = {
    todayStatus: 'Not checked in',
    present: 12,
    absent: 2,
    late: 1,
    totalHours: '32h'
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Employee Dashboard</h2>
      <p style={{ color: '#6b7280' }}>Welcome back{auth.user ? `, ${auth.user.name}` : ''} — here's a quick summary.</p>

      <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <DashboardCard title="Today's status" value={stats.todayStatus} />
        <DashboardCard title="Present this month" value={stats.present} />
        <DashboardCard title="Absent this month" value={stats.absent} />
        <DashboardCard title="Late this month" value={stats.late} />
        <DashboardCard title="Total hours (month)" value={stats.totalHours} />
      </div>

      <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/employee/checkin"><button className="btn btn-primary">Mark Attendance</button></Link>
        <Link to="/employee/history"><button className="btn btn-outline">View My Attendance History</button></Link>
        <Link to="/employee/summary"><button className="btn btn-outline">View Monthly Summary</button></Link>
      </div>
    </div>
  )
}


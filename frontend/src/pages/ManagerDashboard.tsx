import React from 'react'
import { Link } from 'react-router-dom'

export default function ManagerDashboard() {
  return (
    <div>
      <h2>Manager Dashboard</h2>
      <p>Team overview and quick actions</p>
      <div>
        <Link to="/manager/all"><button>All Attendance</button></Link>
      </div>
    </div>
  )
}

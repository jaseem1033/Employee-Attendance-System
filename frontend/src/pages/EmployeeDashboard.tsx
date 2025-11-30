import React from 'react'
import { Link } from 'react-router-dom'

export default function EmployeeDashboard() {
  return (
    <div>
      <h2>Employee Dashboard</h2>
      <p>Quick actions</p>
      <div>
        <Link to="/employee/checkin"><button>Check In / Out</button></Link>
        <Link to="/employee/history"><button>My History</button></Link>
        <Link to="/employee/summary"><button>My Summary</button></Link>
      </div>
    </div>
  )
}

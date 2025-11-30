import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function AllAttendance() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/attendance/all')
        setRows(res.data)
      } catch (err) {}
    })()
  }, [])

  return (
    <div>
      <h2>All Attendance (Manager)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.employee_id}</td>
              <td>{r.date}</td>
              <td>{r.status}</td>
              <td>{r.check_in_time}</td>
              <td>{r.check_out_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

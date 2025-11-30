import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function MyHistory() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/attendance/my-history')
        setRows(res.data)
      } catch (err) {}
    })()
  }, [])

  return (
    <div>
      <h2>My Attendance History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.date}>
              <td>{r.date}</td>
              <td>{r.check_in_time}</td>
              <td>{r.check_out_time}</td>
              <td>{r.status}</td>
              <td>{r.total_hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

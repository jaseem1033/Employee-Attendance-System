import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div style={{ position: 'relative', paddingTop: 28 }}>
      <Link to="/employee">
        <button
          className="nav-back"
          style={{
            position: 'absolute',
            left: 8,
            top: 0,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}
        >
          ← Back
        </button>
      </Link>

      <h2 style={{ textAlign: 'center' }}>My Attendance History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
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

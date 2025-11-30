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
    <div className="all-attendance-page">
      <h2 className="page-title">All Attendance (Manager)</h2>

      <div className="card table-card">
        <table className="attendance-table" role="table">
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
                <td className="td-name">{r.name ?? r.fullName ?? '-'}</td>
                <td className="td-id">{r.employee_id ?? r.employeeId ?? '-'}</td>
                <td className="td-date">{r.date ?? r.day ?? r.day_at ?? r.dayAt ?? '-'}</td>
                <td className="td-status">{
                  (r.status || r.state)
                    ? <span className={`status-badge status-${((r.status || r.state) || '').toString().toLowerCase()}`}>{r.status ?? r.state}</span>
                    : '-'
                }</td>
                <td className="td-checkin">{r.check_in_time ?? r.checkInTime ?? r.checkin ?? '-'}</td>
                <td className="td-checkout">{r.check_out_time ?? r.checkOutTime ?? r.checkout ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

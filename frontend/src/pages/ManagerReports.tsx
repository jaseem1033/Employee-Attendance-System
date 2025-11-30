import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function ManagerReports() {
  const [employees, setEmployees] = useState<any[]>([])
  const [start, setStart] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().slice(0,10)
  })
  const [end, setEnd] = useState<string>(() => new Date().toISOString().slice(0,10))
  const [selected, setSelected] = useState<string>('all')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/attendance/all')
        // manager GET /attendance/all returns employees for manager
        setEmployees(res.data)
      } catch (err) {
        setEmployees([])
      }
    })()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params: any = { start, end, format: 'json' }
      if (selected !== 'all') params.employeeId = selected
      const res = await client.get('/attendance/export', { params })
      setRows(res.data)
    } catch (err) {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    try {
      const params: any = { start, end }
      if (selected !== 'all') params.employeeId = selected
      const res = await client.get('/attendance/export', { params, responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_${start}_to_${end}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // ignore
    }
  }

  return (
    <div>
      <h2>Manager Reports</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <label>
          From:&nbsp;
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </label>
        <label>
          To:&nbsp;
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </label>

        <label>
          Employee:&nbsp;
          <select value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="all">All</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
            ))}
          </select>
        </label>

        <button onClick={fetchReport} className="btn btn-primary">Show</button>
        <button onClick={exportCSV} className="btn btn-outline">Export to CSV</button>
      </div>

      <div style={{ marginTop: 18 }}>
        {loading && <div>Loading report…</div>}
        {!loading && rows.length === 0 && <div>No results</div>}
        {!loading && rows.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.employee_id}-${r.date}-${i}`}>
                  <td>{r.name}</td>
                  <td>{r.employee_id}</td>
                  <td>{r.date}</td>
                  <td>{r.status}</td>
                  <td>{r.check_in_time}</td>
                  <td>{r.check_out_time}</td>
                  <td>{r.total_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

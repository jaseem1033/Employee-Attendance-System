import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function MySummary() {
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/attendance/my-summary')
        setSummary(res.data)
      } catch (err) {
        setSummary(null)
      }
    })()
  }, [])

  // Normalize summary into an array of { label, value }
  const normalized = React.useMemo(() => {
    if (!summary) return []
    // If backend returns an object like { present: 5, late: 2, halfDay: 1, absent: 0 }
    if (!Array.isArray(summary) && typeof summary === 'object') {
      return [
        { label: 'Present', value: summary.present ?? 0 },
        { label: 'Late', value: summary.late ?? 0 },
        { label: 'Half Day', value: summary.halfDay ?? summary.half_day ?? 0 },
        { label: 'Absent', value: summary.absent ?? 0 },
      ]
    }

    // If backend returns array of { status, count }
    if (Array.isArray(summary)) {
      return summary.map((s: any) => ({ label: s.status, value: s.count }))
    }

    return []
  }, [summary])

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

      <h2 style={{ textAlign: 'center' }}>My Monthly Summary</h2>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
        {normalized.length === 0 && <div>No data available</div>}
        {normalized.map((s) => (
          <div key={s.label} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

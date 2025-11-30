import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function formatDateYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function AttendanceHistory() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<any[]>([])
  const [monthDate, setMonthDate] = useState<Date>(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [histRes, meRes] = await Promise.all([
          client.get('/attendance/my-history'),
          client.get('/auth/me')
        ])
        if (cancelled) return
        setHistory(histRes.data || [])
        const created = meRes.data?.created_at || meRes.data?.createdAt || null
        setCreatedAt(created)
      } catch (err) {
        if (!cancelled) setHistory([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const mapping = useMemo(() => {
    const map: Record<string, any> = {}
    history.forEach((h) => {
      const key = h.date || h.day || h.day_at || h.dayAt
      if (key) map[key] = h
    })
    return map
  }, [history])

  const days = useMemo(() => {
    const total = daysInMonth(monthDate)
    const firstWeekday = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay() // 0 = Sunday
    const arr: Array<string | null> = []
    for (let i = 0; i < firstWeekday; i++) arr.push(null)
    for (let d = 1; d <= total; d++) {
      const dd = new Date(monthDate.getFullYear(), monthDate.getMonth(), d)
      arr.push(formatDateYMD(dd))
    }
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [monthDate])

  const prevMonth = () => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))
  const nextMonth = () => {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const candidate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1)
    if (candidate > currentMonthStart) return
    setMonthDate(candidate)
  }

  const monthOptions = useMemo(() => {
    const opts: Date[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      opts.push(d)
    }
    return opts
  }, [])

  const statusColor = (state: string) => {
    switch (state) {
      case 'present': return '#10b981'
      case 'late': return '#fbbf24'
      case 'halfday': return '#fb923c'
      case 'absent': return '#ef4444'
      case 'not-employed': return '#f3f4f6'
      default: return '#d1d5db'
    }
  }

  const onSelectDay = (dateStr: string | null) => {
    if (!dateStr) return
    setSelectedDate(dateStr)
  }

  const createdYMD = useMemo(() => {
    if (!createdAt) return null
    const cd = new Date(createdAt)
    if (isNaN(cd.getTime())) return null
    return formatDateYMD(cd)
  }, [createdAt])

  return (
    <div className="calendar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
        <h2 style={{ margin: 0 }}>Attendance History (Calendar)</h2>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <button onClick={prevMonth} className="btn btn-outline">‹</button>
        <select value={monthKey(monthDate)} onChange={(e) => {
          const [y, m] = e.target.value.split('-').map(Number)
          setMonthDate(new Date(y, m - 1, 1))
        }}>
          {monthOptions.map(d => (
            <option key={monthKey(d)} value={monthKey(d)}>{d.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</option>
          ))}
        </select>
        <button onClick={nextMonth} className="btn btn-outline">›</button>

        <div style={{ marginLeft: 'auto' }} className="legend">
          <div className="legend-item"><span className="legend-swatch" style={{ background: '#10b981' }} /> <small>Present</small></div>
          <div className="legend-item"><span className="legend-swatch" style={{ background: '#ef4444' }} /> <small>Absent</small></div>
          <div className="legend-item"><span className="legend-swatch" style={{ background: '#fbbf24' }} /> <small>Late</small></div>
          <div className="legend-item"><span className="legend-swatch" style={{ background: '#fb923c' }} /> <small>Half Day</small></div>
        </div>
      </div>

      <div className="calendar-grid" style={{ marginTop: 16 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}

        {loading && <div style={{ gridColumn: '1/-1' }}>Loading…</div>}

        {!loading && days.map((d, i) => {
          if (!d) return <div key={i} style={{ minHeight: 64 }} />
          const item = mapping[d]
          const beforeCreated = createdYMD && d < createdYMD
          let state: string
          if (beforeCreated) state = 'not-employed'
          else if (item) {
            const s = (item.status || '').toString().toLowerCase()
            if (s.includes('late')) state = 'late'
            else if (s.includes('half')) state = 'halfday'
            else if (s.includes('present') || s.includes('checked')) state = 'present'
            else state = s || 'present'
          } else {
            state = 'absent'
          }

          const color = statusColor(state)

          const isSelected = selectedDate === d

          return (
            <div
              key={d}
              role="button"
              aria-pressed={isSelected}
              aria-selected={isSelected}
              tabIndex={state === 'not-employed' ? -1 : 0}
              onClick={() => { if (state !== 'not-employed') onSelectDay(d) }}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && state !== 'not-employed') onSelectDay(d) }}
              className={`calendar-cell ${state === 'not-employed' ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13 }}>{d.slice(-2)}</div>
                <div style={{ width: 12, height: 12, background: color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 12 }} className="muted">{state === 'not-employed' ? '' : (item ? item.status : 'absent')}</div>
            </div>
          )
        })}
      </div>

      <div className="details">
        {selectedDate ? (
          <div className="details-panel card">
            <h4 style={{ marginTop: 0 }}>{selectedDate}</h4>
            {createdYMD && selectedDate < createdYMD ? (
              <div>Employee not employed on this date</div>
            ) : mapping[selectedDate] ? (
              <div>
                <div><strong>Status:</strong> {mapping[selectedDate].status}</div>
                <div><strong>Check In:</strong> {mapping[selectedDate].check_in_time || mapping[selectedDate].checkInTime || '—'}</div>
                <div><strong>Check Out:</strong> {mapping[selectedDate].check_out_time || mapping[selectedDate].checkOutTime || '—'}</div>
                <div><strong>Total Hours:</strong> {mapping[selectedDate].total_hours ?? mapping[selectedDate].totalHours ?? '—'}</div>
              </div>
            ) : (
              <div>No attendance record for this date (Absent)</div>
            )}
          </div>
        ) : (
          <div className="muted">Click a date to see details</div>
        )}
      </div>
    </div>
  )
}

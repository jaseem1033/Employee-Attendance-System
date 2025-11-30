import React from 'react'

type DataPoint = Record<string, any>

export default function WeeklyTrendChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) return <div className="chart-empty">No trend data</div>

  // Helpers to handle multiple possible field names
  const getVal = (obj: any, ...keys: string[]) => {
    if (!obj) return 0
    for (const k of keys) {
      if (k in obj && obj[k] != null) return obj[k]
    }
    return 0
  }

  const formatDate = (d: any) => {
    // accept strings like '2025-11-30', or fields like 'day' or 'date'
    const dateStr = typeof d === 'string' ? d : (d?.date || d?.day || d?.day_at || d?.dayAt || '')
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length >= 3) return `${parts[1]}-${parts[2]}`
    return dateStr.slice(5)
  }

  // Normalize data: ensure we map present/absent from different key names
  const normalized = data.map((raw) => {
    const present = Number(getVal(raw, 'present', 'present_count', 'presentCount', 'presentToday', 'present_today')) || 0
    const absent = Number(getVal(raw, 'absent', 'absent_count', 'absentCount', 'absentToday', 'absent_today')) || 0
    const date = getVal(raw, 'date', 'day', 'day_at', 'dayAt') || raw.date || raw.day || ''
    return { date, present, absent }
  })

  // Determine max for scale
  const max = Math.max(1, ...normalized.map(d => Math.max(d.present ?? 0, d.absent ?? 0)))

  // If API gives newest-first, reverse so oldest is leftmost. Detect by date order.
  const needsReverse = (() => {
    if (normalized.length < 2) return false
    const a = Date.parse(normalized[0].date)
    const b = Date.parse(normalized[normalized.length - 1].date)
    if (!Number.isNaN(a) && !Number.isNaN(b)) return a > b
    // fallback to string compare
    return String(normalized[0].date) > String(normalized[normalized.length - 1].date)
  })()
  const reversedData = needsReverse ? [...normalized].reverse() : [...normalized]

  // Generate Y axis marks
  const steps = 5
  const yAxisMarks = []
  for (let i = 0; i <= steps; i++) yAxisMarks.push(Math.round((max / steps) * i))

  return (
    <div className="weekly-trend-chart-modern">
      <div className="chart-y-axis">
        {yAxisMarks.slice().reverse().map((value, idx) => (
          <div key={idx} className="y-axis-label">{value}</div>
        ))}
      </div>

      <div className="chart-main-area">
        <div className="chart-grid">
          {yAxisMarks.map((_, idx) => <div key={idx} className="grid-line" />)}
        </div>

        <div className="chart-bars-modern">
          {reversedData.map((d) => {
            const present = d.present || 0
            const absent = d.absent || 0
            const presentHeight = max > 0 ? Math.max((present / max) * 100, present > 0 ? 6 : 0) : 0
            const absentHeight = max > 0 ? Math.max((absent / max) * 100, absent > 0 ? 6 : 0) : 0

            return (
              <div key={d.date || Math.random()} className="chart-bar-group-modern">
                <div className="chart-bars-container-modern">
                  <div
                    className="chart-bar chart-bar-present"
                    title={`${present} present`}
                    style={{ height: `${presentHeight}%` }}
                  >
                    {present > 0 && <span className="bar-value-inline">{present}</span>}
                  </div>
                  <div
                    className="chart-bar chart-bar-absent"
                    title={`${absent} absent`}
                    style={{ height: `${absentHeight}%` }}
                  >
                    {absent > 0 && <span className="bar-value-inline">{absent}</span>}
                  </div>
                </div>

                <div className="chart-label-modern">
                  <div className="chart-date">{formatDate(d.date)}</div>
                  <div className="chart-values-row">
                    {present > 0 ? (
                      <span className="chart-value-item chart-value-present">{present}✓</span>
                    ) : null}
                    {absent > 0 ? (
                      <span className="chart-value-item chart-value-absent">{absent}✕</span>
                    ) : null}
                    {present === 0 && absent === 0 ? (
                      <span className="chart-value-item chart-value-zero">0</span>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="chart-legend-modern">
        <div className="legend-item">
          <span className="legend-swatch legend-present" />
          <span className="legend-text">Present</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch legend-absent" />
          <span className="legend-text">Absent</span>
        </div>
      </div>
    </div>
  )
}

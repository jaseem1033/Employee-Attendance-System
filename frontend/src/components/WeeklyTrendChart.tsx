import React from 'react'

type DataPoint = {
  date: string
  present: number
  absent: number
}

export default function WeeklyTrendChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) return <div>No trend data</div>

  const max = Math.max(1, ...data.map(d => Math.max(d.present ?? 0, d.absent ?? 0)))

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160 }}>
        {data.map((d) => (
          <div key={d.date} style={{ flex: '1 0 0', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6, height: 120 }}>
              <div title={`${d.present} present`} style={{ height: `${(d.present / max) * 100}%`, width: 18, background: '#10b981', borderRadius: 6 }} />
              <div title={`${d.absent} absent`} style={{ height: `${(d.absent / max) * 100}%`, width: 18, background: '#e5e7eb', borderRadius: 6 }} />
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>{d.date.slice(5)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12, fontSize: 13, color: '#374151' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, background: '#10b981', borderRadius: 3, display: 'inline-block' }} />
          <span style={{ color: '#6b7280' }}>Present</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, background: '#e5e7eb', borderRadius: 3, display: 'inline-block' }} />
          <span style={{ color: '#6b7280' }}>Absent</span>
        </div>
      </div>
    </div>
  )
}

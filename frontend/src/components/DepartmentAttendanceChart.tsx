import React from 'react'

type Dept = {
  department: string
  present: number
  absent: number
}

export default function DepartmentAttendanceChart({ data }: { data: Dept[] }) {
  if (!data || data.length === 0) return <div>No department attendance data</div>

  // compute max total (present + absent) to scale bars
  const maxTotal = Math.max(1, ...data.map(d => (Number(d.present || 0) + Number(d.absent || 0))))

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((d) => {
          const present = Number(d.present || 0)
          const absent = Number(d.absent || 0)
          const total = present + absent || 1
          const presentPct = (present / maxTotal) * 100
          const absentPct = (absent / maxTotal) * 100

          return (
            <div key={d.department} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 160, fontSize: 13 }}>{d.department}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', height: 18, borderRadius: 6, overflow: 'hidden', background: '#f3f4f6' }}>
                  <div style={{ width: `${presentPct}%`, background: '#10b981' }} title={`${present} present`} />
                  <div style={{ width: `${absentPct}%`, background: '#e5e7eb' }} title={`${absent} absent`} />
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{present} present • {absent} absent • total {total}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

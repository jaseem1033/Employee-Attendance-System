import React from 'react'

type Dept = {
  department: string
  present: number
  absent: number
}

export default function DepartmentAttendanceChart({ data }: { data: Dept[] }) {
  if (!data || data.length === 0) return <div className="chart-empty">No department attendance data</div>

  // compute max total (present + absent) to scale bars
  const maxTotal = Math.max(1, ...data.map(d => (Number(d.present || 0) + Number(d.absent || 0))))

  return (
    <div className="department-chart">
      <div className="department-list">
        {data.map((d) => {
          const present = Number(d.present || 0)
          const absent = Number(d.absent || 0)
          const total = present + absent || 1
          const presentPct = (present / maxTotal) * 100
          const absentPct = (absent / maxTotal) * 100

          return (
            <div key={d.department} className="department-item">
              <div className="department-name">{d.department}</div>
              <div className="department-bar-container">
                <div className="department-bar-wrapper">
                  <div 
                    className="department-bar department-bar-present" 
                    style={{ width: `${presentPct}%` }}
                    title={`${present} present`}
                  />
                  <div 
                    className="department-bar department-bar-absent" 
                    style={{ width: `${absentPct}%` }}
                    title={`${absent} absent`}
                  />
                </div>
                <div className="department-stats">
                  <span className="stat-present">{present} present</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-absent">{absent} absent</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-total">total {total}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

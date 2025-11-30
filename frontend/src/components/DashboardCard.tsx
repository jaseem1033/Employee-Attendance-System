import React from 'react'

export default function DashboardCard({ title, value, children }: { title: string; value?: string | number; children?: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 18, boxShadow: '0 6px 20px rgba(31,45,61,0.06)', border: '1px solid rgba(15,23,36,0.04)', minWidth: 180 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#0f1724' }}>{value}</div>
      {children && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  )
}

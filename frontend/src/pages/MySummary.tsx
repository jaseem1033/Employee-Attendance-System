import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function MySummary() {
  const [summary, setSummary] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/attendance/my-summary')
        setSummary(res.data)
      } catch (err) {}
    })()
  }, [])

  return (
    <div>
      <h2>My Monthly Summary</h2>
      <ul>
        {summary.map((s) => (
          <li key={s.status}>{s.status}: {s.count}</li>
        ))}
      </ul>
    </div>
  )
}

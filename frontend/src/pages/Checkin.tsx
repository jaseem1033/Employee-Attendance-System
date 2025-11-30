import React, { useState } from 'react'
import client from '../api/client'

export default function Checkin() {
  const [message, setMessage] = useState('')

  const handleCheckIn = async () => {
    try {
      const res = await client.post('/attendance/checkin', {})
      setMessage('Checked in')
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
      const lower = (apiMsg || '').toLowerCase()
      if (lower.includes('already checked in')) setMessage('You have already checked in today')
      else setMessage(apiMsg || 'Error')
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await client.post('/attendance/checkout', {})
      setMessage('Checked out')
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error || err?.response?.data?.message || ''
      const lower = (apiMsg || '').toLowerCase()
      if (lower.includes('already checked out')) setMessage('You have already checked out today')
      else if (lower.includes('have not checked in')) setMessage('You have not checked in today')
      else setMessage(apiMsg || 'Error')
    }
  }

  return (
    <div>
      <h2>Check In / Check Out</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleCheckIn}>Check In</button>
        <button onClick={handleCheckOut} style={{ marginLeft: 8 }}>Check Out</button>
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}

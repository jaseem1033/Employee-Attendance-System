import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

      <h2 style={{ textAlign: 'center' }}>Check In / Check Out</h2>

      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <button onClick={handleCheckIn}>Check In</button>
        <button onClick={handleCheckOut} style={{ marginLeft: 8 }}>Check Out</button>
      </div>

      {message && <div style={{ textAlign: 'center' }}>{message}</div>}
    </div>
  )
}

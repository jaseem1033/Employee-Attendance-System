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
        <button className="nav-back">← Back</button>
      </Link>

      <div className="card" style={{ maxWidth: 640, margin: '12px auto', textAlign: 'center', paddingTop: 18 }}>
        <h2 style={{ marginTop: 0 }}>Check In / Check Out</h2>

        <div style={{ marginBottom: 12 }}>
          <button className="btn btn-primary" onClick={handleCheckIn}>Check In</button>
          <button className="btn btn-outline" style={{ marginLeft: 8 }} onClick={handleCheckOut}>Check Out</button>
        </div>

        {message && <div style={{ textAlign: 'center' }} className={message.toLowerCase().includes('error') ? '' : 'success'}>{message}</div>}
      </div>
    </div>
  )
}

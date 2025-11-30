import React, { useState } from 'react'
import client from '../api/client'

export default function Checkin() {
  const [message, setMessage] = useState('')

  const handleCheckIn = async () => {
    try {
      const res = await client.post('/attendance/checkin', {})
      setMessage('Checked in')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Error')
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await client.post('/attendance/checkout', {})
      setMessage('Checked out')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Error')
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

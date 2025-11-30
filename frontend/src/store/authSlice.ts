import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../api/client'

export interface User { id: number; name: string; email: string; role: string; employeeId?: string }

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null

const initialState = {
  user: savedUser ? (JSON.parse(savedUser) as User) : null as User | null,
  token: savedToken || null as string | null,
  loading: false,
  error: null as string | null
}

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await client.post('/auth/login', payload)
    return res.data
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Login failed'
    return rejectWithValue(message)
  }
})

export const register = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string; role?: string; department?: string }, { rejectWithValue }) => {
  try {
    const res = await client.post('/auth/register', payload)
    return res.data
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Register failed'
    return rejectWithValue(message)
  }
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (s) => { s.loading = true; s.error = null })
    builder.addCase(login.fulfilled, (s, a) => {
      s.loading = false
      s.token = a.payload.token
      s.user = a.payload.user
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', a.payload.token)
        localStorage.setItem('user', JSON.stringify(a.payload.user))
      }
    })
    builder.addCase(login.rejected, (s, a) => { s.loading = false; s.error = ((a.payload as string) || a.error.message || 'Login failed') })

    builder.addCase(register.pending, (s) => { s.loading = true; s.error = null })
    builder.addCase(register.fulfilled, (s, a) => { s.loading = false })
    builder.addCase(register.rejected, (s, a) => { s.loading = false; s.error = ((a.payload as string) || a.error.message || 'Register failed') })
  }
})

export const { logout } = slice.actions
export default slice.reducer

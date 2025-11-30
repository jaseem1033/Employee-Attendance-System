import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../api/client'

export interface User { id: number; name: string; email: string; role: string; employeeId?: string }

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const res = await client.post('/auth/login', payload)
  return res.data
})

export const register = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string; role?: string; department?: string }) => {
  const res = await client.post('/auth/register', payload)
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null as User | null, token: null as string | null, loading: false, error: null as string | null },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (s) => { s.loading = true; s.error = null })
    builder.addCase(login.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.user = a.payload.user })
    builder.addCase(login.rejected, (s, a) => { s.loading = false; s.error = (a.error.message || 'Login failed') })

    builder.addCase(register.pending, (s) => { s.loading = true; s.error = null })
    builder.addCase(register.fulfilled, (s, a) => { s.loading = false })
    builder.addCase(register.rejected, (s, a) => { s.loading = false; s.error = (a.error.message || 'Register failed') })
  }
})

export const { logout } = slice.actions
export default slice.reducer

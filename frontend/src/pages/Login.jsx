import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-violet-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Study<span className="text-violet-400">OS</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-zinc-400 text-sm mb-8">Sign in to continue your study journey</p>

          {error && (
            <div className="alert-error mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="input-field"/>
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="input-field"/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <span className="spinner"/> : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800"/>
            <span className="text-zinc-600 text-xs">or</span>
            <div className="flex-1 h-px bg-zinc-800"/>
          </div>

          <p className="text-center text-zinc-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
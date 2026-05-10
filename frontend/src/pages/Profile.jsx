import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios.js'

function Section({ title, description, children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-zinc-800">
        <h2 className="text-white font-semibold text-sm">{title}</h2>
        <p className="text-zinc-500 text-xs mt-1">{description}</p>
      </div>
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  )
}

function Alert({ type, message }) {
  if (!message) return null
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
  }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm mb-5 ${styles[type]}`}>
      {type === 'success' ? (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
        </svg>
      )}
      {message}
    </div>
  )
}

export default function Profile() {
  const { user, login, logout } = useAuth()

  // Profile form
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // Password form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile')
        setProfile({ name: res.data.name, email: res.data.email })
      } catch {
        setProfile({ name: user?.name || '', email: user?.email || '' })
      }
    }
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSuccess('')
    setProfileError('')
    try {
      const res = await API.put('/profile/update', profile)
      // Update local storage with new info
      const token = localStorage.getItem('token')
      login({ id: user.id, name: res.data.name, email: res.data.email }, token)
      setProfileSuccess('Profile updated successfully!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await API.put('/profile/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      setPasswordSuccess(res.data.message)
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordSuccess(''), 4000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setPasswordLoading(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-teal-400 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
          <p className="text-zinc-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"/>
            <span className="text-emerald-400 text-xs font-medium">Active account</span>
          </div>
        </div>
      </div>

      {/* Update Profile */}
      <Section
        title="Personal Information"
        description="Update your name and email address"
      >
        <Alert type="success" message={profileSuccess} />
        <Alert type="error" message={profileError} />

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-500/20"
            >
              {profileLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </Section>

      {/* Change Password */}
      <Section
        title="Change Password"
        description="Make sure your account is using a strong password"
      >
        <Alert type="success" message={passwordSuccess} />
        <Alert type="error" message={passwordError} />

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-500/20"
            >
              {passwordLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              )}
              Change Password
            </button>
          </div>
        </form>
      </Section>

      {/* Danger Zone */}
      <Section
        title="Session"
        description="Manage your current session"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Sign out of your account</p>
            <p className="text-zinc-500 text-xs mt-1">You will be redirected to the login page</p>
          </div>
          <button
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </Section>

    </div>
  )
}
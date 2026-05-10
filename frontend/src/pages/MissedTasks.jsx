import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function MissedTaskCard({ task, index }) {
  const colors = [
    'bg-violet-500/10 border-violet-500/20 text-violet-400',
    'bg-teal-500/10 border-teal-500/20 text-teal-400',
    'bg-amber-500/10 border-amber-500/20 text-amber-400',
    'bg-pink-500/10 border-pink-500/20 text-pink-400',
    'bg-blue-500/10 border-blue-500/20 text-blue-400',
    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  ]

  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition group">
      {/* Index */}
      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
        <span className="text-red-400 text-xs font-bold">{index + 1}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{task.subject}</p>
        <p className="text-zinc-500 text-xs mt-0.5">Day {task.day}</p>
      </div>

      {/* Hours */}
      <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${colors[index % colors.length]}`}>
        {task.hours}h
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"/>
        <span className="text-red-400 text-xs font-medium">Missed</span>
      </div>
    </div>
  )
}

function EmptyState({ title, description, icon }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
      <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">{title}</h2>
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
  )
}

export default function MissedTasks() {
  const { user } = useAuth()
  const [missed, setMissed] = useState([])
  const [loading, setLoading] = useState(true)
  const [rescheduling, setRescheduling] = useState(false)
  const [adapting, setAdapting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchMissed = async () => {
    try {
      const res = await API.get(`/ai/missed/${user.id}`)
      setMissed(res.data.missedTasks || [])
    } catch {
      setMissed([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMissed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const handleReschedule = async () => {
    setRescheduling(true)
    try {
      const res = await API.post(`/ai/reschedule/${user.id}`)
      showSuccess(res.data.message || 'Tasks rescheduled successfully!')
      await fetchMissed()
    } catch {
      showSuccess('Something went wrong. Try again.')
    } finally {
      setRescheduling(false)
    }
  }

  const handleAdaptive = async () => {
    setAdapting(true)
    try {
      const res = await API.post(`/ai/adaptive/${user.id}`)
      showSuccess(res.data.message || 'Adaptive rescheduling complete!')
      await fetchMissed()
    } catch {
      showSuccess('Something went wrong. Try again.')
    } finally {
      setAdapting(false)
    }
  }

  const totalHours = missed.reduce((acc, t) => acc + t.hours, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Missed Tasks</h1>
          <p className="text-zinc-500 text-sm mt-1">Tasks you haven't completed yet</p>
        </div>

        {missed.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReschedule}
              disabled={rescheduling}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition disabled:opacity-50"
            >
              {rescheduling ? (
                <span className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin"/>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
              )}
              Reschedule
            </button>

            <button
              onClick={handleAdaptive}
              disabled={adapting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {adapting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              )}
              Adaptive Reschedule
            </button>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 animate-pulse">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
          </svg>
          <p className="text-emerald-400 text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl h-16 animate-pulse"/>
          ))}
        </div>
      ) : missed.length === 0 ? (
        <EmptyState
          title="No missed tasks"
          description="You're all caught up! Keep up the great work 🎉"
          icon={
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
            </svg>
          }
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight mb-1">{missed.length}</div>
              <div className="text-zinc-500 text-sm">Missed Tasks</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight mb-1">{totalHours}h</div>
              <div className="text-zinc-500 text-sm">Hours Behind</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:col-span-1 col-span-2">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight mb-1">
                {[...new Set(missed.map((t) => t.day))].length}
              </div>
              <div className="text-zinc-500 text-sm">Days Affected</div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {missed.map((task, i) => (
              <MissedTaskCard key={i} task={task} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
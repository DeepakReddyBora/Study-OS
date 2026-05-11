import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios.js'

function TaskItem({ task, planId, day, taskIndex, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await API.put('/ai/task/update', { planId, day, taskIndex })
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-150
        ${task.completed
          ? 'bg-zinc-800/50 border-zinc-700/50 opacity-60'
          : 'bg-zinc-800 border-zinc-700 hover:border-violet-500/40 hover:bg-zinc-700/50'
        }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
        ${task.completed ? 'bg-violet-600 border-violet-600' : 'border-zinc-600'}`}>
        {loading ? (
          <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>
        ) : task.completed ? (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        ) : null}
      </div>
      <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
        {task.subject}
      </span>
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium
        ${task.completed
          ? 'bg-zinc-700/50 border-zinc-600/50 text-zinc-500'
          : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
        }`}>
        {task.hours}h
      </span>
    </div>
  )
}

function DayCard({ dayData, planId, onUpdate }) {
  const [open, setOpen] = useState(dayData.day === 1)
  const completed = dayData.tasks.filter((t) => t.completed).length
  const total = dayData.tasks.length
  const pct = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <span className="text-violet-400 font-bold text-sm">{dayData.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white font-medium text-sm">Day {dayData.day}</span>
            <span className="text-zinc-500 text-xs">{completed}/{total} done</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-linear-to-r from-violet-600 to-violet-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      {open && (
        <div className="px-5 pb-5 space-y-2 border-t border-zinc-800 pt-4">
          {dayData.tasks.map((task, idx) => (
            <TaskItem
              key={idx}
              task={task}
              planId={planId}
              day={dayData.day}
              taskIndex={idx}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Confirm Delete Modal
function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
        </div>

        <h2 className="text-white font-bold text-lg text-center mb-2">Delete Study Plan?</h2>
        <p className="text-zinc-500 text-sm text-center mb-6">
          This will permanently delete your entire study plan and all task progress. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudyPlan() {
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rescheduling, setRescheduling] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    subjects: '',
    hoursPerDay: '',
    days: '',
  })

  const fetchPlan = async () => {
    try {
      const res = await API.get(`/ai/plan/${user.id}`)
      setPlan(res.data)
    } catch {
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const res = await API.post('/ai/generate', {
        userId: user.id,
        subjects: form.subjects,
        hoursPerDay: Number(form.hoursPerDay),
        days: Number(form.days),
      })
      setPlan(res.data)
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const handleReschedule = async () => {
    setRescheduling(true)
    try {
      await API.post(`/ai/adaptive/${user.id}`)
      await fetchPlan()
    } catch (err) {
      console.error(err)
    } finally {
      setRescheduling(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await API.delete(`/ai/plan/${user.id}`)
      setPlan(null)
      setShowDeleteModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl h-20 animate-pulse"/>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Study Plan</h1>
          <p className="text-zinc-500 text-sm mt-1">Your AI-generated daily schedule</p>
        </div>
        <div className="flex items-center gap-3">
          {plan && (
            <>
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
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm font-medium transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
                Delete Plan
              </button>
            </>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition shadow-lg shadow-violet-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Plan
          </button>
        </div>
      </div>

      {/* Generate Form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-1">Generate New Plan</h2>
          <p className="text-zinc-500 text-sm mb-6">AI will create a personalized schedule based on your inputs</p>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Subjects
              </label>
              <input
                type="text"
                placeholder="e.g. DBMS, OS, CN"
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Hours Per Day
              </label>
              <input
                type="number"
                placeholder="e.g. 4"
                min="1" max="12"
                value={form.hoursPerDay}
                onChange={(e) => setForm({ ...form, hoursPerDay: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Number of Days
              </label>
              <input
                type="number"
                placeholder="e.g. 7"
                min="1" max="30"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-500/20"
              >
                {generating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plan */}
      {!plan ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">No study plan yet</h2>
          <p className="text-zinc-500 text-sm mb-6">Click "New Plan" to generate your AI-powered schedule</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plan.plan.map((day) => (
            <DayCard
              key={day.day}
              dayData={day}
              planId={plan._id}
              onUpdate={fetchPlan}
            />
          ))}
        </div>
      )}
    </div>
  )
}
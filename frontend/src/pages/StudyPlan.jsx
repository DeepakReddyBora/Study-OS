import {
  useEffect,
  useState,
  useCallback
} from 'react'

import { useAuth } from '../context/AuthContext'
import API from '../api/axios.js'

function TaskItem({
  task,
  planId,
  day,
  taskIndex,
  onUpdate
}) {

  const [loading, setLoading] =
    useState(false)

  const handleToggle = async () => {

    setLoading(true)

    try {

      await API.put(
        '/ai/task/update',
        {
          planId,
          day,
          taskIndex
        }
      )

      await onUpdate()

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }
  }

  return (
    <div
      onClick={handleToggle}
      className={`
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-lg
        border
        cursor-pointer
        transition-all
        duration-150

        ${
          task.completed

          ? `
            bg-zinc-800/50
            border-zinc-700/50
            opacity-60
          `

          : `
            bg-zinc-800
            border-zinc-700
            hover:border-violet-500/40
            hover:bg-zinc-700/50
          `
        }
      `}
    >

      {/* CHECKBOX */}
      <div className={`
        w-5
        h-5
        rounded-md
        border-2
        flex
        items-center
        justify-center
        shrink-0
        transition-all

        ${
          task.completed

          ? `
            bg-violet-600
            border-violet-600
          `

          : `
            border-zinc-600
          `
        }
      `}>

        {loading ? (

          <span className="
            w-3
            h-3
            border
            border-white/30
            border-t-white
            rounded-full
            animate-spin
          "/>

        ) : task.completed ? (

          <svg
            className="
              w-3
              h-3
              text-white
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="
              M5 13l4 4L19 7
            "/>
          </svg>

        ) : null}

      </div>

      {/* SUBJECT */}
      <span className={`
        flex-1
        text-sm
        font-medium

        ${
          task.completed

          ? `
            line-through
            text-zinc-500
          `

          : `
            text-zinc-200
          `
        }
      `}>

        {task.subject}

      </span>

      {/* HOURS */}
      <span className={`
        text-xs
        px-2.5
        py-1
        rounded-full
        border
        font-medium

        ${
          task.completed

          ? `
            bg-zinc-700/50
            border-zinc-600/50
            text-zinc-500
          `

          : `
            bg-violet-500/10
            border-violet-500/20
            text-violet-400
          `
        }
      `}>

        {task.hours}h

      </span>

    </div>
  )
}

function DayCard({
  dayData,
  planId,
  onUpdate
}) {

  const [open, setOpen] =
    useState(dayData.day === 1)

  const completed =
    dayData.tasks.filter(
      (t) => t.completed
    ).length

  const total =
    dayData.tasks.length

  const pct = total
    ? Math.round(
        (completed / total) * 100
      )
    : 0

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      overflow-hidden
      hover:border-zinc-700
      transition
    ">

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          gap-4
          px-5
          py-4
          cursor-pointer
        "
        onClick={() =>
          setOpen(!open)
        }
      >

        <div className="
          w-9
          h-9
          rounded-lg
          bg-violet-500/10
          border
          border-violet-500/20
          flex
          items-center
          justify-center
          shrink-0
        ">

          <span className="
            text-violet-400
            font-bold
            text-sm
          ">

            {dayData.day}

          </span>

        </div>

        <div className="
          flex-1
          min-w-0
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-1.5
          ">

            <span className="
              text-white
              font-medium
              text-sm
            ">
              Day {dayData.day}
            </span>

            <span className="
              text-zinc-500
              text-xs
            ">

              {completed}/{total}
              {" "}done

            </span>

          </div>

          {/* PROGRESS BAR */}
          <div className="
            w-full
            bg-zinc-800
            rounded-full
            h-1.5
          ">

            <div
              className="
                bg-linear-to-r
                from-violet-600
                to-violet-400
                h-1.5
                rounded-full
                transition-all
                duration-500
              "
              style={{
                width: `${pct}%`
              }}
            />

          </div>

        </div>

        <svg
          className={`
            w-4
            h-4
            text-zinc-500
            shrink-0
            transition-transform
            duration-200

            ${
              open
              ? 'rotate-180'
              : ''
            }
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="
            M19 9l-7 7-7-7
          "/>
        </svg>

      </div>

      {/* TASKS */}
      {open && (

        <div className="
          px-5
          pb-5
          space-y-2
          border-t
          border-zinc-800
          pt-4
        ">

          {dayData.tasks.map(
            (task, idx) => (

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

export default function StudyPlan({
  fetchDashboardData
}) {

  const { user } = useAuth()

  const [plan, setPlan] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [generating, setGenerating] =
    useState(false)

  const [showForm, setShowForm] =
    useState(false)

  const [form, setForm] =
    useState({
      subjects: '',
      hoursPerDay: '',
      days: '',
    })

  // FETCH PLAN
  const fetchPlan = useCallback(
    async () => {

      try {

        const res = await API.get(
          `/ai/plan/${user.id}`
        )

        setPlan(res.data)

      } catch {

        setPlan(null)

      } finally {

        setLoading(false)

      }
    },
    [user.id]
  )

  useEffect(() => {

    fetchPlan()

  }, [fetchPlan])

  // GENERATE PLAN
  const handleGenerate = async (
    e
  ) => {

    e.preventDefault()

    setGenerating(true)

    try {

      const res =
        await API.post(
          '/ai/generate',
          {
            userId: user.id,
            subjects: form.subjects,
            hoursPerDay:
              Number(
                form.hoursPerDay
              ),
            days:
              Number(form.days),
          }
        )

      setPlan(res.data)

      if (fetchDashboardData) {

        await fetchDashboardData()

      }

      setShowForm(false)

    } catch (err) {

      console.error(err)

    } finally {

      setGenerating(false)

    }
  }

  if (loading) {

    return (
      <div className="
        space-y-4
      ">

        {[...Array(4)].map(
          (_, i) => (

          <div
            key={i}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              h-20
              animate-pulse
            "
          />

        ))}

      </div>
    )
  }

  return (
    <div>

      {/* HEADER */}
      <div className="
        flex
        items-center
        justify-between
        mb-8
      ">

        <div>

          <h1 className="
            text-2xl
            font-bold
            text-white
          ">
            Study Plan
          </h1>

          <p className="
            text-zinc-500
            text-sm
            mt-1
          ">
            Your AI-generated schedule
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="
            flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            bg-linear-to-r
            from-violet-600
            to-violet-500
            text-white
            text-sm
            font-semibold
          "
        >

          New Plan

        </button>

      </div>

      {/* FORM */}
      {showForm && (

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-6
          mb-8
        ">

          <form
            onSubmit={handleGenerate}
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >

            <input
              type="text"
              placeholder="Subjects"
              value={form.subjects}
              onChange={(e) =>
                setForm({
                  ...form,
                  subjects:
                    e.target.value
                })
              }
              required
              className="
                bg-zinc-800
                border
                border-zinc-700
                rounded-lg
                px-4
                py-2.5
                text-white
              "
            />

            <input
              type="number"
              placeholder="Hours Per Day"
              value={form.hoursPerDay}
              onChange={(e) =>
                setForm({
                  ...form,
                  hoursPerDay:
                    e.target.value
                })
              }
              required
              className="
                bg-zinc-800
                border
                border-zinc-700
                rounded-lg
                px-4
                py-2.5
                text-white
              "
            />

            <input
              type="number"
              placeholder="Days"
              value={form.days}
              onChange={(e) =>
                setForm({
                  ...form,
                  days:
                    e.target.value
                })
              }
              required
              className="
                bg-zinc-800
                border
                border-zinc-700
                rounded-lg
                px-4
                py-2.5
                text-white
              "
            />

            <button
              type="submit"
              disabled={generating}
              className="
                md:col-span-3
                bg-violet-600
                hover:bg-violet-700
                text-white
                py-3
                rounded-xl
                font-semibold
              "
            >

              {generating
                ? 'Generating...'
                : 'Generate Plan'}

            </button>

          </form>

        </div>
      )}

      {/* EMPTY */}
      {!plan ? (

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-12
          text-center
        ">

          <h2 className="
            text-white
            text-xl
            font-semibold
            mb-2
          ">
            No study plan yet
          </h2>

          <p className="
            text-zinc-500
          ">
            Generate your first plan
          </p>

        </div>

      ) : (

        <div className="
          space-y-4
        ">

          {plan.plan.map(
            (day) => (

            <DayCard
              key={day.day}
              dayData={day}
              planId={plan._id}
              onUpdate={async () => {

                await fetchPlan()

                if (
                  fetchDashboardData
                ) {

                  await fetchDashboardData()

                }

              }}
            />

          ))}

        </div>
      )}

    </div>
  )
}
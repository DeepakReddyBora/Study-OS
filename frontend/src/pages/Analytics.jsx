import { useEffect, useState } from 'react'
import API from '../api/axios.js'

function StatCard({ label, value, icon, color }) {

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-5
      hover:border-zinc-700
      transition
    ">

      <div className={`
        w-9
        h-9
        rounded-lg
        flex
        items-center
        justify-center
        mb-4
        ${color}
      `}>
        {icon}
      </div>

      <div className="
        text-3xl
        font-bold
        text-white
        tracking-tight
        mb-1
      ">
        {value}
      </div>

      <div className="
        text-zinc-500
        text-sm
      ">
        {label}
      </div>

    </div>
  )
}

function SubjectBar({
  subject,
  hours,
  maxHours,
  index
}) {

  const colors = [
    'from-violet-600 to-violet-400',
    'from-teal-600 to-teal-400',
    'from-amber-600 to-amber-400',
    'from-pink-600 to-pink-400',
    'from-blue-600 to-blue-400',
    'from-emerald-600 to-emerald-400',
  ]

  const dotColors = [
    'bg-violet-400',
    'bg-teal-400',
    'bg-amber-400',
    'bg-pink-400',
    'bg-blue-400',
    'bg-emerald-400',
  ]

  const pct = maxHours
    ? Math.round((hours / maxHours) * 100)
    : 0

  return (
    <div className="
      flex
      items-center
      gap-4
    ">

      <div className={`
        w-2.5
        h-2.5
        rounded-full
        shrink-0
        ${dotColors[index % dotColors.length]}
      `} />

      <div className="flex-1">

        <div className="
          flex
          justify-between
          items-center
          mb-1.5
        ">

          <span className="
            text-zinc-300
            text-sm
            font-medium
          ">
            {subject}
          </span>

          <span className="
            text-zinc-500
            text-xs
          ">
            {hours}h
          </span>

        </div>

        <div className="
          w-full
          bg-zinc-800
          rounded-full
          h-2
        ">

          <div
            className={`
              bg-linear-to-r
              ${colors[index % colors.length]}
              h-2
              rounded-full
              transition-all
              duration-700
            `}
            style={{
              width: `${pct}%`
            }}
          />

        </div>

      </div>

      <span className="
        text-zinc-500
        text-xs
        w-10
        text-right
      ">
        {pct}%
      </span>

    </div>
  )
}

function ProgressRing({ pct }) {

  const r = 54

  const circ = 2 * Math.PI * r

  const offset =
    circ - (pct / 100) * circ

  return (
    <div className="
      flex
      flex-col
      items-center
      justify-center
      py-6
    ">

      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
      >

        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#27272a"
          strokeWidth="10"
        />

        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{
            transition:
              'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)'
          }}
        />

        <defs>
          <linearGradient
            id="ringGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#7c3aed"
            />
            <stop
              offset="100%"
              stopColor="#a78bfa"
            />
          </linearGradient>
        </defs>

        <text
          x="70"
          y="65"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="700"
        >
          {pct}%
        </text>

        <text
          x="70"
          y="83"
          textAnchor="middle"
          fill="#71717a"
          fontSize="11"
        >
          complete
        </text>

      </svg>

      <p className="
        text-zinc-500
        text-sm
        mt-2
      ">
        Overall Completion
      </p>

    </div>
  )
}

export default function Analytics() {

  const [analytics, setAnalytics] =
    useState(null)

  const [progress, setProgress] =
    useState(null)

  const [streak, setStreak] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const storedUser = JSON.parse(
          localStorage.getItem('user')
        )

        if (!storedUser?.id) return

        const [a, p, s] = await Promise.all([

          API.get(
            `/ai/analytics/${storedUser.id}`
          ),

          API.get(
            `/ai/progress/${storedUser.id}`
          ),

          API.get(
            `/ai/streak/${storedUser.id}`
          ),

        ])

        setAnalytics(a.data)

        setProgress(p.data)

        setStreak(s.data)

      } catch (error) {

        console.log(
          "Analytics Fetch Error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchAnalytics()

  }, [])

  if (loading) {

    return (
      <div className="space-y-4">

        <div className="
          grid
          grid-cols-2
          xl:grid-cols-4
          gap-4
        ">

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                h-32
                animate-pulse
              "
            />
          ))}

        </div>

      </div>
    )
  }

  if (!analytics) {

    return (
      <div className="
        text-center
        text-zinc-400
        mt-20
      ">
        No analytics data available
      </div>
    )
  }

  const maxHours =
    analytics.subjectStats
      ? Math.max(
          ...Object.values(
            analytics.subjectStats
          )
        )
      : 1

  const completionRate =
    analytics.totalTasks
      ? Math.round(
          (
            analytics.completedTasks /
            analytics.totalTasks
          ) * 100
        )
      : 0

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="
          text-2xl
          font-bold
          text-white
          tracking-tight
        ">
          Analytics
        </h1>

        <p className="
          text-zinc-500
          text-sm
          mt-1
        ">
          Track your study performance
        </p>

      </div>

      {/* STATS */}
      <div className="
        grid
        grid-cols-2
        xl:grid-cols-4
        gap-4
        mb-6
      ">

        <StatCard
          label="Total Tasks"
          value={analytics.totalTasks}
          color="bg-violet-500/10 text-violet-400"
          icon={<span>📚</span>}
        />

        <StatCard
          label="Completed"
          value={analytics.completedTasks}
          color="bg-emerald-500/10 text-emerald-400"
          icon={<span>✅</span>}
        />

        <StatCard
          label="Total Hours"
          value={`${analytics.totalHours}h`}
          color="bg-teal-500/10 text-teal-400"
          icon={<span>⏰</span>}
        />

        <StatCard
          label="Day Streak"
          value={`${streak?.streak ?? 0} 🔥`}
          color="bg-amber-500/10 text-amber-400"
          icon={<span>⚡</span>}
        />

      </div>

      {/* MAIN SECTION */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        mb-6
      ">

        {/* PROGRESS RING */}
        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
        ">

          <div className="
            px-6
            pt-5
            pb-2
            border-b
            border-zinc-800
          ">

            <h2 className="
              text-white
              font-semibold
              text-sm
            ">
              Completion Rate
            </h2>

          </div>

          <ProgressRing pct={completionRate} />

        </div>

        {/* SUBJECT BREAKDOWN */}
        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
        ">

          <div className="
            px-6
            pt-5
            pb-4
            border-b
            border-zinc-800
          ">

            <h2 className="
              text-white
              font-semibold
              text-sm
            ">
              Subject Hours Breakdown
            </h2>

          </div>

          <div className="
            px-6
            py-5
            space-y-5
          ">

            {Object.entries(
              analytics.subjectStats
            ).map(([subject, hours], i) => (

              <SubjectBar
                key={subject}
                subject={subject}
                hours={hours}
                maxHours={maxHours}
                index={i}
              />

            ))}

          </div>

        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-6
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <h2 className="
            text-white
            font-semibold
            text-sm
          ">
            Overall Progress
          </h2>

          <span className="
            text-violet-400
            font-bold
            text-sm
          ">

            {progress?.completedTasks ?? 0}
            {" / "}
            {progress?.totalTasks ?? 0}
            {" "}tasks

          </span>

        </div>

        <div className="
          w-full
          bg-zinc-800
          rounded-full
          h-3
        ">

          <div
            className="
              bg-linear-to-r
              from-violet-600
              to-violet-400
              h-3
              rounded-full
              transition-all
              duration-700
            "
            style={{
              width: `${completionRate}%`
            }}
          />

        </div>

      </div>

    </div>
  )
}
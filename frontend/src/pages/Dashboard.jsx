import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import API from '../api/axios.js'
import StudyPlan from './StudyPlan'

function StatCard({
  icon,
  label,
  value,
  delta,
  color
}) {

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-5
      hover:border-zinc-700
      transition
      group
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

      {delta && (
        <div className="
          mt-3
          inline-flex
          items-center
          gap-1
          text-xs
          font-medium
          text-emerald-400
          bg-emerald-400/10
          px-2.5
          py-1
          rounded-full
        ">

          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 15l7-7 7 7"/>
          </svg>

          {delta}

        </div>
      )}

    </div>
  )
}

export default function Dashboard() {

  const { user } = useAuth()

  const [progress, setProgress] =
    useState(null)

  const [streak, setStreak] =
    useState(null)

  const [analytics, setAnalytics] =
    useState(null)

  const [missed, setMissed] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  // FETCH DASHBOARD DATA
  const fetchDashboardData =
    async () => {

    try {

      const storedUser =
        JSON.parse(
          localStorage.getItem('user')
        )

      if (!storedUser?.id) return

      const [p, s, a, m] =
        await Promise.all([

          API.get(
            `/ai/progress/${storedUser.id}`
          ),

          API.get(
            `/ai/streak/${storedUser.id}`
          ),

          API.get(
            `/ai/analytics/${storedUser.id}`
          ),

          API.get(
            `/ai/missed/${storedUser.id}`
          ),

        ])

      setProgress(p.data)

      setStreak(s.data)

      setAnalytics(a.data)

      setMissed(m.data)

    } catch (error) {

      console.log(
        "Dashboard Fetch Error:",
        error
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchDashboardData()

  }, [])

  const subjectColors = [
    'bg-violet-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-emerald-500',
  ]

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
          Good day,
          {" "}
          {user?.name?.split(' ')[0]}
          {" "}👋
        </h1>

        <p className="
          text-zinc-500
          text-sm
          mt-1
        ">
          Here's your study overview
        </p>

      </div>

      {loading ? (

        <div className="
          grid
          grid-cols-4
          gap-4
          mb-8
        ">

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-5
                animate-pulse
                h-36
              "
            />
          ))}

        </div>

      ) : (

        <>
          {/* STATS */}
          <div className="
            grid
            grid-cols-2
            xl:grid-cols-4
            gap-4
            mb-8
          ">

            <StatCard
              label="Overall Progress"
              value={`${progress?.progress ?? 0}%`}
              delta="Keep going!"
              color="
                bg-violet-500/10
                text-violet-400
              "
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path d="
                    M9 11l3 3L22 4
                    M21 12v7a2 2 0 01-2 2
                    H5a2 2 0 01-2-2
                    V5a2 2 0 012-2h11
                  "/>
                </svg>
              }
            />

            <StatCard
              label="Day Streak"
              value={`${streak?.streak ?? 0} 🔥`}
              color="
                bg-amber-500/10
                text-amber-400
              "
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path d="
                    M13 2L3 14h9
                    l-1 8 10-12h-9
                    l1-8z
                  "/>
                </svg>
              }
            />

            <StatCard
              label="Total Hours"
              value={`${analytics?.totalHours ?? 0}h`}
              color="
                bg-teal-500/10
                text-teal-400
              "
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
            />

            <StatCard
              label="Missed Tasks"
              value={
                missed?.missedTasks?.length ?? 0
              }
              color="
                bg-red-500/10
                text-red-400
              "
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="
                    M15 9l-6 6
                    M9 9l6 6
                  "/>
                </svg>
              }
            />

          </div>

          {/* PROGRESS */}
          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            mb-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-3
            ">

              <h2 className="
                text-white
                font-semibold
                text-sm
              ">
                Completion Progress
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
              h-2.5
            ">

              <div
                className="
                  bg-linear-to-r
                  from-violet-600
                  to-violet-400
                  h-2.5
                  rounded-full
                  transition-all
                  duration-700
                "
                style={{
                  width: `${
                    progress?.progress ?? 0
                  }%`
                }}
              />

            </div>

          </div>

          {/* SUBJECT BREAKDOWN */}
          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            mb-8
          ">

            <h2 className="
              text-white
              font-semibold
              text-sm
              mb-5
            ">
              Subject Hours Breakdown
            </h2>

            <div className="space-y-4">

              {Object.entries(
                analytics?.subjectStats || {}
              ).length === 0 ? (

                <p className="
                  text-zinc-500
                  text-sm
                ">
                  No analytics available yet
                </p>

              ) : (

                Object.entries(
                  analytics.subjectStats
                ).map(([subject, hours], i) => {

                  const max = Math.max(
                    ...Object.values(
                      analytics.subjectStats
                    )
                  )

                  const pct = Math.round(
                    (hours / max) * 100
                  )

                  return (
                    <div key={subject}>

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
                        h-1.5
                      ">

                        <div
                          className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-700
                            ${
                              subjectColors[
                                i %
                                subjectColors.length
                              ]
                            }
                          `}
                          style={{
                            width: `${pct}%`
                          }}
                        />

                      </div>

                    </div>
                  )
                })

              )}

            </div>

          </div>

          {/* STUDY PLAN */}
          <StudyPlan
            fetchDashboardData={
              fetchDashboardData
            }
          />

        </>
      )}

    </div>
  )
}
import { useEffect, useState } from 'react'
import API from '../api/axios.js'

function DayCard({
  dayData,
  planId,
  fetchPlan,
  fetchDashboardData,
}) {

  const [loadingIndex, setLoadingIndex] =
    useState(null)

  const handleToggle = async (
    taskIndex
  ) => {

    setLoadingIndex(taskIndex)

    try {

      await API.put(
        '/ai/task/update',
        {
          planId,
          day: dayData.day,
          taskIndex,
        }
      )

      // REFRESH STUDY PLAN
      await fetchPlan()

      // REFRESH DASHBOARD + ANALYTICS
      if (fetchDashboardData) {

        await fetchDashboardData()

      }

    } catch (err) {

      console.error(err)

    } finally {

      setLoadingIndex(null)

    }
  }

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-5
    ">

      {/* HEADER */}
      <div className="
        flex
        items-center
        justify-between
        mb-5
      ">

        <div>

          <h3 className="
            text-white
            font-bold
            text-lg
          ">
            Day {dayData.day}
          </h3>

          <p className="
            text-zinc-500
            text-sm
          ">
            {dayData.tasks.length} tasks
          </p>

        </div>

        <div className="
          bg-violet-500/10
          text-violet-400
          text-xs
          font-medium
          px-3
          py-1
          rounded-full
          border
          border-violet-500/20
        ">

          {
            dayData.tasks.filter(
              t => t.completed
            ).length
          }
          /
          {dayData.tasks.length}
          {" "}Done

        </div>

      </div>

      {/* TASKS */}
      <div className="space-y-3">

        {dayData.tasks.map(
          (task, index) => (

          <div
            key={index}
            onClick={() =>
              handleToggle(index)
            }
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

              {loadingIndex === index ? (

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
        ))}

      </div>

    </div>
  )
}

export default function StudyPlan({
  fetchDashboardData
}) {

  const [plan, setPlan] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const fetchPlan = async () => {

    try {

      const storedUser =
        JSON.parse(
          localStorage.getItem('user')
        )

      if (!storedUser?.id) return

      const res = await API.get(
        `/ai/latest-plan/${storedUser.id}`
      )

      setPlan(res.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchPlan()

  }, [])

  if (loading) {

    return (
      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">

        {[...Array(4)].map((_, i) => (

          <div
            key={i}
            className="
              h-60
              rounded-2xl
              bg-zinc-900
              border
              border-zinc-800
              animate-pulse
            "
          />

        ))}

      </div>
    )
  }

  if (!plan) {

    return (
      <div className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-10
        text-center
      ">

        <div className="
          w-16
          h-16
          rounded-2xl
          bg-violet-500/10
          flex
          items-center
          justify-center
          mx-auto
          mb-5
        ">

          <svg
            className="
              w-8
              h-8
              text-violet-400
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
          >
            <path d="
              M12 5v14
              M5 12h14
            "/>
          </svg>

        </div>

        <h2 className="
          text-white
          font-bold
          text-xl
          mb-2
        ">
          No Study Plan Yet
        </h2>

        <p className="
          text-zinc-500
          text-sm
        ">
          Generate your first
          AI-powered study plan
        </p>

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
        mb-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-bold
            text-white
          ">
            Study Plan
          </h2>

          <p className="
            text-zinc-500
            text-sm
            mt-1
          ">
            Track your daily tasks
          </p>

        </div>

        <div className="
          bg-violet-500/10
          border
          border-violet-500/20
          text-violet-400
          text-sm
          font-medium
          px-4
          py-2
          rounded-xl
        ">

          {plan.days?.length || 0}
          {" "}Days

        </div>

      </div>

      {/* DAYS */}
      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">

        {plan.days?.map((day) => (

          <DayCard
            key={day.day}
            dayData={day}
            planId={plan._id}
            fetchPlan={fetchPlan}
            fetchDashboardData={
              fetchDashboardData
            }
          />

        ))}

      </div>

    </div>
  )
}
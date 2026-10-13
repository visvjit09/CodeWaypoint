
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { getDSAProblems } from "../../../services/operations/dsaAPI"

const cardClass =
  "rounded-xl border border-richblack-700 bg-richblack-800 p-5"

function DSAAnalytics() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAnalytics() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Reuse the existing DSA API to fetch this user's saved problems.
        const data = await getDSAProblems(token)
        if (active) setProblems(data)
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Could not load analytics"
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAnalytics()

    return () => {
      active = false
    }
  }, [token])

  const analytics = useMemo(() => {
    const total = problems.length
    const solved = problems.filter((p) => p.status === "Solved").length
    const inProgress = problems.filter(
      (p) => p.status === "In Progress"
    ).length
    const todo = problems.filter((p) => p.status === "Todo").length

    const difficulty = ["Easy", "Medium", "Hard"].map((name) => {
      const count = problems.filter((p) => p.difficulty === name).length
      return {
        name,
        count,
        percentage: total ? (count / total) * 100 : 0,
      }
    })

    const topicCounts = problems.reduce((counts,problem) => {
      counts[problem.topic] = (counts[problem.topic] || 0) + 1
      return counts
    }, {})

    const topics = Object.entries(topicCounts)
      .map(([name,count]) => ({ name,count }))
      .sort((a,b) => b.count - a.count)
      .slice(0,6)

    return {
      total,
      solved,
      inProgress,
      todo,
      completionRate: total ? Math.round((solved / total) * 100) : 0,
      difficulty,
      topics,
    }
  }, [problems])

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 px-6 py-10 text-richblack-5">
        Loading your learning analytics...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900 px-4 py-8 text-richblack-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-medium text-yellow-50">
          CODEWAYPOINT / ANALYTICS
        </p>

        <h1 className="text-3xl font-semibold sm:text-4xl">
          Learning Analytics
        </h1>

        <p className="mt-3 max-w-2xl text-richblack-300">
          Understand your DSA practice, monitor your progress, and identify
          the topics you're working on most.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Problems",value: analytics.total },
            { label: "Solved",value: analytics.solved },
            { label: "In Progress",value: analytics.inProgress },
            { label: "Completion Rate",value: `${analytics.completionRate}%` },
          ].map((item) => (
            <div className={cardClass} key={item.label}>
              <p className="text-sm text-richblack-300">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className={cardClass}>
            <h2 className="text-xl font-semibold">Difficulty Breakdown</h2>
            <p className="mt-1 text-sm text-richblack-300">
              Distribution of your saved problems.
            </p>

            <div className="mt-6 space-y-5">
              {analytics.difficulty.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {item.count} ({Math.round(item.percentage)}%)
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-richblack-700">
                    <div
                      className="h-full rounded-full bg-yellow-50"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-xl font-semibold">Practice Status</h2>
            <p className="mt-1 text-sm text-richblack-300">
              How your saved problems are progressing.
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: "Solved",value: analytics.solved },
                { label: "In Progress",value: analytics.inProgress },
                { label: "To Do",value: analytics.todo },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-richblack-700 p-4"
                >
                  <span>{item.label}</span>
                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${cardClass} lg:col-span-2`}>
            <h2 className="text-xl font-semibold">Topic Activity</h2>
            <p className="mt-1 text-sm text-richblack-300">
              Your six most frequently tracked topics.
            </p>

            {analytics.topics.length === 0 ? (
              <p className="py-8 text-sm text-richblack-300">
                Add some DSA problems to see topic analytics here.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analytics.topics.map((topic) => (
                  <div
                    key={topic.name}
                    className="rounded-lg border border-richblack-700 p-4"
                  >
                    <p className="font-medium">{topic.name}</p>
                    <p className="mt-2 text-sm text-richblack-300">
                      {topic.count} {topic.count === 1 ? "problem" : "problems"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/dashboard/dsa-tracker")}
              className="mt-6 rounded-lg bg-yellow-50 px-5 py-3 font-semibold text-richblack-900 hover:bg-yellow-100"
            >
              Open DSA Tracker
            </button>
          </section>
        </div>

        {analytics.total === 0 && (
          <p className="mt-6 text-sm text-richblack-300">
            Your analytics will populate automatically as you add problems and
            update their status.
          </p>
        )}
      </div>
    </div>
  )
}

export default DSAAnalytics
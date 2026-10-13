
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import {
  createDSAProblem,
  deleteDSAProblem,
  getDSAProblems,
  updateDSAProblem,
} from "../../../services/operations/dsaAPI"

const initialForm = {
  title: "",
  problemUrl: "",
  platform: "LeetCode",
  topic: "Arrays",
  difficulty: "Easy",
  status: "Todo",
  notes: "",
}

const inputClass =
  "w-full rounded-lg border border-richblack-600 bg-richblack-700 px-3 py-2.5 text-sm text-richblack-5 outline-none focus:border-yellow-50"

const labelClass = "mb-1.5 block text-sm text-richblack-100"

function DSATracker() {
  const { token } = useSelector((state) => state.auth)
  const [problems, setProblems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    let active = true

    async function loadProblems() {
      if (!token) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const data = await getDSAProblems(token)
        if (active) setProblems(data)
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message || error.message || "Could not load problems"
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProblems()

    return () => {
      active = false
    }
  }, [token])

  const stats = useMemo(() => {
    const solved = problems.filter((p) => p.status === "Solved").length
    const inProgress = problems.filter(
      (p) => p.status === "In Progress"
    ).length

    return {
      total: problems.length,
      solved,
      inProgress,
      remaining: problems.length - solved,
    }
  }, [problems])

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const query = search.toLowerCase()
      const matchesSearch =
        problem.title.toLowerCase().includes(query) ||
        problem.topic.toLowerCase().includes(query) ||
        problem.platform.toLowerCase().includes(query)

      const matchesDifficulty =
        difficultyFilter === "All" ||
        problem.difficulty === difficultyFilter

      const matchesStatus =
        statusFilter === "All" || problem.status === statusFilter

      return matchesSearch && matchesDifficulty && matchesStatus
    })
  }, [problems, search, difficultyFilter, statusFilter])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!token) {
      toast.error("Please log in to use the DSA tracker")
      return
    }

    setSaving(true)

    try {
      if (editingId) {
        const updated = await updateDSAProblem(editingId, form, token)
        setProblems((current) =>
          current.map((problem) =>
            problem._id === editingId ? updated : problem
          )
        )
        toast.success("Problem updated")
      } else {
        const created = await createDSAProblem(form, token)
        setProblems((current) => [created, ...current])
        toast.success("Problem added")
      }

      resetForm()
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Could not save problem"
      )
    } finally {
      setSaving(false)
    }
  }

  function startEditing(problem) {
    setEditingId(problem._id)
    setForm({
      title: problem.title,
      problemUrl: problem.problemUrl,
      platform: problem.platform,
      topic: problem.topic,
      difficulty: problem.difficulty,
      status: problem.status,
      notes: problem.notes || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this problem from your tracker?")) return

    try {
      await deleteDSAProblem(id, token)
      setProblems((current) => current.filter((p) => p._id !== id))

      if (editingId === id) resetForm()

      toast.success("Problem deleted")
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Could not delete problem"
      )
    }
  }

  async function handleStatusChange(problem, status) {
    try {
      const updated = await updateDSAProblem(
        problem._id,
        { status },
        token
      )

      setProblems((current) =>
        current.map((p) => (p._id === problem._id ? updated : p))
      )
      toast.success("Progress updated")
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Could not update status"
      )
    }
  }

  return (
    <div className="min-h-screen bg-richblack-900 px-4 py-8 text-richblack-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-yellow-50">
            CODEWAYPOINT / PRACTICE
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            DSA Practice Tracker
          </h1>
          <p className="mt-3 max-w-2xl text-richblack-300">
            Organize coding problems, track your progress, and build consistent
            interview preparation habits.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total Problems", value: stats.total },
            { label: "Solved", value: stats.solved },
            { label: "In Progress", value: stats.inProgress },
            { label: "Remaining", value: stats.remaining },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-richblack-700 bg-richblack-800 p-4 sm:p-5"
            >
              <p className="text-sm text-richblack-300">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Problem" : "Add a Problem"}
              </h2>
              <p className="mt-1 text-sm text-richblack-300">
                Save a problem and keep track of your solving progress.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-richblack-600 px-4 py-2 text-sm hover:bg-richblack-700"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="title">
                  Problem Title *
                </label>
                <input
                  className={inputClass}
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Two Sum"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="problemUrl">
                  Problem URL *
                </label>
                <input
                  className={inputClass}
                  id="problemUrl"
                  name="problemUrl"
                  type="url"
                  value={form.problemUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/problems/two-sum/"
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="platform">
                  Platform
                </label>
                <select
                  className={inputClass}
                  id="platform"
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                >
                  <option>LeetCode</option>
                  <option>GeeksforGeeks</option>
                  <option>Codeforces</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="topic">
                  Topic *
                </label>
                <select
                  className={inputClass}
                  id="topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                >
                  {[
                    "Arrays",
                    "Strings",
                    "Hashing",
                    "Two Pointers",
                    "Sliding Window",
                    "Binary Search",
                    "Linked List",
                    "Stack",
                    "Queue",
                    "Trees",
                    "Graphs",
                    "Backtracking",
                    "Dynamic Programming",
                    "Greedy",
                    "Heaps",
                    "Math",
                    "Other",
                  ].map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="difficulty">
                  Difficulty
                </label>
                <select
                  className={inputClass}
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="status">
                  Status
                </label>
                <select
                  className={inputClass}
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Solved</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="notes">
                Notes (optional)
              </label>
              <textarea
                className={inputClass}
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Approach, key insight, or what to revise..."
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-yellow-50 px-5 py-3 font-semibold text-richblack-900 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Problem"}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Your Problems</h2>
            <p className="mt-1 text-sm text-richblack-300">
              Search your list or filter by difficulty and progress.
            </p>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <input
              className={inputClass}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, topic, or platform..."
              aria-label="Search problems"
            />

            <select
              className={inputClass}
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              aria-label="Filter by difficulty"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select
              className={inputClass}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All</option>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Solved</option>
            </select>
          </div>

          {loading ? (
            <p className="py-10 text-center text-richblack-300">
              Loading your problems...
            </p>
          ) : filteredProblems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-richblack-600 px-4 py-12 text-center">
              <h3 className="text-lg font-medium">No problems found</h3>
              <p className="mt-2 text-sm text-richblack-300">
                Add your first problem above or adjust your filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="rounded-lg border border-richblack-700 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={problem.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-words text-lg font-medium text-yellow-50 hover:underline"
                        >
                          {problem.title}
                        </a>
                        <span className="rounded-full bg-richblack-700 px-2.5 py-1 text-xs">
                          {problem.difficulty}
                        </span>
                        <span className="rounded-full bg-richblack-700 px-2.5 py-1 text-xs">
                          {problem.topic}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-richblack-300">
                        {problem.platform}
                        {problem.createdAt &&
                          ` · Added ${new Date(problem.createdAt).toLocaleDateString()}`}
                      </p>

                      {problem.notes && (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-richblack-100">
                          {problem.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="rounded-lg border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
                        value={problem.status}
                        onChange={(event) =>
                          handleStatusChange(problem, event.target.value)
                        }
                        aria-label={`Status for ${problem.title}`}
                      >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Solved</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => startEditing(problem)}
                        className="rounded-lg border border-richblack-600 px-3 py-2 text-sm hover:bg-richblack-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(problem._id)}
                        className="rounded-lg border border-pink-700 px-3 py-2 text-sm text-pink-200 hover:bg-pink-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DSATracker

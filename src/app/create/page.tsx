"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, X, Loader2 } from "lucide-react"
import styles from "./page.module.css"

interface Category {
  id: string
  name: string
  icon: string
}

export default function CreatePollPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [options, setOptions] = useState([{ text: "", isOther: false }, { text: "", isOther: false }])
  const [includeOther, setIncludeOther] = useState(true)
  const [durationHours, setDurationHours] = useState("24")
  const [resultVisibility, setResultVisibility] = useState("IMMEDIATE")
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, { text: "", isOther: false }])
    }
  }

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx))
    }
  }

  const updateOption = (idx: number, text: string) => {
    const newOpts = [...options]
    newOpts[idx] = { ...newOpts[idx], text }
    setOptions(newOpts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    const allOptions = [...options.filter((o) => o.text.trim())]
    if (includeOther) {
      allOptions.push({ text: "Other", isOther: true })
    }

    if (allOptions.length < 2) {
      setError("Please add at least 2 options")
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          options: allOptions,
          durationHours: parseFloat(durationHours),
          resultVisibility,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create poll")
      }

      const poll = await res.json()
      router.push(`/p/${poll.code}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="page-wrapper">
        <div className="container-sm text-center">
          <Loader2 className="animate-spin" size={32} />
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="page-wrapper">
      <div className="container-sm">
        <h1 className={styles.pageTitle}>Create a Poll</h1>
        <p className={styles.pageSubtitle}>Ask your community anything</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Poll Title *</label>
            <input
              type="text"
              className="input"
              placeholder="What do you want to ask?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input textarea"
              placeholder="Add more context (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="input select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Options * (min 2, max 10)</label>
            <div className={styles.optionsList}>
              {options.map((opt, idx) => (
                <div key={idx} className={styles.optionRow}>
                  <span className={styles.optionNum}>{idx + 1}</span>
                  <input
                    type="text"
                    className="input"
                    placeholder={`Option ${idx + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    required
                    maxLength={200}
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} className={styles.removeBtn}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button type="button" onClick={addOption} className={`btn btn-ghost ${styles.addBtn}`}>
                <Plus size={16} /> Add Option
              </button>
            )}

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeOther}
                onChange={(e) => setIncludeOther(e.target.checked)}
              />
              Include &quot;Other&quot; option with text input
            </label>
          </div>

          <div className={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Duration *</label>
              <select
                className="input select"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="4">4 Hours</option>
                <option value="6">6 Hours</option>
                <option value="8">8 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
              </select>
              <span className="form-hint">Can be extended later (up to 1 month total)</span>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Result Visibility</label>
              <select
                className="input select"
                value={resultVisibility}
                onChange={(e) => setResultVisibility(e.target.value)}
              >
                <option value="IMMEDIATE">Show immediately</option>
                <option value="AFTER_VOTE">Show after voting</option>
                <option value="AFTER_CLOSE">Show after poll closes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Creating...
              </>
            ) : (
              "Create Poll"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

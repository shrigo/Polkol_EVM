"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2, Plus, ExternalLink, Copy, Check, Clock,
  Download, XCircle, Timer, BarChart3
} from "lucide-react"
import { CountdownTimer } from "@/components/CountdownTimer"
import styles from "./page.module.css"

interface DashboardPoll {
  id: string
  code: string
  title: string
  status: string
  endsAt: string
  createdAt: string
  category: { name: string; icon: string }
  _count: { votes: number }
}

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [polls, setPolls] = useState<DashboardPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [copiedCode, setCopiedCode] = useState("")
  const [extending, setExtending] = useState("")
  const [extendHours, setExtendHours] = useState("24")

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin")
  }, [authStatus, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchPolls()
    }
  }, [session])

  const fetchPolls = async () => {
    try {
      const res = await fetch("/api/polls?limit=50")
      const data = await res.json()
      // Filter to only user's polls
      const myPolls = data.polls.filter(
        (p: DashboardPoll & { creator: { id: string } }) => p.creator?.id === session?.user?.id
      )
      setPolls(myPolls)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${code}`)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const closePoll = async (id: string) => {
    if (!confirm("Are you sure you want to close this poll?")) return
    await fetch(`/api/polls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    })
    fetchPolls()
  }

  const extendPoll = async (id: string) => {
    const res = await fetch(`/api/polls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "extend", additionalHours: parseFloat(extendHours) }),
    })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Failed to extend")
    }
    setExtending("")
    fetchPolls()
  }

  const exportCSV = (id: string) => {
    window.open(`/api/polls/${id}/export`, "_blank")
  }

  const getStatusBadge = (poll: DashboardPoll) => {
    const isClosed = poll.status === "CLOSED" || new Date(poll.endsAt) < new Date()
    if (isClosed) return <span className="badge badge-danger">Closed</span>
    if (poll.status === "EXTENDED") return <span className="badge badge-warning">Extended</span>
    return <span className="badge badge-success">Active</span>
  }

  const filtered = polls.filter((p) => {
    if (filter === "ALL") return true
    const isClosed = p.status === "CLOSED" || new Date(p.endsAt) < new Date()
    if (filter === "ACTIVE") return !isClosed && p.status !== "EXTENDED"
    if (filter === "EXTENDED") return p.status === "EXTENDED" && !isClosed
    if (filter === "CLOSED") return isClosed
    return true
  })

  if (authStatus === "loading" || loading) {
    return (
      <div className="page-wrapper">
        <div className="container text-center" style={{ padding: "4rem 1rem" }}>
          <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Dashboard</h1>
            <p className={styles.pageSubtitle}>
              {polls.length} poll{polls.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <Link href="/create" className="btn btn-primary">
            <Plus size={18} /> Create Poll
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--primary-light)" }}>
              <BarChart3 size={22} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <div className="stat-value">{polls.length}</div>
              <div className="stat-label">Total Polls</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--success-light)" }}>
              <Check size={22} style={{ color: "var(--success)" }} />
            </div>
            <div>
              <div className="stat-value">{polls.reduce((s, p) => s + p._count.votes, 0)}</div>
              <div className="stat-label">Total Votes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--warning-light)" }}>
              <Clock size={22} style={{ color: "var(--warning)" }} />
            </div>
            <div>
              <div className="stat-value">
                {polls.filter((p) => p.status !== "CLOSED" && new Date(p.endsAt) > new Date()).length}
              </div>
              <div className="stat-label">Active</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="tabs" style={{ marginBottom: "1.5rem" }}>
          {["ALL", "ACTIVE", "EXTENDED", "CLOSED"].map((f) => (
            <button
              key={f}
              className={`tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Polls List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p className="empty-state-title">No polls found</p>
            <p>{filter === "ALL" ? "Create your first poll!" : `No ${filter.toLowerCase()} polls`}</p>
          </div>
        ) : (
          <div className={styles.pollList}>
            {filtered.map((poll) => (
              <div key={poll.id} className={styles.pollRow}>
                <div className={styles.pollInfo}>
                  <div className={styles.pollTop}>
                    <span className={styles.category}>{poll.category.icon} {poll.category.name}</span>
                    {getStatusBadge(poll)}
                  </div>
                  <Link href={`/p/${poll.code}`} className={styles.pollTitle}>
                    {poll.title}
                  </Link>
                  <div className={styles.pollBottom}>
                    <span>{poll._count.votes} votes</span>
                    <span>·</span>
                    <CountdownTimer endsAt={poll.endsAt} compact />
                  </div>
                </div>

                <div className={styles.pollActions}>
                  <Link href={`/p/${poll.code}`} className="btn btn-ghost btn-sm" title="View">
                    <ExternalLink size={15} />
                  </Link>
                  <button
                    onClick={() => copyLink(poll.code)}
                    className="btn btn-ghost btn-sm"
                    title="Copy link"
                  >
                    {copiedCode === poll.code ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <button
                    onClick={() => exportCSV(poll.id)}
                    className="btn btn-ghost btn-sm"
                    title="Export CSV"
                  >
                    <Download size={15} />
                  </button>
                  {poll.status !== "CLOSED" && new Date(poll.endsAt) > new Date() && (
                    <>
                      <button
                        onClick={() => setExtending(extending === poll.id ? "" : poll.id)}
                        className="btn btn-ghost btn-sm"
                        title="Extend"
                      >
                        <Timer size={15} />
                      </button>
                      <button
                        onClick={() => closePoll(poll.id)}
                        className="btn btn-ghost btn-sm"
                        title="Close"
                        style={{ color: "var(--danger)" }}
                      >
                        <XCircle size={15} />
                      </button>
                    </>
                  )}
                </div>

                {/* Extend panel */}
                {extending === poll.id && (
                  <div className={styles.extendPanel}>
                    <select
                      className="input select"
                      value={extendHours}
                      onChange={(e) => setExtendHours(e.target.value)}
                      style={{ maxWidth: 200 }}
                    >
                      <option value="1">+1 Hour</option>
                      <option value="6">+6 Hours</option>
                      <option value="12">+12 Hours</option>
                      <option value="24">+24 Hours</option>
                      <option value="48">+2 Days</option>
                      <option value="168">+7 Days</option>
                    </select>
                    <button onClick={() => extendPoll(poll.id)} className="btn btn-primary btn-sm">
                      Extend
                    </button>
                    <button onClick={() => setExtending("")} className="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

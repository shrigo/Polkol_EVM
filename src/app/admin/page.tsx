"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Users, BarChart3, Shield, Trash2, Star, AlertTriangle } from "lucide-react"
import styles from "./page.module.css"

interface AdminStats {
  totalUsers: number
  totalPolls: number
  totalVotes: number
  activePolls: number
}

interface AdminPoll {
  id: string
  code: string
  title: string
  status: string
  isFeatured: boolean
  createdAt: string
  category: { name: string }
  creator: { name: string; email: string }
  _count: { votes: number }
}

interface AdminReport {
  id: string
  reason: string
  status: string
  createdAt: string
  poll: { id: string; title: string; code: string }
  user: { name: string; email: string } | null
}

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [polls, setPolls] = useState<AdminPoll[]>([])
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"polls" | "reports">("polls")

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin")
    if (authStatus === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [authStatus, session, router])

  useEffect(() => {
    if (session?.user?.role === "admin") fetchData()
  }, [session])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStats(data.stats)
      setPolls(data.recentPolls)
      setReports(data.reports)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const deletePoll = async (id: string) => {
    if (!confirm("Delete this poll?")) return
    await fetch(`/api/polls/${id}`, { method: "DELETE" })
    fetchData()
  }

  const toggleFeatured = async (id: string) => {
    await fetch(`/api/polls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleFeatured" }),
    })
    fetchData()
  }

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
        <h1 className={styles.pageTitle}>
          <Shield size={28} /> Admin Dashboard
        </h1>

        {/* Stats */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--primary-light)" }}>
                <Users size={22} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Users</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--accent-light)" }}>
                <BarChart3 size={22} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="stat-value">{stats.totalPolls}</div>
                <div className="stat-label">Polls</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--success-light)" }}>
                <Users size={22} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <div className="stat-value">{stats.totalVotes}</div>
                <div className="stat-label">Votes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--warning-light)" }}>
                <AlertTriangle size={22} style={{ color: "var(--warning)" }} />
              </div>
              <div>
                <div className="stat-value">{reports.length}</div>
                <div className="stat-label">Pending Reports</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: "1.5rem" }}>
          <button className={`tab ${tab === "polls" ? "active" : ""}`} onClick={() => setTab("polls")}>
            All Polls ({polls.length})
          </button>
          <button className={`tab ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>
            Reports ({reports.length})
          </button>
        </div>

        {/* Polls Table */}
        {tab === "polls" && (
          <div className={styles.table}>
            {polls.map((poll) => (
              <div key={poll.id} className={styles.tableRow}>
                <div className={styles.tableMain}>
                  <Link href={`/p/${poll.code}`} className={styles.tablePollTitle}>
                    {poll.isFeatured && <Star size={14} fill="var(--warning)" color="var(--warning)" />}
                    {poll.title}
                  </Link>
                  <div className={styles.tableMeta}>
                    <span>{poll.category.name}</span>
                    <span>·</span>
                    <span>{poll.creator?.name || poll.creator?.email}</span>
                    <span>·</span>
                    <span>{poll._count.votes} votes</span>
                    <span>·</span>
                    <span className={`badge badge-${poll.status === "CLOSED" ? "danger" : "success"}`}>
                      {poll.status}
                    </span>
                  </div>
                </div>
                <div className={styles.tableActions}>
                  <button onClick={() => toggleFeatured(poll.id)} className="btn btn-ghost btn-sm" title="Toggle featured">
                    <Star size={15} fill={poll.isFeatured ? "var(--warning)" : "none"} />
                  </button>
                  <button onClick={() => deletePoll(poll.id)} className="btn btn-ghost btn-sm" title="Delete" style={{ color: "var(--danger)" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports */}
        {tab === "reports" && (
          <div className={styles.table}>
            {reports.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No pending reports</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className={styles.tableRow}>
                  <div className={styles.tableMain}>
                    <p className={styles.tablePollTitle}>
                      <AlertTriangle size={14} color="var(--warning)" />
                      {report.poll.title}
                    </p>
                    <p className={styles.tableMeta}>
                      <span>Reason: {report.reason}</span>
                      <span>·</span>
                      <span>By: {report.user?.name || "Anonymous"}</span>
                    </p>
                  </div>
                  <div className={styles.tableActions}>
                    <Link href={`/p/${report.poll.code}`} className="btn btn-ghost btn-sm">View</Link>
                    <button onClick={() => deletePoll(report.poll.id)} className="btn btn-danger btn-sm">Remove Poll</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

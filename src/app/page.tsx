import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Clock, Users, BarChart3, Globe, Zap, Shield } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PollCard } from "@/components/PollCard"
import styles from "./page.module.css"

export const dynamic = "force-dynamic"

export default async function Home() {
  // Seed categories if empty
  const catCount = await prisma.category.count()
  if (catCount === 0) {
    const cats = [
      { name: "Politics", slug: "politics", description: "Political polls", icon: "🏛️" },
      { name: "World Affairs", slug: "world-affairs", description: "Global events", icon: "🌍" },
      { name: "Entertainment", slug: "entertainment", description: "Movies, music, TV", icon: "🎬" },
      { name: "Sports", slug: "sports", description: "Sports events", icon: "⚽" },
      { name: "Technology", slug: "technology", description: "Tech trends", icon: "💻" },
      { name: "Miscellaneous", slug: "miscellaneous", description: "Everything else", icon: "📊" },
    ]
    for (const c of cats) {
      await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    }
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { polls: true } } },
    orderBy: { name: "asc" },
  })

  const recentPolls = await prisma.poll.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { votes: true } },
    },
  })

  const trendingPolls = await prisma.poll.findMany({
    take: 4,
    where: { status: { in: ["ACTIVE", "EXTENDED"] } },
    orderBy: { votes: { _count: "desc" } },
    include: {
      category: true,
      _count: { select: { votes: true } },
    },
  })

  const [totalPolls, totalVotes, totalUsers] = await Promise.all([
    prisma.poll.count(),
    prisma.vote.count(),
    prisma.user.count(),
  ])

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Zap size={14} />
            Real-time polling platform
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-in`}>
            Create & Share Polls<br />
            <span className={styles.heroGradient}>in Seconds</span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in`}>
            Engage your audience with beautifully designed, real-time polls.
            <strong> Every Voice Matters!</strong>
          </p>
          <div className={`${styles.heroActions} animate-fade-in`}>
            <Link href="/create" className="btn btn-primary btn-lg">
              Create a Poll Now
            </Link>
            <Link href="#explore" className="btn btn-secondary btn-lg">
              Explore Polls
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <Image src="/logo.png" alt="Polkol" width={200} height={72} className={styles.heroIcon} priority />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--primary-light)" }}>
                <BarChart3 size={22} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <div className="stat-value">{totalPolls.toLocaleString()}</div>
                <div className="stat-label">Total Polls</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--success-light)" }}>
                <Users size={22} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <div className="stat-value">{totalVotes.toLocaleString()}</div>
                <div className="stat-label">Total Votes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--accent-light)" }}>
                <Globe size={22} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="stat-value">{totalUsers.toLocaleString()}</div>
                <div className="stat-label">Creators</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="explore" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <Shield size={22} />
            Browse Categories
          </h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryCount}>{cat._count.polls} polls</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trendingPolls.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={22} />
              Trending Polls
            </h2>
            <div className={styles.pollGrid}>
              {trendingPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  code={poll.code}
                  title={poll.title}
                  category={poll.category.name}
                  categoryIcon={poll.category.icon}
                  endsAt={poll.endsAt.toISOString()}
                  status={poll.status}
                  voteCount={poll._count.votes}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <Clock size={22} />
            Latest Polls
          </h2>
          {recentPolls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p className="empty-state-title">No polls yet</p>
              <p>Be the first to create a poll!</p>
              <Link href="/create" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Create Poll
              </Link>
            </div>
          ) : (
            <div className={styles.pollGrid}>
              {recentPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  code={poll.code}
                  title={poll.title}
                  category={poll.category.name}
                  categoryIcon={poll.category.icon}
                  endsAt={poll.endsAt.toISOString()}
                  status={poll.status}
                  voteCount={poll._count.votes}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

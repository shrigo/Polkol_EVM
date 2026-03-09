import Link from "next/link"
import { Users, Clock, ArrowRight } from "lucide-react"
import { CountdownTimer } from "./CountdownTimer"
import styles from "./PollCard.module.css"

interface PollCardProps {
  code: string
  title: string
  description?: string
  category: string
  categoryIcon?: string
  endsAt: string
  status: string
  voteCount: number
  createdAt?: string
}

export function PollCard({ code, title, category, categoryIcon, endsAt, status, voteCount }: PollCardProps) {
  const isClosed = status === "CLOSED" || new Date(endsAt) < new Date()

  return (
    <Link href={`/p/${code}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.category}>
          {categoryIcon && <span>{categoryIcon}</span>}
          {category}
        </span>
        {isClosed ? (
          <span className="badge badge-danger">Closed</span>
        ) : status === "EXTENDED" ? (
          <span className="badge badge-warning">Extended</span>
        ) : (
          <CountdownTimer endsAt={endsAt} compact />
        )}
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.footer}>
        <span className={styles.votes}>
          <Users size={14} />
          {voteCount.toLocaleString()} vote{voteCount !== 1 ? "s" : ""}
        </span>
        <span className={styles.viewBtn}>
          Vote <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

"use client"

import styles from "./ResultChart.module.css"

interface ResultOption {
  id: string
  text: string
  isOther: boolean
  _count: { votes: number }
}

interface ResultChartProps {
  options: ResultOption[]
  totalVotes: number
}

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--info)",
  "#f43f5e",
  "#14b8a6",
  "#f97316",
  "#a855f7",
  "#64748b",
]

export function ResultChart({ options, totalVotes }: ResultChartProps) {
  const sorted = [...options].sort((a, b) => b._count.votes - a._count.votes)

  return (
    <div className={styles.chart}>
      {sorted.map((option, idx) => {
        const pct = totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0
        const color = COLORS[idx % COLORS.length]

        return (
          <div key={option.id} className={styles.bar}>
            <div className={styles.barHeader}>
              <span className={styles.barLabel}>
                {option.text}
                {option.isOther && <span className={styles.otherBadge}>Other</span>}
              </span>
              <span className={styles.barStats}>
                {option._count.votes} vote{option._count.votes !== 1 ? "s" : ""} · {pct.toFixed(1)}%
              </span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  "--progress": `${pct}%`,
                  "--color": color,
                } as React.CSSProperties}
              />
            </div>
          </div>
        )
      })}

      <div className={styles.totalVotes}>
        Total: <strong>{totalVotes.toLocaleString()}</strong> vote{totalVotes !== 1 ? "s" : ""}
      </div>
    </div>
  )
}

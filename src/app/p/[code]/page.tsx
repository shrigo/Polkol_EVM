"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { CountdownTimer } from "@/components/CountdownTimer"
import { ResultChart } from "@/components/ResultChart"
import { ShareButtons } from "@/components/ShareButtons"
import { generateFingerprint, getBaseUrl } from "@/lib/utils"
import styles from "./page.module.css"

interface PollOption {
  id: string
  text: string
  isOther: boolean
  _count: { votes: number }
}

interface PollData {
  id: string
  code: string
  title: string
  description: string
  status: string
  resultVisibility: string
  endsAt: string
  createdAt: string
  category: { name: string; icon: string }
  creator: { name: string; image: string }
  options: PollOption[]
  _count: { votes: number }
}

export default function PollVotingPage() {
  const { code } = useParams<{ code: string }>()
  const [poll, setPoll] = useState<PollData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState("")
  const [customText, setCustomText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState("")
  const [voteSuccess, setVoteSuccess] = useState(false)

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${code}`)
      if (!res.ok) throw new Error("Poll not found")
      const data = await res.json()
      setPoll(data)
    } catch {
      setError("Poll not found")
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchPoll()
  }, [fetchPoll])

  // Check if user already voted (via localStorage)
  useEffect(() => {
    if (poll) {
      const voted = localStorage.getItem(`voted_${poll.id}`)
      if (voted) setHasVoted(true)
    }
  }, [poll])

  const handleVote = async () => {
    if (!selectedOption || !poll) return
    setSubmitting(true)
    setError("")

    const selectedOpt = poll.options.find((o) => o.id === selectedOption)
    if (selectedOpt?.isOther && !customText.trim()) {
      setError("Please enter your response for 'Other'")
      setSubmitting(false)
      return
    }

    try {
      const fp = generateFingerprint()
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionId: selectedOption,
          fingerprint: fp,
          customText: selectedOpt?.isOther ? customText : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to vote")
      }

      setHasVoted(true)
      setVoteSuccess(true)
      localStorage.setItem(`voted_${poll.id}`, "true")

      // Refresh poll data
      await fetchPoll()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container-sm text-center" style={{ padding: "4rem 1rem" }}>
          <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      </div>
    )
  }

  if (!poll || error === "Poll not found") {
    return (
      <div className="page-wrapper">
        <div className="container-sm text-center" style={{ padding: "4rem 1rem" }}>
          <AlertCircle size={48} style={{ color: "var(--danger)", marginBottom: "1rem" }} />
          <h2>Poll Not Found</h2>
          <p className="text-muted">This poll may have been removed or the link is invalid.</p>
        </div>
      </div>
    )
  }

  const isClosed = poll.status === "CLOSED" || new Date(poll.endsAt) < new Date()
  const showResults =
    isClosed ||
    hasVoted ||
    poll.resultVisibility === "IMMEDIATE" ||
    (poll.resultVisibility === "AFTER_VOTE" && hasVoted) ||
    (poll.resultVisibility === "AFTER_CLOSE" && isClosed)
  const canVote = !isClosed && !hasVoted
  const baseUrl = getBaseUrl()
  const pollUrl = `${baseUrl}/p/${poll.code}`

  return (
    <div className="page-wrapper">
      <div className="container-sm">
        {/* Vote Success Toast */}
        {voteSuccess && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={20} />
            Your vote has been recorded!
          </div>
        )}

        <div className={styles.pollCard}>
          {/* Poll Header */}
          <div className={styles.pollHeader}>
            <div className={styles.pollMeta}>
              <span className="badge badge-primary">
                {poll.category.icon} {poll.category.name}
              </span>
              <CountdownTimer endsAt={poll.endsAt} compact={false} />
            </div>
            <h1 className={styles.pollTitle}>{poll.title}</h1>
            {poll.description && (
              <p className={styles.pollDescription}>{poll.description}</p>
            )}
            <p className={styles.pollStats}>
              {poll._count.votes.toLocaleString()} vote{poll._count.votes !== 1 ? "s" : ""}
              {poll.creator?.name && <> · by {poll.creator.name}</>}
            </p>
          </div>

          {/* Error */}
          {error && error !== "Poll not found" && (
            <div className={styles.error}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Voting Form */}
          {canVote && (
            <div className={styles.votingSection}>
              <h3 className={styles.votingSectionTitle}>Cast your vote</h3>
              <div className={styles.optionsList}>
                {poll.options.map((option) => (
                  <label
                    key={option.id}
                    className={`${styles.optionLabel} ${selectedOption === option.id ? styles.optionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioCustom} />
                    <span className={styles.optionText}>
                      {option.text}
                      {option.isOther && <span className={styles.otherTag}>write-in</span>}
                    </span>
                  </label>
                ))}
              </div>

              {/* Other text input */}
              {selectedOption && poll.options.find((o) => o.id === selectedOption)?.isOther && (
                <div className={styles.otherInput}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Type your response..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={200}
                    autoFocus
                  />
                </div>
              )}

              <button
                onClick={handleVote}
                disabled={!selectedOption || submitting}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Vote"
                )}
              </button>
            </div>
          )}

          {/* Already voted */}
          {hasVoted && !voteSuccess && (
            <div className={styles.alreadyVoted}>
              <CheckCircle2 size={20} />
              You have already voted on this poll
            </div>
          )}

          {/* Closed */}
          {isClosed && (
            <div className={styles.closedBanner}>
              This poll has ended
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className={styles.resultsSection}>
              <h3 className={styles.resultsSectionTitle}>Results</h3>
              <ResultChart options={poll.options} totalVotes={poll._count.votes} />
            </div>
          )}

          {/* Share & QR */}
          <div className="divider" />
          <ShareButtons url={pollUrl} title={poll.title} code={poll.code} />
        </div>
      </div>
    </div>
  )
}

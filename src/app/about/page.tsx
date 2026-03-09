import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Polkol — the modern polling platform where every voice matters.",
}

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <div className="container-sm">
        <div className="card-flat" style={{ padding: "2.5rem", borderRadius: "var(--radius-2xl)" }}>
          <div className="text-center" style={{ marginBottom: "2rem" }}>
            <Image src="/logo.png" alt="Polkol" width={250} height={75} style={{ marginBottom: "1rem" }} />
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>About Polkol</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Every Voice Matters</p>
          </div>

          <div style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem" }}>
              <strong>Polkol</strong> is a modern, real-time polling platform designed to amplify every voice.
              Whether you&apos;re gauging public opinion on politics, discovering trending entertainment topics,
              or simply settling a debate among friends — Polkol makes it effortless.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>What We Offer</h3>
            <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
              <li>Instant poll creation with up to 10 options + custom &quot;Other&quot; responses</li>
              <li>Real-time results with beautiful animated charts</li>
              <li>Social sharing to WhatsApp, Telegram, X, Facebook, and more</li>
              <li>Smart duplicate vote prevention</li>
              <li>Timed polls with automatic expiration (1 hour to 1 month)</li>
              <li>Category-based discovery</li>
              <li>Creator dashboards with CSV export</li>
              <li>Dark mode / Light mode</li>
            </ul>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>Our Mission</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              We believe that opinions shape the world. Polkol exists to provide a fair, accessible, and
              beautifully designed platform where anyone can create a poll and let the community decide.
            </p>

            <div className="text-center" style={{ marginTop: "2rem" }}>
              <Link href="/create" className="btn btn-primary btn-lg">
                Create Your First Poll
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

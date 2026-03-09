import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Polkol team.",
}

export default function ContactPage() {
  return (
    <div className="page-wrapper">
      <div className="container-sm">
        <div className="card-flat" style={{ padding: "2.5rem", borderRadius: "var(--radius-2xl)" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Contact Us</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Have questions, feedback, or need support? Reach out to us.
          </p>

          <div style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>Get in Touch</h3>
            <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.5rem", listStyle: "none" }}>
              <li style={{ marginBottom: "0.5rem" }}>📧 Email: <a href="mailto:support@polkol.com" style={{ color: "var(--primary)" }}>support@polkol.com</a></li>
              <li style={{ marginBottom: "0.5rem" }}>🐦 Twitter: <a href="https://twitter.com/polkol" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>@polkol</a></li>
            </ul>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>Report Abuse</h3>
            <p>
              If you encounter inappropriate content or abuse on the platform, you can report individual
              polls directly from the poll page, or email us at{" "}
              <a href="mailto:abuse@polkol.com" style={{ color: "var(--primary)" }}>abuse@polkol.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

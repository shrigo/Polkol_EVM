import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Polkol.com privacy policy — how we handle your data.",
}

export default function PrivacyPage() {
  return (
    <div className="page-wrapper">
      <div className="container-sm">
        <div className="card-flat" style={{ padding: "2.5rem", borderRadius: "var(--radius-2xl)" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>Privacy Policy</h1>

          <div style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem" }}><em>Last updated: March 2026</em></p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>1. Information We Collect</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              When you sign in with Google, we collect your name, email address, and profile picture.
              When you vote, we collect a browser fingerprint and hashed IP address to prevent duplicate voting.
              We do not sell or share your personal data with third parties.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>2. How We Use Your Information</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Your information is used to provide the polling service, authenticate your identity,
              prevent abuse, and improve the platform. Vote data is anonymized and aggregated for results.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>3. Data Security</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              We use industry-standard security measures to protect your data. All connections are encrypted.
              Passwords are not stored as we use OAuth-based authentication only.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>4. Cookies</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              We use session cookies for authentication and localStorage for theme preferences and vote tracking.
              No third-party tracking cookies are used.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>5. Your Rights</h3>
            <p>
              You may request deletion of your account and associated data by contacting us at{" "}
              <a href="mailto:privacy@polkol.com" style={{ color: "var(--primary)" }}>privacy@polkol.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

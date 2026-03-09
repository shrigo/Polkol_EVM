import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Polkol.com terms of service.",
}

export default function TermsPage() {
  return (
    <div className="page-wrapper">
      <div className="container-sm">
        <div className="card-flat" style={{ padding: "2.5rem", borderRadius: "var(--radius-2xl)" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>Terms of Service</h1>

          <div style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem" }}><em>Last updated: March 2026</em></p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>1. Acceptance of Terms</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              By accessing or using Polkol.com, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the platform.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>2. User Accounts</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              You must be at least 13 years of age to create an account. You are responsible for maintaining
              the security of your account and for all activities under your account.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>3. Poll Content</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              You are responsible for all content you create. Polls must not contain illegal, harmful,
              hateful, or misleading content. We reserve the right to remove any content that violates
              these terms or community guidelines.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>4. Voting Integrity</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Attempting to manipulate poll results through automated voting, multiple accounts,
              or other means is strictly prohibited and may result in account suspension.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>5. Limitation of Liability</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Polkol is provided &quot;as is&quot; without warranties. We are not responsible for the accuracy
              of poll results, user-generated content, or any decisions made based on poll outcomes.
            </p>

            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>6. Changes to Terms</h3>
            <p>
              We may update these terms at any time. Continued use of the platform after changes
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import Image from "next/image"
import styles from "./Footer.module.css"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Image src="/logo.png" alt="Polkol" width={100} height={30} className={styles.footerLogo} />
            <p className={styles.footerTagline}>
              Every Voice Matters. Create, share, and discover polls that bring communities together.
            </p>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Platform</h4>
            <div className={styles.footerLinks}>
              <Link href="/create" className={styles.footerLink}>Create Poll</Link>
              <Link href="/" className={styles.footerLink}>Explore</Link>
              <Link href="/dashboard" className={styles.footerLink}>Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Categories</h4>
            <div className={styles.footerLinks}>
              <Link href="/category/politics" className={styles.footerLink}>Politics</Link>
              <Link href="/category/entertainment" className={styles.footerLink}>Entertainment</Link>
              <Link href="/category/sports" className={styles.footerLink}>Sports</Link>
              <Link href="/category/technology" className={styles.footerLink}>Technology</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Legal</h4>
            <div className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © {year} Polkol.com — Every Voice Matters
          </p>
          <div className={styles.footerSocial}>
            <a href="https://twitter.com/polkol" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>𝕏</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

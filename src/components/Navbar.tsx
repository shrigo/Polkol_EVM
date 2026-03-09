"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Plus, LayoutDashboard, Shield, LogOut } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import styles from "./Navbar.module.css"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className={`${styles.navbar} glass`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Polkol" width={250} height={75} className={styles.logoImage} priority />
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Explore</Link>
          <Link href="/category/politics" className={styles.navLink}>Categories</Link>
          {session && (
            <>
              <Link href="/create" className={styles.navLink}>Create</Link>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            </>
          )}
          {session?.user?.role === "admin" && (
            <Link href="/admin" className={styles.navLink}>Admin</Link>
          )}
        </div>

        <div className={styles.navActions}>
          <ThemeToggle />
          {session ? (
            <div className={styles.userMenu}>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className={styles.userAvatar}
                />
              )}
              <span className={styles.userName}>{session.user?.name?.split(" ")[0]}</span>
              <button onClick={() => signOut()} className="btn btn-ghost btn-sm" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
        <Link href="/" className={styles.navLink} onClick={() => setMobileOpen(false)}>Explore</Link>
        <Link href="/category/politics" className={styles.navLink} onClick={() => setMobileOpen(false)}>Categories</Link>
        {session && (
          <>
            <Link href="/create" className={styles.navLink} onClick={() => setMobileOpen(false)}>
              <Plus size={16} /> Create Poll
            </Link>
            <Link href="/dashboard" className={styles.navLink} onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </>
        )}
        {session?.user?.role === "admin" && (
          <Link href="/admin" className={styles.navLink} onClick={() => setMobileOpen(false)}>
            <Shield size={16} /> Admin
          </Link>
        )}
      </div>
    </>
  )
}

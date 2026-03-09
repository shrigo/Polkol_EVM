import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: {
    default: "Polkol — Every Voice Matters",
    template: "%s | Polkol",
  },
  description: "Create, share, and discover polls that bring communities together. Real-time voting, beautiful results, instant sharing.",
  keywords: ["polls", "voting", "survey", "opinion", "community", "real-time"],
  openGraph: {
    title: "Polkol — Every Voice Matters",
    description: "Create, share, and discover polls that bring communities together.",
    url: "https://polkol.com",
    siteName: "Polkol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polkol — Every Voice Matters",
    description: "Create, share, and discover polls that bring communities together.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

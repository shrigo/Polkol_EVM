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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Polkol — Every Voice Matters",
    description: "Create, share, and discover polls that bring communities together.",
    url: "https://polkol.org",
    siteName: "Polkol",
    type: "website",
    images: [
      {
        url: "https://polkol.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Polkol — Every Voice Matters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polkol — Every Voice Matters",
    description: "Create, share, and discover polls that bring communities together.",
    images: ["https://polkol.org/og-image.png"],
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

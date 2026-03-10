import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"

interface PollLayoutProps {
  children: React.ReactNode
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PollLayoutProps): Promise<Metadata> {
  const { code } = await params

  const poll = await prisma.poll.findFirst({
    where: { OR: [{ code }, { id: code }] },
    include: {
      category: true,
      _count: { select: { votes: true } },
    },
  })

  if (!poll) {
    return {
      title: "Poll Not Found",
      description: "This poll may have been removed or the link is invalid.",
    }
  }

  const title = poll.title
  const description = poll.description
    || `Vote now on "${poll.title}" — ${poll._count.votes} vote${poll._count.votes !== 1 ? "s" : ""} so far!`

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Polkol Poll`,
      description,
      url: `https://polkol.org/p/${poll.code}`,
      siteName: "Polkol",
      type: "website",
      images: [
        {
          url: "https://polkol.org/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Polkol Poll`,
      description,
      images: ["https://polkol.org/og-image.png"],
    },
  }
}

export default function PollLayout({ children }: PollLayoutProps) {
  return <>{children}</>
}

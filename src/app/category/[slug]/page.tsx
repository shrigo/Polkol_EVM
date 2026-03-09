import { prisma } from "@/lib/prisma"
import { PollCard } from "@/components/PollCard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    return (
      <div className="page-wrapper">
        <div className="container text-center" style={{ padding: "4rem 1rem" }}>
          <h2>Category not found</h2>
          <Link href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const polls = await prisma.poll.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { votes: true } },
    },
  })

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>{category.icon}</span> {category.name}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          {category.description} · {polls.length} poll{polls.length !== 1 ? "s" : ""}
        </p>

        {polls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{category.icon}</div>
            <p className="empty-state-title">No polls in this category yet</p>
            <Link href="/create" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Create the First Poll
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                code={poll.code}
                title={poll.title}
                category={poll.category.name}
                categoryIcon={poll.category.icon}
                endsAt={poll.endsAt.toISOString()}
                status={poll.status}
                voteCount={poll._count.votes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

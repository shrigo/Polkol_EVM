import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/polls/[id]/export — Export poll results as CSV
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      options: { orderBy: { order: "asc" } },
      votes: {
        include: {
          option: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  if (poll.creatorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Build CSV
  const headers = ["Vote #", "Option", "Is Other", "Custom Text", "Timestamp"]
  const rows = poll.votes.map((v, i) => [
    i + 1,
    `"${v.option.text.replace(/"/g, '""')}"`,
    v.option.isOther ? "Yes" : "No",
    v.customText ? `"${v.customText.replace(/"/g, '""')}"` : "",
    v.createdAt.toISOString(),
  ])

  // Summary section
  const summary = [
    "",
    "SUMMARY",
    `Poll: "${poll.title}"`,
    `Total Votes: ${poll.votes.length}`,
    `Status: ${poll.status}`,
    `Created: ${poll.createdAt.toISOString()}`,
    `Ends: ${poll.endsAt.toISOString()}`,
    "",
    "Option,Votes,Percentage",
    ...poll.options.map((opt) => {
      const count = poll.votes.filter((v) => v.optionId === opt.id).length
      const pct = poll.votes.length > 0 ? ((count / poll.votes.length) * 100).toFixed(1) : "0.0"
      return `"${opt.text}",${count},${pct}%`
    }),
  ]

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
    ...summary,
  ].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="polkol-${poll.code}-results.csv"`,
    },
  })
}

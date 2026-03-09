import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/stats — Admin analytics
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const [totalUsers, totalPolls, totalVotes, activePolls, recentPolls, reports] = await Promise.all([
    prisma.user.count(),
    prisma.poll.count(),
    prisma.vote.count(),
    prisma.poll.count({ where: { status: { in: ["ACTIVE", "EXTENDED"] } } }),
    prisma.poll.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { votes: true } },
      },
    }),
    prisma.report.findMany({
      where: { status: "PENDING" },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        poll: { select: { id: true, title: true, code: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ])

  return NextResponse.json({
    stats: { totalUsers, totalPolls, totalVotes, activePolls },
    recentPolls,
    reports,
  })
}

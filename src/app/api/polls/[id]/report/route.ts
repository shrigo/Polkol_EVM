import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/polls/[id]/report — Report a poll
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const poll = await prisma.poll.findUnique({ where: { id } })
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  const body = await req.json()
  const { reason, details } = body

  if (!reason || reason.trim().length < 3) {
    return NextResponse.json({ error: "Please provide a reason" }, { status: 400 })
  }

  const session = await getServerSession(authOptions)

  const report = await prisma.report.create({
    data: {
      pollId: id,
      userId: session?.user?.id || null,
      reason: reason.trim(),
      details: (details || "").trim(),
    },
  })

  return NextResponse.json(report, { status: 201 })
}

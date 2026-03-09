import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/polls/[id] — Get single poll
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const poll = await prisma.poll.findFirst({
    where: { OR: [{ id }, { code: id }] },
    include: {
      category: true,
      creator: { select: { id: true, name: true, image: true } },
      options: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { votes: true } },
        },
      },
      _count: { select: { votes: true } },
    },
  })

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  // Auto-close expired polls
  if (poll.status !== "CLOSED" && new Date(poll.endsAt) < new Date()) {
    await prisma.poll.update({
      where: { id: poll.id },
      data: { status: "CLOSED" },
    })
    poll.status = "CLOSED"
  }

  return NextResponse.json(poll)
}

// PATCH /api/polls/[id] — Update poll (extend/close)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const poll = await prisma.poll.findUnique({ where: { id } })

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  if (poll.creatorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()

  // Close poll
  if (body.action === "close") {
    const updated = await prisma.poll.update({
      where: { id },
      data: { status: "CLOSED", endsAt: new Date() },
    })
    return NextResponse.json(updated)
  }

  // Extend poll
  if (body.action === "extend" && body.additionalHours) {
    const hours = Math.min(parseFloat(body.additionalHours), 168) // Max 7 days extension
    const maxLifespan = 30 * 24 * 3600000 // 1 month max total
    const totalLifespan = new Date(poll.endsAt).getTime() - new Date(poll.createdAt).getTime() + hours * 3600000

    if (totalLifespan > maxLifespan) {
      return NextResponse.json({ error: "Cannot extend beyond 1 month total duration" }, { status: 400 })
    }

    const previousEndsAt = poll.endsAt
    const newEndsAt = new Date(Math.max(Date.now(), new Date(poll.endsAt).getTime()) + hours * 3600000)

    await prisma.pollExtension.create({
      data: {
        pollId: id,
        previousEndsAt,
        newEndsAt,
      },
    })

    const updated = await prisma.poll.update({
      where: { id },
      data: { endsAt: newEndsAt, status: "EXTENDED" },
    })

    return NextResponse.json(updated)
  }

  // Toggle featured (admin only)
  if (body.action === "toggleFeatured" && session.user.role === "admin") {
    const updated = await prisma.poll.update({
      where: { id },
      data: { isFeatured: !poll.isFeatured },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

// DELETE /api/polls/[id] — Delete poll
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const poll = await prisma.poll.findUnique({ where: { id } })

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  if (poll.creatorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.poll.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

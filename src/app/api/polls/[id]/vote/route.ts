import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, hashIP, sanitize } from "@/lib/utils"

// POST /api/polls/[id]/vote — Submit vote
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Get client info for fingerprinting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
  const ipHashed = hashIP(ip)

  // Rate limit: 30 votes per minute per IP
  if (!checkRateLimit(`vote_${ipHashed}`, 30, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again." }, { status: 429 })
  }

  const poll = await prisma.poll.findFirst({
    where: { OR: [{ id }, { code: id }] },
  })

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 })
  }

  // Check if poll is expired
  if (poll.status === "CLOSED" || new Date(poll.endsAt) < new Date()) {
    return NextResponse.json({ error: "This poll has ended" }, { status: 400 })
  }

  const body = await req.json()
  const { optionId, fingerprint, customText } = body

  if (!optionId) {
    return NextResponse.json({ error: "Please select an option" }, { status: 400 })
  }

  // Verify option belongs to this poll
  const option = await prisma.pollOption.findFirst({
    where: { id: optionId, pollId: poll.id },
  })

  if (!option) {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 })
  }

  // Require custom text for "Other" option
  if (option.isOther && (!customText || customText.trim().length === 0)) {
    return NextResponse.json({ error: "Please enter your custom response" }, { status: 400 })
  }

  // Check for duplicate vote using fingerprint
  const fp = fingerprint || `anon_${ipHashed}`

  const existingVote = await prisma.vote.findUnique({
    where: { pollId_fingerprint: { pollId: poll.id, fingerprint: fp } },
  })

  if (existingVote) {
    return NextResponse.json({ error: "You have already voted on this poll" }, { status: 409 })
  }

  // Get session (optional - public voting allowed)
  const session = await getServerSession(authOptions)

  try {
    const vote = await prisma.vote.create({
      data: {
        optionId,
        pollId: poll.id,
        userId: session?.user?.id || null,
        fingerprint: fp,
        ipHash: ipHashed,
        customText: customText ? sanitize(customText) : null,
      },
    })

    return NextResponse.json({ success: true, voteId: vote.id }, { status: 201 })
  } catch {
    // Unique constraint violation (duplicate fingerprint)
    return NextResponse.json({ error: "You have already voted on this poll" }, { status: 409 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCode, sanitize, checkRateLimit } from "@/lib/utils"

// GET /api/polls — List polls with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const featured = searchParams.get("featured")
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = parseInt(searchParams.get("offset") || "0")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (category) {
    where.category = { slug: category }
  }
  if (status) {
    where.status = status
  }
  if (featured === "true") {
    where.isFeatured = true
  }

  const polls = await prisma.poll.findMany({
    where,
    take: Math.min(limit, 50),
    skip: offset,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      creator: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true } },
    },
  })

  const total = await prisma.poll.count({ where })

  return NextResponse.json({ polls, total })
}

// POST /api/polls — Create a new poll
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Rate limit: 10 polls per hour per user
  if (!checkRateLimit(`create_poll_${session.user.id}`, 10, 3600000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { title, description, categoryId, options, durationHours, resultVisibility } = body

    // Validation
    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 })
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }
    if (!options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "At least 2 options are required" }, { status: 400 })
    }
    if (options.length > 11) {
      return NextResponse.json({ error: "Maximum 10 options + 1 Other allowed" }, { status: 400 })
    }

    const duration = Math.max(1, Math.min(parseFloat(durationHours) || 1, 24))
    const endsAt = new Date(Date.now() + duration * 3600000)

    // Generate unique code
    let code = generateCode()
    let existing = await prisma.poll.findUnique({ where: { code } })
    while (existing) {
      code = generateCode()
      existing = await prisma.poll.findUnique({ where: { code } })
    }

    const poll = await prisma.poll.create({
      data: {
        code,
        title: sanitize(title),
        description: sanitize(description || ""),
        categoryId,
        creatorId: session.user.id,
        endsAt,
        resultVisibility: resultVisibility || "IMMEDIATE",
        options: {
          create: options.map((opt: { text: string; isOther?: boolean }, idx: number) => ({
            text: sanitize(opt.text),
            isOther: opt.isOther || false,
            order: idx,
          })),
        },
      },
      include: {
        options: true,
        category: true,
      },
    })

    return NextResponse.json(poll, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create poll" }, { status: 500 })
  }
}

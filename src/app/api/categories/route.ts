import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/categories — List all categories with poll counts
export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { polls: true } },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}

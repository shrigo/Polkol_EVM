import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const categories = [
    { name: "Politics", slug: "politics", description: "Political polls and opinion surveys", icon: "🏛️" },
    { name: "World Affairs", slug: "world-affairs", description: "Global events and international topics", icon: "🌍" },
    { name: "Entertainment", slug: "entertainment", description: "Movies, music, TV, and pop culture", icon: "🎬" },
    { name: "Sports", slug: "sports", description: "Sports events, teams, and athletes", icon: "⚽" },
    { name: "Technology", slug: "technology", description: "Tech trends, gadgets, and innovation", icon: "💻" },
    { name: "Miscellaneous", slug: "miscellaneous", description: "Everything else", icon: "📊" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log("✅ Seeded categories successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

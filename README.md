# Polkol.com — Every Voice Matters

A modern, production-ready polling platform built with Next.js, Prisma, and NextAuth.

## Features

- **Google OAuth** login via NextAuth
- **Timed Polls** with 1h–24h initial duration, extendable up to 1 month
- **Up to 10 options** + "Other" with custom text input
- **Real-time results** with animated bar charts
- **Social sharing** (WhatsApp, Telegram, X, Facebook, Copy Link)
- **Duplicate vote prevention** (fingerprint, session, IP)
- **Creator Dashboard** with stats, extend, close, CSV export
- **Admin Panel** with moderation, featured polls, reports
- **Category-based discovery** (Politics, Sports, Entertainment, etc.)
- **Dark/Light mode** with system preference detection
- **Mobile-first responsive** design
- **SEO-friendly** with OpenGraph meta tags

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS Modules
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Auth**: NextAuth.js v4 with Google OAuth
- **Icons**: Lucide React
- **Fonts**: Outfit + Inter (Google Fonts)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ADMIN_EMAILS="youremail@gmail.com"
```

### 3. Setup Database

```bash
npx prisma db push
npx prisma db seed    # Seeds categories
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env`

## Production Deployment (Vercel)

### 1. Switch to PostgreSQL

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### 3. Environment Variables in Vercel

Set in Vercel dashboard → Settings → Environment Variables:
- `DATABASE_URL` (PostgreSQL connection string)
- `NEXTAUTH_URL` (https://your-domain.vercel.app)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_EMAILS`

### 4. Update Google OAuth

Add production redirect URI in Google Cloud Console:
`https://your-domain.vercel.app/api/auth/callback/google`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth
│   │   ├── polls/                # CRUD + vote + report + export
│   │   ├── categories/           # Category listing
│   │   └── admin/                # Admin stats
│   ├── auth/signin/              # Sign-in page
│   ├── create/                   # Create poll
│   ├── dashboard/                # User dashboard
│   ├── admin/                    # Admin panel
│   ├── p/[code]/                 # Public voting
│   ├── category/[slug]/          # Category listing
│   ├── about/contact/privacy/terms/  # Static pages
│   ├── globals.css               # Design system
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
├── lib/                          # Auth, Prisma, utilities
└── types/                        # TypeScript declarations
prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Category seeder
```

## License

MIT

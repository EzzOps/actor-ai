# ACTOR AI — Interactive Learning Platform

Transform reading from passive consumption into an active, AI-guided learning journey.

## The ACTOR Framework

```
Aim → Read → Compress → Test → Own → Run → Review → Repeat
```

The AI acts as Coach, Teacher, Devil's Advocate, Mentor, Quiz Master, and Memory Trainer — never just a summary generator.

## Features (MVP)

- **Mission Generator** — Set reading intentions with AI-generated objectives
- **Reflection Engine** — Socratic questioning to deepen understanding
- **Compression Engine** — Identify trunk (core), branches (supporting), leaves (details)
- **Debate Engine** — AI challenges your interpretations as a debate opponent
- **Adaptive Quiz** — Multiple question types with dynamic difficulty
- **Teaching Engine** — Explain concepts and get scored on completeness, correctness, clarity
- **Application Engine** — Turn ideas into real-world experiments
- **Spaced Repetition** — Review sessions at optimal intervals (1, 3, 7, 14, 30, 90 days)
- **Knowledge Graph** — Vector-powered concept linking with semantic search
- **Gamification** — XP, levels (Novice → Master), and achievements
- **Analytics Dashboard** — Track retention, critical thinking, and learning velocity

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, TailwindCSS |
| UI | shadcn/ui, Framer Motion, Lucide Icons |
| Database | PostgreSQL + pgvector (via Supabase) |
| Auth | Supabase Auth (Google, GitHub, Email) |
| Storage | Supabase Storage (PDF, EPUB, images) |
| AI | OpenAI API (configurable model via env vars) |
| Deployment | Vercel (frontend), Supabase (database) |

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url> actor-ai
cd actor-ai
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `database/schema.sql` in the SQL Editor
3. Enable Auth providers (Google, GitHub, Email) in Authentication → Settings
4. Copy your project URL, anon key, and service role key

### 3. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your_openai_key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Verify

```bash
bash scripts/verify.sh
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `OPENAI_BASE_URL` | No | Custom API endpoint (default: OpenAI) |
| `MODEL` | No | Model name (default: gpt-4o) |
| `EMBEDDING_MODEL` | No | Embedding model (default: text-embedding-3-large) |

*Required for AI-powered features. App works without it (shows static fallbacks).

## Architecture

```
app/                  # Next.js App Router pages
  api/                # Route handlers (AI workflows)
components/           # React components
  ui/                 # shadcn/ui primitives
  layout/             # Sidebar, AppShell
lib/                  # Clients (Supabase, OpenAI), utilities
types/                # TypeScript interfaces
prompts/              # AI prompt templates
database/             # SQL schema
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/mission` | POST | Generate reading objectives |
| `/api/reflection` | POST | Generate reflective questions |
| `/api/quiz` | POST | Generate adaptive quiz |
| `/api/search` | GET | Semantic search across knowledge |
| `/api/dashboard` | GET | Dashboard data |
| `/api/profile` | GET | User profile and progress |

## Database Tables

20+ tables covering users, books, chapters, reading sessions, missions, reflections, compression, challenges, quizzes, teaching, applications, experiments, reviews, knowledge graph, achievements, bookmarks, highlights, and notes.

All tables have Row Level Security (RLS) enabled.

## Deployment

### Vercel

```bash
npm run build    # Verify build succeeds
vercel deploy    # Deploy to Vercel
```

Set environment variables in Vercel project settings.

### Supabase

Schema is in `database/schema.sql`. Run in Supabase SQL Editor before deploying.

## License

MIT

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT now(), books_finished INTEGER DEFAULT 0,
  average_recall REAL DEFAULT 0, critical_thinking_score REAL DEFAULT 0,
  teaching_score REAL DEFAULT 0, experiments_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Books
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, author TEXT DEFAULT '', cover_url TEXT,
  language TEXT DEFAULT 'en', format TEXT CHECK (format IN ('pdf','epub','url','manual')),
  source_url TEXT, total_chapters INTEGER DEFAULT 0, current_chapter INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chapters
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  title TEXT NOT NULL, content TEXT, chapter_number INTEGER NOT NULL,
  word_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now()
);

-- Reading Sessions
CREATE TABLE IF NOT EXISTS public.reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  mission_id UUID, phase TEXT DEFAULT 'mission',
  started_at TIMESTAMPTZ DEFAULT now(), completed_at TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0, understanding_score REAL, retention_score REAL
);

-- Missions
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  category TEXT NOT NULL, custom_reason TEXT,
  objectives JSONB DEFAULT '[]', questions JSONB DEFAULT '[]', focus_areas JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reflections
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL, answer TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

-- Compression Results
CREATE TABLE IF NOT EXISTS public.compression_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  trunk JSONB DEFAULT '[]', branches JSONB DEFAULT '[]', leaves JSONB DEFAULT '[]',
  understanding_score REAL, missing_concepts JSONB DEFAULT '[]', suggested_review JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  argument TEXT NOT NULL, user_response TEXT, ai_counter TEXT,
  resolved BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL, question TEXT NOT NULL, options JSONB,
  correct_answer TEXT NOT NULL, user_answer TEXT,
  difficulty INTEGER DEFAULT 3, score REAL, created_at TIMESTAMPTZ DEFAULT now()
);

-- Teaching Sessions
CREATE TABLE IF NOT EXISTS public.teaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  user_explanation TEXT, completeness_score REAL, correctness_score REAL,
  clarity_score REAL, teaching_score REAL, feedback TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.reading_sessions(id) ON DELETE CASCADE,
  work_application TEXT, life_application TEXT, experiment_design TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Experiments
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.reading_sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL, description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','completed','failed')),
  result TEXT, reflection TEXT, created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ, xp_earned INTEGER DEFAULT 0
);

-- Review Sessions
CREATE TABLE IF NOT EXISTS public.review_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMPTZ NOT NULL, interval INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false, score REAL,
  weak_areas JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT now(), completed_at TIMESTAMPTZ
);

-- Knowledge Nodes (1536d for text-embedding-3-small compatibility)
CREATE TABLE IF NOT EXISTS public.knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  concept TEXT NOT NULL, context TEXT,
  embedding vector(1536), created_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge Edges
CREATE TABLE IF NOT EXISTS public.knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  relationship TEXT, weight REAL DEFAULT 1.0, created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL, title TEXT NOT NULL, description TEXT, icon TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT now(), UNIQUE(user_id, slug)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  location TEXT, note TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

-- Highlights
CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  text TEXT NOT NULL, color TEXT DEFAULT 'yellow', note TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  content TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_books_user ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_nodes_user ON public.knowledge_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_nodes_embedding ON public.knowledge_nodes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS Policies (per-table, handling user_id column existence)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.user_progress;
CREATE POLICY user_access ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.books;
CREATE POLICY user_access ON public.books FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.reading_sessions;
CREATE POLICY user_access ON public.reading_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.experiments;
CREATE POLICY user_access ON public.experiments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.review_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.review_sessions;
CREATE POLICY user_access ON public.review_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.knowledge_nodes;
CREATE POLICY user_access ON public.knowledge_nodes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.knowledge_edges;
CREATE POLICY user_access ON public.knowledge_edges FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.achievements;
CREATE POLICY user_access ON public.achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.bookmarks;
CREATE POLICY user_access ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.highlights;
CREATE POLICY user_access ON public.highlights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_access ON public.notes;
CREATE POLICY user_access ON public.notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Note: chapters, missions, reflections, compression_results, challenges, 
-- quiz_questions, teaching_sessions, applications don't have user_id
-- They are accessed via reading_sessions. RLS not applied to these join tables.


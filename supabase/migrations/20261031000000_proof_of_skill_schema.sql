-- ====================================================================
-- PROOF OF SKILL: Complete Supabase PostgreSQL Schema & RLS Policies
-- Hacktoberfest 2026 | Team KAIZOKU O NAKAMA
-- ====================================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'recruiter', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    supported_language TEXT NOT NULL DEFAULT 'python',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skills(id),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    language TEXT NOT NULL DEFAULT 'python',
    status TEXT NOT NULL DEFAULT 'initialized' CHECK (status IN ('initialized', 'challenge_generated', 'submitted', 'defense_in_progress', 'evaluated', 'credential_issued', 'failed')),
    challenge_id TEXT,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    visible_tests JSONB NOT NULL DEFAULT '[]'::jsonb,
    hidden_tests JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluation_rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_code TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'python',
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'error', 'timeout')),
    test_results JSONB NOT NULL DEFAULT '{}'::jsonb,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    memory_used_kb INTEGER NOT NULL DEFAULT 0,
    evidence_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. DEFENSE SESSIONS
CREATE TABLE IF NOT EXISTS public.defense_sessions (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. DEFENSE ANSWERS
CREATE TABLE IF NOT EXISTS public.defense_answers (
    id TEXT PRIMARY KEY,
    defense_session_id TEXT NOT NULL REFERENCES public.defense_sessions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. COMPETENCY SCORES
CREATE TABLE IF NOT EXISTS public.competency_scores (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    competency TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    maximum_score INTEGER NOT NULL DEFAULT 100,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. CREDENTIALS
CREATE TABLE IF NOT EXISTS public.credentials (
    id TEXT PRIMARY KEY,
    credential_id TEXT UNIQUE NOT NULL,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    canonical_evidence JSONB NOT NULL,
    evidence_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    public_key_version TEXT NOT NULL DEFAULT 'v1-ed25519',
    verification_status TEXT NOT NULL DEFAULT 'VALID' CHECK (verification_status IN ('VALID', 'REVOKED', 'INVALID_SIGNATURE', 'TAMPERED')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_assessments_candidate ON public.assessments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment ON public.submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_credentials_candidate ON public.credentials(candidate_id);
CREATE INDEX IF NOT EXISTS idx_credentials_credential_id ON public.credentials(credential_id);
CREATE INDEX IF NOT EXISTS idx_credentials_status ON public.credentials(verification_status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defense_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defense_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Skills are readable by all authenticated and anonymous users
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);

-- 2. Profiles: Users can read public profile data; owners can update
CREATE POLICY "Profiles readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Assessments: Candidates can only access their own assessments
CREATE POLICY "Candidates can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Candidates can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Candidates can update own assessments" ON public.assessments FOR UPDATE USING (auth.uid() = candidate_id);

-- 4. Challenges: Candidate can view challenge for their assessment, but server protects hidden tests
CREATE POLICY "Candidates view challenge for own assessment" ON public.challenges FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.assessments WHERE assessments.id = challenges.assessment_id AND assessments.candidate_id = auth.uid())
);

-- 5. Submissions: Candidates can only access their own submissions
CREATE POLICY "Candidates view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Candidates insert own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = candidate_id);

-- 6. Credentials: Public verification allows SELECT on valid/revoked credentials for everyone
CREATE POLICY "Credentials are publicly verifiable" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Credential owners can view own credentials" ON public.credentials FOR SELECT USING (auth.uid() = candidate_id);

-- ====================================================================
-- INITIAL SEED DATA FOR SKILLS
-- ====================================================================
INSERT INTO public.skills (id, name, description, supported_language, is_active)
VALUES
    ('python-debugging', 'Python Debugging', 'Diagnose memory leaks, race conditions, edge-case regressions, and concurrency faults in realistic production codebases.', 'python', true),
    ('python-programming', 'Python Programming', 'Architect clean, robust, and algorithmic backend systems with optimal time/space complexity.', 'python', true),
    ('data-analysis', 'Data Analysis & Manipulation', 'Vectorized filtering, sliding window transformations, and robust feature engineering under memory constraints.', 'python', true),
    ('sql', 'SQL & Relational Logic', 'Complex aggregations, window functions, relational algebra, and zero-loss schema querying.', 'python', true),
    ('web-dev', 'Web Backend & API Engineering', 'RESTful API contracts, request validation, idempotent endpoints, and rate-limiting patterns.', 'python', true),
    ('javascript', 'JavaScript & Async Runtime', 'Event loop mechanics, promises, async generators, and resilient micro-task pipelines.', 'python', true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

export type MissionCategory = "career" | "leadership" | "business" | "learning" | "research" | "custom"
export type QuestionType = "multiple-choice" | "true-false" | "open-ended" | "scenario" | "eli5" | "case-study"
export type SessionPhase = "mission"|"reading"|"reflection"|"compression"|"challenge"|"quiz"|"application"|"experiment"|"summary"
export type Difficulty = 1|2|3|4|5
export type BookFormat = "pdf"|"epub"|"url"|"manual"
export interface Book { id: string; user_id: string; title: string; author: string; cover_url: string|null; language: string; format: BookFormat; source_url: string|null; chapters: Chapter[]; total_chapters: number; current_chapter: number; created_at: string; updated_at: string }
export interface Chapter { id: string; book_id: string; title: string; content: string; chapter_number: number; word_count: number; created_at: string }
export interface Mission { id: string; session_id: string; category: MissionCategory; custom_reason: string|null; objectives: string[]; questions: string[]; focus_areas: string[]; created_at: string }
export interface ReadingSession { id: string; user_id: string; book_id: string; chapter_id: string|null; mission_id: string|null; phase: SessionPhase; started_at: string; completed_at: string|null; xp_earned: number; understanding_score: number|null; retention_score: number|null }
export interface Reflection { id: string; session_id: string; question: string; answer: string; created_at: string }
export interface CompressionResult { id: string; session_id: string; trunk: string[]; branches: string[]; leaves: string[]; understanding_score: number; missing_concepts: string[]; suggested_review: string[]; created_at: string }
export interface Challenge { id: string; session_id: string; argument: string; user_response: string; ai_counter: string; resolved: boolean; created_at: string }
export interface QuizQuestion { id: string; session_id: string; question_type: QuestionType; question: string; options: string[]|null; correct_answer: string; user_answer: string|null; difficulty: Difficulty; score: number|null; created_at: string }
export interface TeachingSession { id: string; session_id: string; user_explanation: string; completeness_score: number; correctness_score: number; clarity_score: number; teaching_score: number; feedback: string; created_at: string }
export interface Application { id: string; session_id: string; work_application: string; life_application: string; experiment_design: string; created_at: string }
export interface Experiment { id: string; user_id: string; book_id: string; session_id: string; title: string; description: string; status: "pending"|"active"|"completed"|"failed"; result: string|null; reflection: string|null; created_at: string; completed_at: string|null; xp_earned: number }
export interface ReviewSession { id: string; user_id: string; book_id: string; scheduled_date: string; interval: number; completed: boolean; score: number|null; weak_areas: string[]; created_at: string; completed_at: string|null }
export interface Achievement { id: string; user_id: string; slug: string; title: string; description: string; icon: string; unlocked_at: string }
export interface Bookmark { id: string; user_id: string; book_id: string; chapter_id: string; location: string; note: string|null; created_at: string }
export interface Highlight { id: string; user_id: string; book_id: string; chapter_id: string; text: string; color: string; note: string|null; created_at: string }
export interface Note { id: string; user_id: string; book_id: string; chapter_id: string; content: string; created_at: string; updated_at: string }
export interface AIMessage { role: "system"|"user"|"assistant"; content: string }
export interface StreamEvent { type: "chunk"|"done"|"error"; content?: string; error?: string }

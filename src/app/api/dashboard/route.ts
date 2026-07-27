import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
export async function GET() {
  try {
    const { data: { user } } = await getSupabase().auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const [progress, books, reviews, achievements] = await Promise.all([
      getSupabase().from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
      getSupabase().from("books").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      getSupabase().from("review_sessions").select("*").eq("user_id", user.id).eq("completed", false).order("scheduled_date"),
      getSupabase().from("achievements").select("*").eq("user_id", user.id),
    ])
    return NextResponse.json({ progress: progress.data, books: books.data, reviews: reviews.data, achievements: achievements.data })
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

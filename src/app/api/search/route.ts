import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams.get("q")
    if (!q) return NextResponse.json({ results: [] })
    const { data: { user } } = await getSupabase().auth.getUser()
    if (!user) return NextResponse.json({ results: [] })
    const { data } = await getSupabase().from("knowledge_nodes").select("*").eq("user_id", user.id).ilike("concept", `%${q}%`).limit(10)
    return NextResponse.json({ results: data || [] })
  } catch { return NextResponse.json({ results: [] }) }
}

import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export const dynamic = "force-static"

export async function GET() {
  try {
    const { data: { user } } = await getSupabase().auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { data } = await getSupabase().from("user_progress").select("*").eq("user_id", user.id).maybeSingle()
    return NextResponse.json({ user, progress: data })
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }) }
}

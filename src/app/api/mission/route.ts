import { NextResponse } from "next/server"
import { structuredAI } from "@/lib/openai"
import { PROMPTS } from "@/prompts"
export async function POST(req: Request) {
  try {
    const { bookTitle, author, reason, chapters } = await req.json()
    const result = await structuredAI([
      { role: "system", content: PROMPTS.mission },
      { role: "user", content: `Book: ${bookTitle} by ${author}\nReason: ${reason}\nContent: ${chapters?.slice(0, 3000)}` },
    ])
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({
      objectives: ["Understand core concepts", "Identify key principles", "Apply learnings"],
      questions: ["What is the main argument?", "How does this relate to what I know?", "What would I challenge?"],
      focus_areas: ["Main ideas", "Supporting evidence", "Practical applications"]
    })
  }
}

import { NextResponse } from "next/server"
import { structuredAI } from "@/lib/openai"
import { PROMPTS } from "@/prompts"

export const dynamic = "force-static"

export async function POST(req: Request) {
  try {
    const { chapterContent, reflection } = await req.json()
    const result = await structuredAI([
      { role: "system", content: PROMPTS.reflection },
      { role: "user", content: `Chapter: ${chapterContent?.slice(0, 3000)}\nUser: ${reflection}` },
    ])
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({
      questions: [
        { question: "What surprised you most?", type: "surprise" },
        { question: "What challenged your thinking?", type: "challenge" },
        { question: "How does this connect to your experience?", type: "connection" }
      ]
    })
  }
}

import { NextResponse } from "next/server"
import { structuredAI } from "@/lib/openai"
import { PROMPTS } from "@/prompts"


export async function POST(req: Request) {
  try {
    const { chapterContent, previousAnswers } = await req.json()
    const result = await structuredAI([
      { role: "system", content: PROMPTS.quiz },
      { role: "user", content: `Chapter: ${chapterContent?.slice(0, 3000)}\nPrevious: ${JSON.stringify(previousAnswers)}` },
    ])
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({
      questions: [
        { type: "multiple-choice", question: "What is the main idea?", options: ["A", "B", "C", "D"], correct_answer: "A", explanation: "Explanation", difficulty: 2 }
      ]
    })
  }
}

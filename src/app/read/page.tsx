"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, MessageSquare, Sword, GraduationCap, Target, Beaker, CheckCircle, ArrowLeft, ArrowRight, Send, Sparkles, Loader2 } from "lucide-react"

import { Suspense } from "react"

const PHASES = ["mission","reading","reflection","compression","challenge","quiz","application","experiment","summary"]
const PHASE_LABELS: Record<string,string> = {mission:"Mission",reading:"Reading",reflection:"Reflection",compression:"Compression",challenge:"Challenge",quiz:"Quiz",application:"Application",experiment:"Experiment",summary:"Summary"}
const PHASE_ICONS: Record<string,any> = {mission:Brain,reading:BookOpen,reflection:MessageSquare,compression:Brain,challenge:Sword,quiz:GraduationCap,application:Target,experiment:Beaker,summary:CheckCircle}

function ReadContent() {
  const r = useRouter()
  const sp = useSearchParams()
  const [session, setSession] = useState<any>(null)
  const [phase, setPhase] = useState(0)
  const [book, setBook] = useState<any>(null)
  const [chapter, setChapter] = useState<any>(null)
  const [input, setInput] = useState("")
  const [aiResp, setAiResp] = useState("")
  const [loading, setLoading] = useState(false)
  const [missions, setMissions] = useState<any>(null)
  const [quizQs, setQuizQs] = useState<any[]>([])
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string,string>>({})

  useEffect(() => { (supabase.auth as any).getSession().then((res: any) => { const session = res.data?.session; if (!session) { r.push("/"); return }; init() }) }, [r])

  async function init() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if (!user) return
      const bookId = sp.get("book")
      let targetBook: any
      if (bookId) {
        const {data} = await (supabase as any).from("books").select("*,chapters(*)").eq("id",bookId).single()
        targetBook = data
      } else {
        const {data} = await (supabase as any).from("books").select("*,chapters(*)").eq("user_id",user.id).order("updated_at",{ascending:false}).limit(1).maybeSingle()
        targetBook = data
      }
      if (!targetBook) { r.push("/library"); return }
      setBook(targetBook)
      const tc = targetBook.chapters?.[targetBook.current_chapter] || targetBook.chapters?.[0]
      setChapter(tc)
      const {data:sd} = await (supabase as any).from("reading_sessions").insert({user_id:user.id,book_id:targetBook.id,chapter_id:tc?.id,phase:"mission"}).select().single()
      setSession(sd)
    } catch(e){console.error(e)}
  }

  async function handleMission(reason:string) {
    setLoading(true)
    try {
      const res = await fetch("/api/mission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({bookTitle:book?.title,author:book?.author,reason,chapters:chapter?.content})})
      const data = await res.json()
      setMissions(data)
      if(session) await (supabase as any).from("missions").insert({session_id:session.id,category:"learning",objectives:data.objectives,questions:data.questions,focus_areas:data.focus_areas})
      setPhase(1)
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  async function handleReflection() {
    setLoading(true)
    try {
      const res = await fetch("/api/reflection",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chapterContent:chapter?.content,reflection:input})})
      const data = await res.json()
      setAiResp(JSON.stringify(data,null,2))
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  async function startQuiz() {
    setLoading(true)
    try {
      const res = await fetch("/api/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chapterContent:chapter?.content,previousAnswers:answers})})
      const data = await res.json()
      setQuizQs(data.questions||[])
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  function nextPhase() {
    if(phase < PHASES.length-1) {
      setPhase(phase+1); setInput(""); setAiResp("")
      if(session) (supabase as any).from("reading_sessions").update({phase:PHASES[phase+1]}).eq("id",session.id).then(()=>{})
    }
  }
  function prevPhase() { if(phase>0){setPhase(phase-1);setInput("");setAiResp("")} }

  const Icon = PHASE_ICONS[PHASES[phase]]
  const current = PHASES[phase]

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          {PHASES.map((p,i) => (
            <div key={p} className="flex items-center gap-1">
              <Badge variant={i===phase?"default":i<phase?"secondary":"outline"} className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                {i<phase ? <CheckCircle className="h-3 w-3"/> : <span className="text-xs">{i+1}</span>}
              </Badge>
              {i<PHASES.length-1 && <div className={`h-0.5 w-6 ${i<phase?"bg-primary":"bg-muted"}`} />}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">{book?.title||"Reading Session"}</h1><p className="text-muted-foreground">{chapter?.title||"Loading..."} · {PHASE_LABELS[current]}</p></div>
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {current === "reading" && chapter && (
          <Card><CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none"><div className="whitespace-pre-wrap">{chapter.content}</div></CardContent></Card>
        )}

        {current === "mission" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5"/> Define Your Mission</CardTitle><CardDescription>Why are you reading this?</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Career","Leadership","Business","Learning","Research"].map(reason => (
                  <Button key={reason} variant="outline" className="h-20" onClick={()=>handleMission(reason.toLowerCase())} disabled={loading}>{reason}</Button>
                ))}
                <Button variant="outline" className="h-20 col-span-2" onClick={()=>handleMission("custom")} disabled={loading}>Custom</Button>
              </div>
              {missions && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">Your Mission</h3>
                  <div><p className="text-sm font-medium">Objectives:</p><ul className="list-disc pl-5 text-sm">{missions.objectives?.map((o:string,i:number)=><li key={i}>{o}</li>)}</ul></div>
                  <div><p className="text-sm font-medium">Questions:</p><ul className="list-disc pl-5 text-sm">{missions.questions?.map((q:string,i:number)=><li key={i}>{q}</li>)}</ul></div>
                </div>
              )}
            </CardContent></Card>
        )}

        {current === "reflection" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Reflection</CardTitle><CardDescription>What do you think? What surprised you?</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Share your reflections..." value={input} onChange={e=>setInput(e.target.value)} rows={6} />
              <Button onClick={handleReflection} disabled={loading||!input}>{loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Reflecting...</>:<>Reflect <Send className="h-4 w-4 ml-2"/></>}</Button>
              {aiResp && <div className="p-4 bg-muted rounded-lg"><pre className="text-sm whitespace-pre-wrap">{aiResp}</pre></div>}
            </CardContent></Card>
        )}

        {current === "quiz" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/> Quiz</CardTitle><CardDescription>Test your understanding</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {quizQs.length === 0 ? (
                <Button onClick={startQuiz} disabled={loading}>{loading?<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Generating...</>:<>Generate Quiz <Sparkles className="h-4 w-4 ml-2"/></>}</Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Q{curQ+1}/{quizQs.length}</span><Progress value={((curQ+1)/quizQs.length)*100} className="w-32"/></div>
                  {quizQs[curQ] && (<div className="space-y-4">
                    <p className="font-medium">{quizQs[curQ].question}</p>
                    {quizQs[curQ].options?.map((opt:string,i:number)=>(
                      <Button key={i} variant={answers[quizQs[curQ].id]===opt?"default":"outline"} className="w-full justify-start" onClick={()=>setAnswers({...answers,[quizQs[curQ].id]:opt})}>{opt}</Button>
                    ))}
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={()=>setCurQ(Math.max(0,curQ-1))} disabled={curQ===0}><ArrowLeft className="h-4 w-4 mr-1"/>Prev</Button>
                      <Button onClick={()=>setCurQ(Math.min(quizQs.length-1,curQ+1))}>Next<ArrowRight className="h-4 w-4 ml-1"/></Button>
                    </div>
                  </div>)}
                </div>
              )}
            </CardContent></Card>
        )}

        {current === "summary" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Session Complete</CardTitle><CardDescription>Great work! You completed this chapter session.</CardDescription></CardHeader>
            <CardContent className="text-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Chapter Complete</h3>
              <p className="text-muted-foreground">+{session?.xp_earned||50} XP earned</p>
              <Button onClick={()=>r.push("/dashboard")}>Back to Dashboard</Button>
            </CardContent></Card>
        )}

        {["compression","challenge","application","experiment"].includes(current) && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5"/> {PHASE_LABELS[current]}</CardTitle><CardDescription>Interactive AI-powered learning phase</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder={`Enter your ${PHASE_LABELS[current].toLowerCase()}...`} value={input} onChange={e=>setInput(e.target.value)} rows={6} />
              <Button disabled={loading||!input}>{loading?"Processing...":"Submit"} <Send className="h-4 w-4 ml-2"/></Button>
              <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground">AI response will appear when API is connected.</p></div>
            </CardContent></Card>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" onClick={prevPhase} disabled={phase===0}><ArrowLeft className="h-4 w-4 mr-2"/> Previous</Button>
          <Button onClick={nextPhase} disabled={phase===PHASES.length-1}>Next <ArrowRight className="h-4 w-4 ml-2"/></Button>
        </div>
      </div>
    </AppShell>
  )
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <ReadContent />
    </Suspense>
  )
}

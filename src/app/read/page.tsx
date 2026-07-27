"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, MessageSquare, Sword, GraduationCap, Target, Beaker, CheckCircle, ArrowLeft, ArrowRight, Send, Sparkles, Loader2 } from "lucide-react"

const PHASES = ["mission","reading","reflection","compression","challenge","quiz","application","experiment","summary"]
const PHASE_LABELS: Record<string,string> = {mission:"Mission",reading:"Reading",reflection:"Reflection",compression:"Compression",challenge:"Challenge",quiz:"Quiz",application:"Application",experiment:"Experiment",summary:"Summary"}
const PHASE_ICONS: Record<string,any> = {mission:Brain,reading:BookOpen,reflection:MessageSquare,compression:Brain,challenge:Sword,quiz:GraduationCap,application:Target,experiment:Beaker,summary:CheckCircle}

export default function ReadPage() {
  const r = useRouter()
  const [phase, setPhase] = useState(0)
  const [input, setInput] = useState("")
  const [aiResp, setAiResp] = useState("")
  const [loading] = useState(false)
  const [quizQs, setQuizQs] = useState<any[]>([])
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string,string>>({})

  async function startQuiz() {
    const res = await fetch("/api/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chapterContent:"Sample chapter",previousAnswers:answers})})
    const data = await res.json()
    setQuizQs(data.questions||[])
  }

  function nextPhase() { if(phase < PHASES.length-1) { setPhase(phase+1); setInput(""); setAiResp("") } }
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
          <div><h1 className="text-2xl font-bold">Reading Session</h1><p className="text-muted-foreground">{PHASE_LABELS[current]}</p></div>
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {current === "mission" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5"/> Define Your Mission</CardTitle><CardDescription>Why are you reading this?</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Career","Leadership","Business","Learning","Research"].map(reason => (
                  <Button key={reason} variant="outline" className="h-20" disabled>{reason}</Button>
                ))}
              </div>
            </CardContent></Card>
        )}

        {current === "reflection" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Reflection</CardTitle><CardDescription>What do you think?</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Share your reflections..." value={input} onChange={e=>setInput(e.target.value)} rows={6} />
              <Button disabled={loading||!input}>Reflect <Send className="h-4 w-4 ml-2"/></Button>
            </CardContent></Card>
        )}

        {current === "quiz" && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/> Quiz</CardTitle><CardDescription>Test your understanding</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {quizQs.length === 0 ? (
                <Button onClick={startQuiz} disabled={loading}><Sparkles className="h-4 w-4 mr-2" /> Generate Quiz</Button>
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
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Session Complete</CardTitle></CardHeader>
            <CardContent className="text-center py-8"><Button onClick={()=>r.push("/dashboard")}>Back to Dashboard</Button></CardContent></Card>
        )}

        {["compression","challenge","application","experiment","reading"].includes(current) && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5"/> {PHASE_LABELS[current]}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder={`Enter your ${PHASE_LABELS[current].toLowerCase()}...`} value={input} onChange={e=>setInput(e.target.value)} rows={6} />
              <Button disabled={loading||!input}>Submit <Send className="h-4 w-4 ml-2"/></Button>
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

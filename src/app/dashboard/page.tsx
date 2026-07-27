"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getLevel, formatXP } from "@/lib/utils"
import { BookOpen, Brain, TrendingUp, Award, Zap, Flame, Target, Sparkles, Library, ArrowRight, Clock } from "lucide-react"
export default function DashboardPage() {
  const r = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { (supabase.auth as any).getSession().then((res: any) => { const session = res.data?.session; if (!session) { r.push("/"); return }; load() }) }, [r])
  async function load() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if (!user) return
      const [p, b, rev, a, s] = await Promise.all([
        (supabase as any).from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
        (supabase as any).from("books").select("*").eq("user_id", user.id).order("updated_at",{ascending:false}).limit(1).maybeSingle(),
        (supabase as any).from("review_sessions").select("*").eq("user_id",user.id).eq("completed",false).order("scheduled_date").limit(5),
        (supabase as any).from("achievements").select("*").eq("user_id",user.id).order("unlocked_at",{ascending:false}).limit(5),
        (supabase as any).from("reading_sessions").select("*").eq("user_id",user.id).order("started_at",{ascending:false}).limit(5),
      ])
      setData({progress:p.data||{xp:0,streak_days:0,books_finished:0,average_recall:0,experiments_completed:0},currentBook:b.data,todayReview:rev.data||[],achievements:a.data||[],recentSessions:s.data||[]})
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }
  const lv = data ? getLevel(data.progress.xp) : {name:"Novice",level:1,progress:0}
  if(loading) return <AppShell><div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></AppShell>
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-muted-foreground">Your learning journey</p></div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2"><Zap className="h-4 w-4 mr-1" />{formatXP(data?.progress.xp||0)} XP</Badge>
            <Badge variant="default" className="text-lg px-4 py-2">Lv.{lv.level} {lv.name}</Badge>
          </div>
        </div>
        <Card><CardContent className="pt-6"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Level Progress</span><span className="text-sm font-medium">{Math.round(lv.progress*100)}%</span></div><Progress value={lv.progress*100} /></CardContent></Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Books Finished</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{data?.progress.books_finished||0}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Recall</CardTitle><Brain className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round((data?.progress.average_recall||0)*100)}%</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Streak</CardTitle><Flame className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{data?.progress.streak_days||0} days</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Experiments</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{data?.progress.experiments_completed||0}</div></CardContent></Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Library className="h-5 w-5" /> Current Book</CardTitle></CardHeader><CardContent>
            {data?.currentBook ? (<div className="space-y-2"><h3 className="font-semibold">{data.currentBook.title}</h3><p className="text-sm text-muted-foreground">{data.currentBook.author}</p><Progress value={((data.currentBook.current_chapter||0)/Math.max(data.currentBook.total_chapters||1,1))*100}/><p className="text-xs text-muted-foreground">Ch.{data.currentBook.current_chapter||0}/{data.currentBook.total_chapters||0}</p><Button onClick={()=>r.push("/read")} className="mt-2">Continue <ArrowRight className="h-4 w-4 ml-2"/></Button></div>)
              : (<div className="text-center py-8 space-y-3"><BookOpen className="h-12 w-12 text-muted-foreground mx-auto"/><p>No books yet</p><Button onClick={()=>r.push("/library")}>Add Your First Book</Button></div>)}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Today's Reviews</CardTitle></CardHeader><CardContent>
            {data?.todayReview?.length ? data.todayReview.map((rev:any)=>(<div key={rev.id} className="flex items-center justify-between p-3 bg-muted rounded-lg mb-2"><div><p className="font-medium text-sm">Review</p><p className="text-xs text-muted-foreground">Day {rev.interval}</p></div><Button size="sm" onClick={()=>r.push("/review")}>Start</Button></div>))
              : (<div className="text-center py-8"><Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-2"/><p className="text-muted-foreground">All caught up!</p></div>)}
          </CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle><Award className="h-5 w-5 inline mr-2" />Achievements</CardTitle></CardHeader><CardContent>
          {data?.achievements?.length ? (<div className="flex gap-2 flex-wrap">{data.achievements.map((a:any)=>(<Badge key={a.id} variant="secondary" className="px-3 py-2"><span className="mr-1">{a.icon}</span>{a.title}</Badge>))}</div>)
            : <p className="text-sm text-muted-foreground">Complete sessions to earn achievements</p>}
        </CardContent></Card>
      </div>
    </AppShell>
  )
}

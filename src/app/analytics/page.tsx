"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Target, TrendingUp, Award, BarChart3 } from "lucide-react"
export default function AnalyticsPage() {
  const r = useRouter()
  const [stats, setStats] = useState<any>(null)
  useEffect(()=>{(supabase.auth as any).getSession().then((res: any)=>{const session=res.data?.session;if(!session){r.push("/");return}load()})},[r])
  async function load() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if(!user) return
      const {data:p} = await (supabase as any).from("user_progress").select("*").eq("user_id",user.id).maybeSingle()
      const {count:s} = await (supabase as any).from("reading_sessions").select("*",{count:"exact",head:true}).eq("user_id",user.id)
      const {count:e} = await (supabase as any).from("experiments").select("*",{count:"exact",head:true}).eq("user_id",user.id)
      setStats({progress:p||{books_finished:0,average_recall:0,critical_thinking_score:0,teaching_score:0,experiments_completed:0,xp:0},totalSessions:s||0,totalExperiments:e||0})
    } catch(e){console.error(e)}
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Analytics</h1><p className="text-muted-foreground">Learning metrics</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Sessions</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalSessions||0}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Recall</CardTitle><Brain className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round((stats?.progress?.average_recall||0)*100)}%</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Critical Thinking</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round((stats?.progress?.critical_thinking_score||0)*100)}%</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Teaching</CardTitle><Award className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round((stats?.progress?.teaching_score||0)*100)}%</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Experiments</CardTitle><Target className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalExperiments||0}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total XP</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.progress?.xp||0}</div></CardContent></Card>
        </div>
      </div>
    </AppShell>
  )
}

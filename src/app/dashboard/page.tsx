"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getLevel, formatXP } from "@/lib/utils"
import { BookOpen, Brain, Award, Zap, Flame, Target, Sparkles, Library, ArrowRight, Clock } from "lucide-react"

export default function DashboardPage() {
  const r = useRouter()
  const [data] = useState<any>({progress:{xp:0,streak_days:0,books_finished:0,average_recall:0,experiments_completed:0},currentBook:null,todayReview:[],achievements:[],recentSessions:[]})
  const lv = getLevel(data.progress.xp)
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-muted-foreground">Your learning journey</p></div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2"><Zap className="h-4 w-4 mr-1" />{formatXP(data.progress.xp)} XP</Badge>
            <Badge variant="default" className="text-lg px-4 py-2">Lv.{lv.level} {lv.name}</Badge>
          </div>
        </div>
        <Card><CardContent className="pt-6"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Level Progress</span><span className="text-sm font-medium">{Math.round(lv.progress*100)}%</span></div><Progress value={lv.progress*100} /></CardContent></Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Books Finished</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{data.progress.books_finished}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Recall</CardTitle><Brain className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(data.progress.average_recall*100)}%</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Streak</CardTitle><Flame className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{data.progress.streak_days} days</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Experiments</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{data.progress.experiments_completed}</div></CardContent></Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Library className="h-5 w-5" /> Current Book</CardTitle></CardHeader><CardContent>
            <div className="text-center py-8 space-y-3"><BookOpen className="h-12 w-12 text-muted-foreground mx-auto" /><p>No books yet</p><Button onClick={()=>r.push("/library")}>Add Your First Book</Button></div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Today's Reviews</CardTitle></CardHeader><CardContent>
            <div className="text-center py-8"><Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-2"/><p className="text-muted-foreground">All caught up!</p></div>
          </CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle><Award className="h-5 w-5 inline mr-2" />Achievements</CardTitle></CardHeader><CardContent>
          <p className="text-sm text-muted-foreground">Complete sessions to earn achievements</p>
        </CardContent></Card>
      </div>
    </AppShell>
  )
}

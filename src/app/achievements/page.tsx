"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
const ALL = [
  {slug:"first-book",title:"First Book",description:"Finished your first book",icon:"📖"},
  {slug:"critical-thinker",title:"Critical Thinker",description:"Asked 100 questions",icon:"🧠"},
  {slug:"experimenter",title:"Experimenter",description:"Completed 20 experiments",icon:"🔬"},
  {slug:"streak-30",title:"30 Day Streak",description:"30-day learning streak",icon:"🔥"},
  {slug:"perfect-teach",title:"Explained Perfectly",description:"Perfect teaching score",icon:"⭐"},
  {slug:"open-minded",title:"Changed Opinion",description:"Changed your mind after debate",icon:"🔄"},
  {slug:"scholar",title:"Scholar",description:"Reached Scholar level",icon:"🎓"},
  {slug:"master-thinker",title:"Master Thinker",description:"Reached Master level",icon:"👑"},
  {slug:"ten-books",title:"Bookworm",description:"Finished 10 books",icon:"📚"},
]
export default function AchievementsPage() {
  const r = useRouter()
  const [unlocked, setUnlocked] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{(supabase.auth as any).getSession().then((res: any)=>{const session=res.data?.session;if(!session){r.push("/");return}load()})},[r])
  async function load() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if(!user) return
      const {data} = await (supabase as any).from("achievements").select("slug").eq("user_id",user.id)
      setUnlocked(data?.map((a:any)=>a.slug)||[])
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Achievements</h1><p className="text-muted-foreground">Learning milestones</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL.map(a => {
            const u = unlocked.includes(a.slug)
            return (
              <Card key={a.slug} className={u?"border-primary/50":"opacity-60"}>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-4xl">{u ? a.icon : <Lock className="h-8 w-8 mx-auto text-muted-foreground"/>}</div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <Badge variant={u?"success":"secondary"}>{u?"Unlocked":"Locked"}</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

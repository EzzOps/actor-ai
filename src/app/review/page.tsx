"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle } from "lucide-react"
export default function ReviewPage() {
  const r = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{(supabase.auth as any).getSession().then((res: any)=>{const session=res.data?.session;if(!session){r.push("/");return}load()})},[r])
  async function load() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if(!user) return
      const {data} = await (supabase as any).from("review_sessions").select("*").eq("user_id",user.id).order("scheduled_date",{ascending:true}).limit(20)
      setReviews(data||[])
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Review</h1><p className="text-muted-foreground">Spaced repetition review sessions</p></div>
        {reviews.length===0 ? (
          <Card><CardContent className="text-center py-16"><CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3"/><p className="text-muted-foreground">No reviews scheduled. Complete reading sessions to generate reviews.</p></CardContent></Card>
        ) : (
          <div className="space-y-3">{reviews.map((r:any)=>(
            <Card key={r.id} className={r.completed?"opacity-60":""}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground"/>
                  <div><p className="font-medium">Day {r.interval} Review</p><p className="text-sm text-muted-foreground">{new Date(r.scheduled_date).toLocaleDateString()}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  {r.score!==null && <Badge variant="secondary">{Math.round(r.score)}%</Badge>}
                  <Badge variant={r.completed?"success":"warning"}>{r.completed?"Done":"Pending"}</Badge>
                  {!r.completed && <Button size="sm">Start</Button>}
                </div>
              </CardContent>
            </Card>
          ))}</div>
        )}
      </div>
    </AppShell>
  )
}

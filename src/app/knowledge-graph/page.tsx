"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen } from "lucide-react"
export default function KnowledgeGraphPage() {
  const r = useRouter()
  const [nodes, setNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{(supabase.auth as any).getSession().then((res: any)=>{const session=res.data?.session;if(!session){r.push("/");return}load()})},[r])
  async function load() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if(!user) return
      const {data} = await (supabase as any).from("knowledge_nodes").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
      setNodes(data||[])
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Knowledge Graph</h1><p className="text-muted-foreground">Your connected ideas</p></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5"/> Concept Map</CardTitle></CardHeader><CardContent>
          {nodes.length===0 ? (
            <div className="text-center py-16"><Brain className="h-16 w-16 text-muted-foreground mx-auto mb-3"/><p className="text-muted-foreground">No concepts mapped yet.</p></div>
          ) : (
            <div className="flex flex-wrap gap-3">{nodes.map((n:any)=>(<Badge key={n.id} variant="secondary" className="px-4 py-2 text-sm"><BookOpen className="h-3 w-3 mr-1"/>{n.concept}</Badge>))}</div>
          )}
        </CardContent></Card>
      </div>
    </AppShell>
  )
}

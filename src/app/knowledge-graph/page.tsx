"use client"
import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen } from "lucide-react"
export default function KnowledgeGraphPage() {
  const [nodes] = useState<any[]>([])
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Knowledge Graph</h1><p className="text-muted-foreground">Your connected ideas</p></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5"/> Concept Map</CardTitle></CardHeader><CardContent>
          <div className="text-center py-16"><Brain className="h-16 w-16 text-muted-foreground mx-auto mb-3"/><p className="text-muted-foreground">No concepts mapped yet.</p></div>
        </CardContent></Card>
      </div>
    </AppShell>
  )
}

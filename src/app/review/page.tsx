"use client"
import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
export default function ReviewPage() {
  const [reviews] = useState<any[]>([])
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Review</h1><p className="text-muted-foreground">Spaced repetition review sessions</p></div>
        <Card><CardContent className="text-center py-16"><CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3"/><p className="text-muted-foreground">No reviews scheduled.</p></CardContent></Card>
      </div>
    </AppShell>
  )
}

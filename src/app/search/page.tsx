"use client"
import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon, Brain } from "lucide-react"
export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  async function handleSearch() {
    if(!query.trim()) return
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResults(data.results||[])
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Search</h1><p className="text-muted-foreground">Search books, concepts, notes</p></div>
        <Card><CardContent className="pt-6">
          <div className="flex gap-2">
            <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search anything..." onKeyDown={e=>e.key==="Enter"&&handleSearch()}/>
            <Button onClick={handleSearch}><SearchIcon className="h-4 w-4 mr-2"/> Search</Button>
          </div>
        </CardContent></Card>
        {results.length>0 ? (
          <div className="space-y-3">{results.map((r:any,i:number)=>(
            <Card key={i}><CardContent className="py-4 flex items-center gap-3"><Brain className="h-5 w-5 text-primary"/><div><p className="font-medium">{r.concept||r.title}</p><p className="text-sm text-muted-foreground">{r.context||r.content?.slice(0,200)}</p></div></CardContent></Card>
          ))}</div>
        ) : (
          <Card><CardContent className="text-center py-16"><SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-3"/><p className="text-muted-foreground">Search across your learning library</p></CardContent></Card>
        )}
      </div>
    </AppShell>
  )
}

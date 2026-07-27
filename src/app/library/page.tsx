"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Upload, LinkIcon, FileText } from "lucide-react"
export default function LibraryPage() {
  const r = useRouter()
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  useEffect(() => { (supabase.auth as any).getSession().then((res: any) => { const session = res.data?.session; if (!session) { r.push("/"); return }; loadBooks() }) }, [r])
  async function loadBooks() {
    try {
      const {data:{user}} = await (supabase.auth as any).getUser()
      if (!user) return
      const {data} = await (supabase.from("books") as any).select("*").eq("user_id",user.id).order("updated_at",{ascending:false})
      setBooks(data||[])
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }
  async function addBook() {
    const {data:{user}} = await (supabase.auth as any).getUser()
    if (!user) return
    await (supabase.from("books") as any).insert({user_id:user.id,title,author,format:"url",source_url:url,total_chapters:1})
    setShowAdd(false); setTitle(""); setAuthor(""); setUrl(""); loadBooks()
  }
  if(loading) return <AppShell><div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></AppShell>
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Library</h1><p className="text-muted-foreground">Your book collection</p></div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Book</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a Book</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
                <Input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author" />
                <Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL" />
                <Button onClick={addBook} className="w-full">Add to Library</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {books.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Your library is empty</h2>
            <p className="text-muted-foreground">Add a book to start your learning journey</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload PDF</Button>
              <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload EPUB</Button>
              <Dialog><DialogTrigger asChild><Button><LinkIcon className="h-4 w-4 mr-2" /> Import URL</Button></DialogTrigger>
                <DialogContent><DialogHeader><DialogTitle>Import from URL</DialogTitle></DialogHeader>
                  <Input placeholder="https://..." /><Button className="w-full mt-4">Import</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map(b => (
              <Card key={b.id} className="hover:border-primary/50 cursor-pointer" onClick={()=>r.push(`/read?book=${b.id}`)}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3"><FileText className="h-6 w-6 text-primary" /></div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{b.title}</CardTitle>
                      <CardDescription>{b.author||"Unknown"}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">{b.total_chapters||0} chapters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

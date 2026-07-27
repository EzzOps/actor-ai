"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Upload, LinkIcon, FileText } from "lucide-react"

export default function LibraryPage() {
  const r = useRouter()
  const [books] = useState<any[]>([])
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Library</h1><p className="text-muted-foreground">Your book collection</p></div>
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Book</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a Book</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Title" />
                <Input placeholder="Author" />
                <Input placeholder="URL" />
                <Button className="w-full">Add to Library</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
      </div>
    </AppShell>
  )
}

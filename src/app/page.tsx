"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, GitBranch, BookOpen } from "lucide-react"
export default function Home() {
  const r = useRouter()
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [load, setLoad] = useState(false)
  const [signUp, setSignUp] = useState(false)
  const [err, setErr] = useState<string|null>(null)
  useEffect(() => { supabase.auth.getSession().then((res: any) => { const session = res.data?.session; if (session) r.push("/dashboard") }) }, [r])
  const auth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoad(true); setErr(null)
    try {
      if (signUp) {
        const { error } = await supabase.auth.signUp({ email, password: pass })
        if (error) throw error; setErr("Check your email for confirmation!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) throw error; r.push("/dashboard")
      }
    } catch (e: any) { setErr(e.message) }
    finally { setLoad(false) }
  }
  const oauth = async (p: "google"|"github") => { setLoad(true); try { await supabase.auth.signInWithOAuth({ provider: p }) } catch (e: any) { setErr(e.message) } finally { setLoad(false) } }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4"><div className="rounded-full bg-primary/10 p-4"><Brain className="h-10 w-10 text-primary" /></div></div>
          <h1 className="text-4xl font-bold gradient-text">ACTOR AI</h1>
          <p className="text-muted-foreground">Transform reading into an interactive learning journey</p>
        </div>
        <Card>
          <CardHeader><CardTitle>{signUp ? "Create Account" : "Welcome Back"}</CardTitle><CardDescription>{signUp ? "Start your interactive learning journey" : "Sign in to continue"}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={()=>oauth("google")} disabled={load}><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google</Button>
              <Button variant="outline" onClick={()=>oauth("github")} disabled={load}><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> GitHub</Button>
            </div>
            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with email</span></div></div>
            <form onSubmit={auth} className="space-y-3">
              <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required minLength={6} />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button type="submit" className="w-full" disabled={load}>{load ? "Loading..." : signUp ? "Create Account" : "Sign In"}</Button>
            </form>
            <div className="text-center text-sm"><button onClick={()=>setSignUp(!signUp)} className="text-primary hover:underline">{signUp ? "Already have an account?" : "Don't have an account?"}</button></div>
          </CardContent>
        </Card>
        <div className="text-center text-xs text-muted-foreground">ACTOR: Aim → Read → Compress → Test → Own → Run</div>
      </div>
    </div>
  )
}

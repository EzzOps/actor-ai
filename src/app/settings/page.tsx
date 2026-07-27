"use client"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Key, Palette } from "lucide-react"
export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl">
        <div><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Configure your environment</p></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5"/> API Configuration</CardTitle><CardDescription>Set your OpenAI API key (server-side env var)</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <Input type="password" placeholder="sk-..." />
            <Button>Save API Key</Button>
          </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5"/> Preferences</CardTitle><CardDescription>Customize your experience</CardDescription></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Theme and learning settings coming soon.</p></CardContent></Card>
      </div>
    </AppShell>
  )
}

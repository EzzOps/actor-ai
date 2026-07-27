"use client"
import { Sidebar } from "./sidebar"
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

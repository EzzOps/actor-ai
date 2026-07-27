"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Library, BookOpen, Brain, TrendingUp, Award, Search, BarChart3, Settings } from "lucide-react"
const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: Library },
  { href: "/read", label: "Read", icon: BookOpen },
  { href: "/knowledge-graph", label: "Knowledge Graph", icon: Brain },
  { href: "/review", label: "Review", icon: TrendingUp },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/search", label: "Search", icon: Search },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]
export function Sidebar() {
  const p = usePathname()
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Brain className="h-6 w-6 text-primary" />
          <span className="gradient-text">ACTOR AI</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {items.map((i) => {
          const Icon = i.icon
          return (
            <Link key={i.href} href={i.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                p.startsWith(i.href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}>
              <Icon className="h-4 w-4" /> {i.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

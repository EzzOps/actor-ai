import { createClient } from "@supabase/supabase-js"

let supabaseInstance: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    supabaseInstance = createClient(url, key)
  }
  return supabaseInstance
}

export function getSupabase() {
  const client = getClient()
  if (!client) throw new Error("Supabase credentials not configured")
  return client
}

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase credentials not configured")
  return createClient(url, key)
}

// Proxy allows module-level import but defers actual connection
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop: string) {
    const c = getClient()
    if (!c) {
      // Return a no-op proxy for build-time safety
      const noop = () => Promise.resolve({ data: null, error: new Error("Not configured") })
      if (prop === "from") return () => new Proxy({} as any, {
        get(_, q) {
          if (["select","insert","update","delete"].includes(q as string)) return () => ({
            data: null, error: null,
            eq: () => ({ data: null, error: null, single: noop, maybeSingle: noop, order: () => ({ data: null, error: null, limit: () => ({ data: null, error: null }) }) }),
            order: () => ({ data: null, error: null, limit: () => ({ data: null, error: null }) }),
            limit: () => ({ data: null, error: null }),
            maybeSingle: noop, single: noop,
          })
          return () => ({ data: null, error: null })
        }
      })
      if (prop === "auth") return new Proxy({} as any, {
        get(_, m) {
          if (m === "getSession") return () => Promise.resolve({ data: { session: null }, error: null })
          if (m === "getUser") return () => Promise.resolve({ data: { user: null }, error: null })
          if (m === "signInWithPassword") return () => Promise.resolve({ data: null, error: null })
          if (m === "signUp") return () => Promise.resolve({ data: null, error: null })
          if (m === "signInWithOAuth") return () => Promise.resolve({ data: null, error: null })
          return () => Promise.resolve({ data: null, error: null })
        }
      })
      return noop
    }
    return (c as any)[prop]
  }
})

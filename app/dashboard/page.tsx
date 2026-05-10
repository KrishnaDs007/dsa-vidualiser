'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, Columns3, TerminalSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

const pinned = [
  {
    title: 'Bubble Sort',
    description: 'Pinned foundational swap visualization.',
    href: '/sorting?algo=bubble'
  },
  {
    title: 'Insertion Sort',
    description: 'Pinned incremental sorted-window visualization.',
    href: '/sorting?algo=insertion'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const analyses = useAuthStore((state) => state.analyses)
  const setFlash = useAuthStore((state) => state.setFlash)

  useEffect(() => {
    if (!hydrated || user) return

    setFlash('Please sign in to open your dashboard.')
    router.push('/login?next=/dashboard')
  }, [hydrated, router, setFlash, user])

  if (!user) return null

  return (
    <main className="mx-auto max-w-7xl">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Personal Workspace
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight">
        {user.name}&apos;s Dashboard
      </h1>

      <section className="mt-12">
        <h2 className="text-2xl font-black tracking-tight">Pinned Visualizers</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {pinned.map((item) => (
            <Link
              className="group bg-[hsl(var(--surface-container-low))] p-6 transition hover:bg-white"
              href={item.href}
              key={item.title}
            >
              <Columns3 className="mb-8 h-8 w-8 text-primary" />
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-foreground/70">
                {item.description}
              </p>
              <ArrowRight className="mt-8 h-5 w-5 text-primary transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Custom Code Visualizers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Saved time and space complexity reads from your custom snippets.
            </p>
          </div>
          <Button asChild>
            <Link href="/custom-visualizer">
              New Analysis <TerminalSquare className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {analyses.length === 0 ? (
            <div className="bg-[hsl(var(--surface-container-low))] p-6 text-sm text-muted-foreground md:col-span-2">
              No custom code visualizers yet. Create one to see it here.
            </div>
          ) : (
            analyses.map((item) => (
              <article
                className="bg-[hsl(var(--surface-container-low))] p-6"
                key={item.id}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs">
                  <span className="rounded-sm bg-emerald-200 px-3 py-1 text-emerald-900">
                    Time {item.timeComplexity}
                  </span>
                  <span className="rounded-sm bg-violet-100 px-3 py-1 text-primary">
                    Space {item.spaceComplexity}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

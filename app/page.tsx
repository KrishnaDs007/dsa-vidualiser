import Link from 'next/link'
import { ArrowRight, GitBranch, Network, Search, Rows3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const modules = [
  {
    title: 'Sorting',
    href: '/sorting',
    icon: Rows3,
    description: 'Start with generator-powered Bubble and Insertion Sort.'
  },
  {
    title: 'Trees',
    href: '#',
    icon: GitBranch,
    description: 'Planned: BST insert, search, and traversals.'
  },
  {
    title: 'Graphs',
    href: '#',
    icon: Network,
    description: 'Planned: BFS, DFS, and Dijkstra pathfinding.'
  },
  {
    title: 'Search',
    href: '#',
    icon: Search,
    description: 'Planned: linear and binary search.'
  }
]

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Step 1 in progress
            </p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              DSA Visualizer
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              A portfolio-ready visual learning tool built with Next.js,
              Framer Motion, Zustand, and pure TypeScript algorithm engines.
            </p>
          </div>
          <Button asChild>
            <Link href="/sorting">
              Open Sorting <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon
            const disabled = module.href === '#'

            return (
              <Link
                aria-disabled={disabled}
                className={`group rounded-lg border border-border bg-white/75 p-5 shadow-sm transition hover:border-primary ${
                  disabled ? 'pointer-events-none opacity-65' : ''
                }`}
                href={module.href}
                key={module.title}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-muted text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">{module.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  {!disabled && (
                    <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

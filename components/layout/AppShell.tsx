'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { useEffect } from 'react'
import {
  BarChart3,
  BookOpen,
  Boxes,
  CircleDot,
  GitBranch,
  GitMerge,
  Home,
  Layers3,
  LayoutDashboard,
  LogOut,
  Network,
  Plus,
  Search,
  Sparkles,
  SquareStack,
  TerminalSquare,
  Trees
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const primaryNav = [
  { label: 'Explore', href: '/', icon: Home },
  { label: 'Visualizer', href: '/sorting', icon: BarChart3 },
  { label: 'Documentation', href: '/docs', icon: BookOpen }
]

const sideNav = [
  { label: 'Sorting', href: '/sorting', icon: Layers3 },
  { label: 'Searching', href: '/search', icon: Search },
  { label: 'Hashing', href: '/hashing', icon: CircleDot },
  { label: 'Stacks', href: '/stacks', icon: SquareStack },
  { label: 'Queues', href: '/queues', icon: GitBranch },
  { label: 'Linked Lists', href: '/linked-lists', icon: GitMerge },
  { label: 'Arrays & Strings', href: '/arrays-strings', icon: BarChart3 },
  { label: 'Graphs', href: '/graphs', icon: Network },
  { label: 'Trees', href: '/trees', icon: Trees },
  { label: 'Dynamic Programming', href: '/dynamic-programming', icon: Boxes },
  { label: 'Backtracking', href: '/backtracking', icon: GitBranch },
  { label: 'Custom Code Visualizer', href: '/custom-visualizer', icon: TerminalSquare }
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const flash = useAuthStore((state) => state.flash)
  const hydrate = useAuthStore((state) => state.hydrate)
  const logout = useAuthStore((state) => state.logout)
  const setFlash = useAuthStore((state) => state.setFlash)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!flash) return

    const id = window.setTimeout(() => setFlash(null), 4200)
    return () => window.clearTimeout(id)
  }, [flash, setFlash])

  return (
    <div className="min-h-screen text-foreground">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="glass-panel-strong sticky top-0 z-40 mx-3 mt-3 flex min-h-16 flex-wrap items-center gap-3 rounded-lg px-3 py-3 sm:gap-4 sm:px-5 lg:mx-5 lg:min-h-20 lg:gap-6 lg:px-8">
        <Link className="mr-auto text-xl font-black tracking-tight text-foreground sm:text-2xl lg:mr-4" href="/">
          AlgoPrecision
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-semibold text-foreground/76 transition hover:bg-[hsl(var(--glass))] hover:text-primary',
                  active && 'bg-[hsl(var(--glass-strong))] text-primary shadow-sm'
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link
          className="order-last flex h-10 w-full items-center gap-3 rounded-md border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] px-3 text-muted-foreground shadow-sm backdrop-blur-xl sm:w-auto md:hidden"
          href="/docs"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Search algorithms</span>
        </Link>

        <div
          aria-hidden="true"
          className="ml-auto hidden h-11 w-[320px] items-center gap-3 rounded-md border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] px-4 text-muted-foreground shadow-sm backdrop-blur-xl lg:flex"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Search algorithms...</span>
        </div>

        {user ? (
          <div className="flex min-w-0 items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/dashboard">{user.name}</Link>
            </Button>
            <Button aria-label="Sign out" onClick={logout} size="icon" variant="outline">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </header>

      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)]">
        <aside aria-label="Algorithm navigation" className="sticky top-[5.5rem] z-30 px-3 py-4 lg:static lg:min-h-[calc(100vh-80px)] lg:px-8 lg:py-10">
          <div className="mb-7 hidden items-center gap-4 lg:flex">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-strong))] text-primary shadow-sm backdrop-blur-xl">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Algorithm Library</p>
              <p className="font-mono text-xs text-muted-foreground">Precision Blueprint v1.0</p>
            </div>
          </div>

          <Button asChild className="mb-3 hidden w-full justify-center uppercase tracking-[0.18em] lg:mb-10 lg:inline-flex" variant="secondary">
            <Link href="/custom-visualizer">
              <Plus className="h-4 w-4" /> New Visualization
            </Link>
          </Button>

          <nav aria-label="Algorithm categories" className="glass-panel flex gap-2 overflow-x-auto rounded-lg p-2 lg:flex-col lg:overflow-visible">
            {user && (
              <SideLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" pathname={pathname} />
            )}
            {sideNav.map((item) => (
              <SideLink
                href={item.href}
                icon={item.icon}
                key={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </nav>
        </aside>

        <div className="min-w-0 px-3 pb-16 pt-4 sm:px-5 lg:px-8 lg:pb-20 lg:pt-8 2xl:px-10" id="main-content" tabIndex={-1}>
          {flash && (
            <div
              aria-live="polite"
              className="glass-panel-strong fixed left-3 right-3 top-24 z-50 rounded-md px-4 py-3 text-sm sm:left-auto sm:max-w-sm"
              role="status"
            >
              <div className="flex items-start gap-3">
                <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 text-primary" />
                <p>{flash}</p>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

function SideLink({
  href,
  icon: Icon,
  label,
  pathname
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  pathname: string
}) {
  const active = pathname === href

  return (
    <Link
      className={cn(
        'group flex min-h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:bg-[hsl(var(--glass))] hover:text-primary lg:min-h-14 lg:gap-5 lg:px-5 lg:text-sm lg:tracking-[0.18em]',
        active && 'bg-[hsl(var(--glass-strong))] text-primary shadow-sm'
      )}
      aria-current={active ? 'page' : undefined}
      href={href}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

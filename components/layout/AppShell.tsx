'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'
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
  Trees,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const primaryNav = [
  { label: 'Explore', href: '/', icon: Home },
  { label: 'Visualizer', href: '/sorting', icon: BarChart3 },
  { label: 'Documentation', href: '/docs', icon: BookOpen }
]

// Backend auth is intentionally disabled for now. Flip this to true when the
// backend-backed login/session flow is ready.
const AUTH_ENTRYPOINTS_ENABLED = false

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
  { label: 'Greedy', href: '/greedy', icon: Zap },
  { label: 'Custom Code Visualizer', href: '/custom-visualizer', icon: TerminalSquare }
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen text-foreground">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="glass-panel-strong sticky top-0 z-40 mx-3 mt-3 flex min-h-16 flex-wrap items-center gap-3 rounded-lg px-3 py-3 sm:gap-4 sm:px-5 lg:mx-5 lg:min-h-20 lg:gap-6 lg:px-8">
        <Link className="mr-auto text-xl font-black tracking-tight text-foreground sm:text-2xl lg:mr-4" href="/">
          AlgoPrecision
        </Link>

        <Button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          size="icon"
          variant="secondary"
        >
          {isMenuOpen ? <Plus className="h-5 w-5 rotate-45" /> : <Layers3 className="h-5 w-5" />}
        </Button>

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

        <div
          aria-hidden="true"
          className="ml-auto hidden h-11 w-[320px] items-center gap-3 rounded-md border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] px-4 text-muted-foreground shadow-sm backdrop-blur-xl lg:flex"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Search algorithms...</span>
        </div>

        {AUTH_ENTRYPOINTS_ENABLED &&
          (user ? (
            <div className="flex min-w-0 items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/dashboard">{user.name}</Link>
              </Button>
              <Button aria-label="Sign out" onClick={logout} size="icon" variant="outline">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Re-enable this login button when backend auth is connected.
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          ))}
      </header>

      {isMenuOpen && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          type="button"
        />
      )}

      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)]">
        <aside
          aria-label="Algorithm navigation"
          className={cn(
            'fixed bottom-3 left-3 right-3 top-20 z-50 hidden overflow-hidden rounded-lg lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:min-h-0 lg:overflow-hidden lg:px-5 lg:py-5 2xl:px-8 2xl:py-8',
            isMenuOpen && 'block'
          )}
        >
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

          <nav aria-label="Algorithm categories" className="glass-panel flex h-full flex-col gap-2 overflow-y-auto rounded-lg p-2 lg:h-auto lg:max-h-[calc(100vh-15rem)]">
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

        <div className="min-w-0 px-3 pb-6 pt-4 sm:px-5 lg:px-8 lg:pb-8 lg:pt-8 2xl:px-10" id="main-content" tabIndex={-1}>
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
      <Footer />
    </div>
  )
}

function Footer() {
  const productLinks = [
    { label: 'Explore', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Sorting', href: '/sorting' },
    { label: 'Graphs', href: '/graphs' },
    { label: 'Dynamic Programming', href: '/dynamic-programming' },
    { label: 'Custom Visualizer', href: '/custom-visualizer' }
  ]

  const profileLinks = [
    { label: 'Portfolio', href: 'https://krishnasportfolio-rho.vercel.app/' },
    { label: 'Email', href: 'mailto:krishnadevashish17@gmail.com' },
    { label: 'Live Project', href: 'https://dsa-vidualiser.vercel.app/' }
  ]

  return (
    <footer className="mt-6 w-full bg-[#07111f] text-slate-100 shadow-[0_-24px_70px_rgba(0,0,0,0.18)]">
      <div className="mx-auto grid max-w-[132rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.7fr)_minmax(220px,0.7fr)_auto] lg:px-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            DSA Visualizer
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            Learn algorithms by watching every decision move.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A standalone visual learning workspace for sorting, searching,
            trees, graphs, dynamic programming, backtracking, greedy methods,
            and custom code complexity. Built to make abstract DSA steps feel
            visible, testable, and easier to revisit.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-md bg-cyan-300 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
              Product: AlgoPrecision
            </span>
            <span className="rounded-md bg-amber-300 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
              Creator: Krishna Devashish
            </span>
          </div>
        </div>

        <FooterLinkGroup title="Menu" links={productLinks} />
        <FooterLinkGroup title="Profile & Links" links={profileLinks} />

        <div className="flex flex-col gap-4 lg:items-end">
          <button
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
          >
            Back to top
          </button>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            <p className="font-bold text-white">Connect</p>
            <p className="mt-1">
              Portfolio and contact links are wired now. Add GitHub, LinkedIn,
              or X links here when those public profile URLs are ready.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[132rem] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {new Date().getFullYear()} Krishna Devashish. All rights
            reserved.
          </p>
          <p>Built for interactive DSA learning and custom complexity exploration.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkGroup({
  title,
  links
}: {
  title: string
  links: Array<{ label: string; href: string }>
}) {
  return (
    <nav aria-label={title}>
      <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
        {title}
      </p>
      <div className="mt-4 grid gap-2">
        {links.map((item) => {
          const isExternal = item.href.startsWith('http')

          return (
            <Link
              className="group inline-flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/12 hover:text-white"
              href={item.href}
              key={item.href}
              rel={isExternal ? 'noreferrer' : undefined}
              target={isExternal ? '_blank' : undefined}
            >
              <span>{item.label}</span>
              <span className="text-cyan-300 transition group-hover:translate-x-0.5">
                -&gt;
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
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
        'group flex min-h-12 shrink-0 items-center gap-3 rounded-md px-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition hover:bg-[hsl(var(--glass))] hover:text-primary lg:min-h-12 lg:gap-3 lg:px-3 lg:text-[11px] lg:tracking-[0.12em] 2xl:min-h-14 2xl:px-5 2xl:text-sm 2xl:tracking-[0.18em]',
        active && 'bg-[hsl(var(--glass-strong))] text-primary shadow-sm'
      )}
      aria-current={active ? 'page' : undefined}
      href={href}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  )
}

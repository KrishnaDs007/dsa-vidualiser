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
    { label: 'Sorting visualizer', href: '/sorting' },
    { label: 'Graph visualizer', href: '/graphs' },
    { label: 'Dynamic programming', href: '/dynamic-programming' },
    { label: 'Custom code visualizer', href: '/custom-visualizer' }
  ]

  const profileLinks = [
    { label: 'Portfolio', href: 'https://krishnasportfolio-rho.vercel.app/' },
    { label: 'Email Krishna', href: 'mailto:krishnadevashish17@gmail.com' },
    { label: 'Live project', href: 'https://dsa-vidualiser.vercel.app/' }
  ]

  const socialLinks = [
    { label: 'Portfolio', href: 'https://krishnasportfolio-rho.vercel.app/' },
    { label: 'Mail', href: 'mailto:krishnadevashish17@gmail.com' },
    { label: 'Live', href: 'https://dsa-vidualiser.vercel.app/' }
  ]

  return (
    <footer className="mt-6 w-full overflow-hidden bg-[#111111] text-white shadow-[0_-24px_70px_rgba(0,0,0,0.18)]">
      {/* <div className="bg-[#f7f7f2] text-[#111111]">
        <div className="mx-auto grid max-w-[132rem] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[0.45fr_1fr_auto] md:items-center lg:px-12 lg:py-16">
          <p className="max-w-28 font-mono text-xs font-black uppercase leading-tight tracking-[0.12em]">
            Seen enough? -&gt;
          </p>

          <div>
            <p className="text-[clamp(3rem,10vw,7.5rem)] font-black leading-none tracking-tight">
              Contact us
            </p>
            <div className="mt-3 h-1 w-full max-w-sm bg-[#e7ff00]" />
          </div>

          <Link
            aria-label="Open portfolio"
            className="grid h-20 w-20 place-items-center rounded-full bg-[#e7ff00] text-3xl font-black text-[#111111] transition hover:scale-105 hover:bg-[#d7ef00] sm:h-24 sm:w-24"
            href="https://krishnasportfolio-rho.vercel.app/"
            rel="noreferrer"
            target="_blank"
          >
            -&gt;
          </Link>
        </div>
      </div> */}

      <div className="mx-auto grid max-w-[132rem] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.9fr_0.9fr_1fr] lg:px-12 lg:py-14">
        <div>
          <p className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">
            Visual DSA
            <br />
            for impatient
            <br />
            learners
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e7ff00] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#111111]">
              AlgoPrecision
            </span>
            <span className="rounded-full border border-white/18 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
              Krishna Devashish
            </span>
          </div>
        </div>

        <FooterLinkGroup title="Product" links={productLinks} />
        <FooterLinkGroup title="Profile" links={profileLinks} />

        <div className="flex flex-col gap-7">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-white">
              Want to learn faster?
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              Step through algorithms, compare complexity, read docs, and test
              your own code from one standalone workspace.
            </p>
            <Link
              className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.08em] underline decoration-[#e7ff00] underline-offset-4 transition hover:text-[#e7ff00]"
              href="/docs"
            >
              Read the docs -&gt;
            </Link>
          </div>

          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-white">
              Follow / contact
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <FooterSocialLink
                  href={item.href}
                  key={item.href}
                  label={item.label}
                />
              ))}
            </div>
          </div>

          <button
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-[#e7ff00] hover:text-[#e7ff00]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
          >
            Back to top
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/55 sm:px-8 lg:px-12">
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-white">
        {title}
      </p>
      <div className="mt-5 grid gap-3">
        {links.map((item) => {
          const isExternal = item.href.startsWith('http')

          return (
            <Link
              className="group inline-flex items-center justify-between gap-3 text-sm font-bold text-white/72 underline decoration-white/18 underline-offset-4 transition hover:text-[#e7ff00] hover:decoration-[#e7ff00]"
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

function FooterSocialLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith('http')

  return (
    <Link
      aria-label={label}
      className="grid h-11 min-w-11 place-items-center rounded-full border border-white/18 px-4 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:border-[#e7ff00] hover:bg-[#e7ff00] hover:text-[#111111]"
      href={href}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {label}
    </Link>
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

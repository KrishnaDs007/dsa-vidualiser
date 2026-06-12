'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, type ChangeEvent, useEffect } from 'react'
import {
  ArrowRight,
  Columns3,
  Copy,
  Download,
  Pencil,
  TerminalSquare,
  Trash2,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLanguageLabel } from '@/lib/customCode'
import { MAX_SAVED_ANALYSES, useAuthStore } from '@/store/authStore'

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
  const deleteAnalysis = useAuthStore((state) => state.deleteAnalysis)
  const duplicateAnalysis = useAuthStore((state) => state.duplicateAnalysis)
  const exportWorkspace = useAuthStore((state) => state.exportWorkspace)
  const importWorkspace = useAuthStore((state) => state.importWorkspace)
  const setFlash = useAuthStore((state) => state.setFlash)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!hydrated || user) return

    setFlash('Please sign in to open your dashboard.')
    router.push('/login?next=/dashboard')
  }, [hydrated, router, setFlash, user])

  if (!user) return null

  function downloadWorkspace() {
    const json = exportWorkspace()
    if (!json) return

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `dsa-visualizer-workspace-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function importWorkspaceFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importWorkspace(reader.result)
      }
      event.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <main className="mx-auto max-w-7xl">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Personal Workspace
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight">
        {user.name}&apos;s Dashboard
      </h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={downloadWorkspace} type="button" variant="secondary">
          <Download className="h-4 w-4" /> Export Workspace
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <Upload className="h-4 w-4" /> Import Workspace
        </Button>
        <input
          accept="application/json"
          className="hidden"
          onChange={importWorkspaceFile}
          ref={fileInputRef}
          type="file"
        />
      </div>

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
              Saved custom snippets and complexity reads. {analyses.length}/
              {MAX_SAVED_ANALYSES} slots used.
            </p>
          </div>
          {analyses.length >= MAX_SAVED_ANALYSES ? (
            <Button disabled>
              Slots Full <TerminalSquare className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild>
              <Link href="/custom-visualizer">
                New Analysis <TerminalSquare className="h-4 w-4" />
              </Link>
            </Button>
          )}
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
                  {new Date(item.createdAt).toLocaleDateString()} /{' '}
                  {item.language ? getLanguageLabel(item.language) : 'Legacy'}
                </p>
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                {item.code && (
                  <pre className="mt-4 max-h-28 overflow-hidden rounded-md bg-white p-4 text-xs leading-5 text-foreground/70">
                    {item.code}
                  </pre>
                )}
                <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs">
                  <span className="rounded-sm bg-emerald-200 px-3 py-1 text-emerald-900">
                    Time {item.timeComplexity}
                  </span>
                  <span className="rounded-sm bg-violet-100 px-3 py-1 text-primary">
                    Space {item.spaceComplexity}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/custom-visualizer?id=${item.id}`}>
                      <Pencil className="h-4 w-4" /> Open
                    </Link>
                  </Button>
                  <Button
                    onClick={() => duplicateAnalysis(item.id)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" /> Duplicate
                  </Button>
                  <Button
                    onClick={() => deleteAnalysis(item.id)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

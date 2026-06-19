'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { VisualizerDoc } from '@/lib/visualizerDocs'
import { filterVisualizerDocs } from '@/lib/visualizerDocs'

interface DocsBrowserProps {
  docs: VisualizerDoc[]
}

export function DocsBrowser({ docs }: DocsBrowserProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => filterVisualizerDocs(query, docs), [docs, query])
  const grouped = useMemo(
    () =>
      results.reduce<Record<string, VisualizerDoc[]>>((groups, item) => {
        groups[item.category] = [...(groups[item.category] ?? []), item]
        return groups
      }, {}),
    [results]
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return

    const id = window.location.hash.slice(1)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 80)
  }, [])

  return (
    <section className="mt-10">
      <div className="glass-panel flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center">
        <Search className="h-5 w-5 text-primary" />
        <input
          aria-label="Search visualizer docs"
          className="min-h-11 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search docs by algorithm, pattern, complexity, or category"
          value={query}
        />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {results.length} docs
        </span>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <article className="glass-panel rounded-lg p-5" key={category}>
            <h2 className="text-2xl font-black tracking-tight">{category}</h2>
            <div className="mt-5 grid gap-4">
              {items.map((item) => (
                <section
                  className="rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4"
                  id={item.id}
                  key={item.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-foreground/75">
                        {item.summary}
                      </p>
                    </div>
                    <Link
                      className="shrink-0 rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-center text-sm font-bold text-primary-foreground"
                      href={item.route}
                    >
                      Open
                    </Link>
                  </div>
                  <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {item.complexity}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.patterns.map((pattern) => (
                      <span
                        className="rounded-md bg-[hsl(var(--surface-container-highest))] px-2.5 py-1 text-xs font-semibold"
                        key={pattern}
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                  <ol className="mt-4 grid gap-2 text-sm text-foreground/75">
                    {item.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

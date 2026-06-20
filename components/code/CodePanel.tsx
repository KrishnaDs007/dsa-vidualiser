'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import {
  CODE_SAMPLE_LANGUAGES,
  type HighlightedCodeSamples
} from '@/lib/codeSampleLanguages'
import { useAlgorithmStore } from '@/store/algorithmStore'

export function CodePanel({
  docsHref,
  highlightedCode,
  highlightedCodeByLanguage,
  codeLine: controlledCodeLine
}: {
  docsHref?: string
  highlightedCode: string
  highlightedCodeByLanguage?: HighlightedCodeSamples
  codeLine?: number
}) {
  const storeCodeLine = useAlgorithmStore(
    (state) => state.frames[state.currentStep]?.codeLine
  )
  const codeLine = controlledCodeLine ?? storeCodeLine
  const ref = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<keyof HighlightedCodeSamples>('typescript')
  const visibleCode = highlightedCodeByLanguage?.[language] ?? highlightedCode

  useEffect(() => {
    if (!ref.current) return

    const lines = ref.current.querySelectorAll('.line')
    lines.forEach((line, index) => {
      line.classList.toggle('line-active', index === (codeLine ?? -1) - 1)
    })
    lines[(codeLine ?? 1) - 1]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth'
    })
  }, [codeLine, visibleCode])

  return (
    <div className="visualizer-code glass-panel flex max-h-[520px] min-h-[300px] flex-col overflow-hidden rounded-lg text-xs sm:max-h-[620px] sm:min-h-[360px] sm:text-sm 2xl:max-h-[720px]">
      <div className="grid gap-3 border-b border-[hsl(var(--glass-border))] p-3 sm:flex sm:flex-wrap sm:items-center sm:p-4">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground sm:w-auto">
          Sample
        </label>
        <select
          className="h-9 w-full min-w-0 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 sm:w-auto sm:min-w-44"
          onChange={(event) =>
            setLanguage(event.target.value as keyof HighlightedCodeSamples)
          }
          value={language}
        >
          {CODE_SAMPLE_LANGUAGES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {docsHref && (
          <Link
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-3 text-sm font-bold text-primary-foreground sm:ml-auto sm:w-auto"
            href={docsHref}
          >
            <BookOpen className="h-4 w-4" />
            Details
          </Link>
        )}
      </div>
      <div className="flex-1 overflow-auto px-1 py-2 sm:px-2">
        <div
          className="visualizer-code-content p-4 sm:p-5"
          dangerouslySetInnerHTML={{ __html: visibleCode }}
          ref={ref}
        />
      </div>
    </div>
  )
}

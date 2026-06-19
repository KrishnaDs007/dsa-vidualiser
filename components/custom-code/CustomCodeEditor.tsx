'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import { Columns3, TerminalSquare } from 'lucide-react'
import { getLanguageLabel, type CustomCodeLanguageId } from '@/lib/customCode'

interface CustomCodeEditorProps {
  activeLine?: number
  code: string
  complexitySummary?: React.ReactNode
  headerActions?: React.ReactNode
  language: CustomCodeLanguageId
  onChange: (code: string) => void
}

export function CustomCodeEditor({
  activeLine,
  code,
  complexitySummary,
  headerActions,
  language,
  onChange
}: CustomCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineCount = Math.max(code.split('\n').length, 12)
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1)

  useEffect(() => {
    if (!textareaRef.current || !activeLine) return

    const lineHeight = 28
    textareaRef.current.scrollTop = Math.max((activeLine - 4) * lineHeight, 0)
  }, [activeLine])

  return (
    <section className="glass-panel overflow-hidden rounded-lg">
      <div className="grid gap-3 border-b border-[hsl(var(--glass-border))] px-3 py-3 sm:px-4 lg:flex lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[hsl(var(--primary)/0.12)] text-primary">
            <TerminalSquare aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black">Custom Code Editor</p>
            <p className="truncate text-xs text-muted-foreground">
              {getLanguageLabel(language)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <div className="flex items-center gap-2 rounded-md bg-[hsl(var(--glass))] px-3 py-2 text-xs font-semibold text-muted-foreground">
            <Columns3 aria-hidden="true" className="h-4 w-4" />
            {lineCount} lines
          </div>
          {complexitySummary}
        </div>
        {headerActions && (
          <div className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
            {headerActions}
          </div>
        )}
      </div>

      <div className="grid min-h-[360px] grid-cols-[2.5rem_minmax(0,1fr)] sm:min-h-[560px] sm:grid-cols-[3.5rem_minmax(0,1fr)]">
        <div
          aria-hidden="true"
          className="select-none border-r border-[hsl(var(--glass-border))] bg-[hsl(var(--foreground)/0.035)] px-2 py-4 text-right font-mono text-xs leading-7 text-muted-foreground sm:px-3 sm:py-5"
        >
          {lineNumbers.map((line) => (
            <div
              className={
                activeLine === line
                  ? 'rounded-sm bg-[hsl(var(--primary)/0.16)] pr-1 text-primary'
                  : undefined
              }
              key={line}
            >
              {line}
            </div>
          ))}
        </div>
        <textarea
          aria-label="Custom code"
          className="min-h-[360px] w-full resize-y border-0 bg-transparent p-3 font-mono text-sm leading-7 outline-none sm:min-h-[560px] sm:p-5"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write or paste code to analyze time and space complexity."
          ref={textareaRef}
          spellCheck={false}
          value={code}
        />
      </div>
    </section>
  )
}

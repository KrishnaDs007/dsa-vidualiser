'use client'

import { Columns3, TerminalSquare } from 'lucide-react'
import { getLanguageLabel, type CustomCodeLanguageId } from '@/lib/customCode'

interface CustomCodeEditorProps {
  activeLine?: number
  code: string
  language: CustomCodeLanguageId
  onChange: (code: string) => void
}

export function CustomCodeEditor({
  activeLine,
  code,
  language,
  onChange
}: CustomCodeEditorProps) {
  const lineCount = Math.max(code.split('\n').length, 12)
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1)

  return (
    <section className="glass-panel overflow-hidden rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(var(--glass-border))] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[hsl(var(--primary)/0.12)] text-primary">
            <TerminalSquare aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black">Custom Code Editor</p>
            <p className="text-xs text-muted-foreground">
              {getLanguageLabel(language)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-[hsl(var(--glass))] px-3 py-2 text-xs font-semibold text-muted-foreground">
          <Columns3 aria-hidden="true" className="h-4 w-4" />
          {lineCount} lines
        </div>
      </div>

      <div className="grid min-h-[560px] grid-cols-[3.5rem_minmax(0,1fr)]">
        <div
          aria-hidden="true"
          className="select-none border-r border-[hsl(var(--glass-border))] bg-[hsl(var(--foreground)/0.035)] px-3 py-5 text-right font-mono text-xs leading-7 text-muted-foreground"
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
          className="min-h-[560px] w-full resize-y border-0 bg-transparent p-5 font-mono text-sm leading-7 outline-none"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write or paste code to analyze time and space complexity."
          spellCheck={false}
          value={code}
        />
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useAlgorithmStore } from '@/store/algorithmStore'

export function CodePanel({
  highlightedCode,
  codeLine: controlledCodeLine
}: {
  highlightedCode: string
  codeLine?: number
}) {
  const storeCodeLine = useAlgorithmStore(
    (state) => state.frames[state.currentStep]?.codeLine
  )
  const codeLine = controlledCodeLine ?? storeCodeLine
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const lines = ref.current.querySelectorAll('.line')
    lines.forEach((line, index) => {
      line.classList.toggle('line-active', index === (codeLine ?? -1) - 1)
    })
    lines[(codeLine ?? 1) - 1]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    })
  }, [codeLine])

  return (
    <div className="h-[560px] overflow-auto rounded-lg bg-[hsl(var(--surface-container-low))] text-sm">
      <div
        className="min-w-max p-4"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        ref={ref}
      />
    </div>
  )
}

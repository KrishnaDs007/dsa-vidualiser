'use client'

import { useEffect } from 'react'
import { SortCanvas } from '@/components/canvas/SortCanvas'
import { CodePanel } from '@/components/code/CodePanel'
import { ArrayInput } from '@/components/controls/ArrayInput'
import { ControlPanel } from '@/components/controls/ControlPanel'
import { SORT_ALGORITHMS, type AlgorithmId } from '@/engine/sorting'
import { usePlayback } from '@/hooks/usePlayback'
import type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { usePlaybackStore } from '@/store/playbackStore'

interface SortingViewProps {
  highlightedCodeByAlgo: Record<AlgorithmId, HighlightedCodeSamples>
  initialAlgo: AlgorithmId
  initialArray: number[]
}

export function SortingView({
  highlightedCodeByAlgo,
  initialAlgo,
  initialArray
}: SortingViewProps) {
  usePlayback()

  const algorithm = useAlgorithmStore((state) => state.algorithm)
  const setAlgorithm = useAlgorithmStore((state) => state.setAlgorithm)
  const setInputArray = useAlgorithmStore((state) => state.setInputArray)
  const frame = useAlgorithmStore(
    (state) => state.frames[state.currentStep]
  )
  const pause = usePlaybackStore((state) => state.pause)
  const highlightedCodeByLanguage = highlightedCodeByAlgo[algorithm]

  useEffect(() => {
    setAlgorithm(initialAlgo)
    setInputArray(initialArray)
  }, [initialAlgo, initialArray, setAlgorithm, setInputArray])

  const activeAlgorithm = SORT_ALGORITHMS[algorithm]

  return (
    <main className="responsive-page flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Generator Driven
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">
            Sorting Visualizer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Generator snapshots drive the bars, controls, and highlighted code
            from one source of truth.
          </p>
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-lg p-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Algorithm
          </label>
          <select
            className="h-10 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) => {
              pause()
              setAlgorithm(event.target.value as AlgorithmId)
            }}
            value={algorithm}
          >
            {Object.values(SORT_ALGORITHMS).map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="rounded-md bg-[hsl(var(--primary)/0.14)] px-2.5 py-1 font-mono text-sm font-semibold text-primary">
            {activeAlgorithm.complexity}
          </span>
        </div>
      </header>

      <section className="visualizer-grid">
        <aside className="visualizer-controls glass-panel flex flex-col gap-4 rounded-lg p-3 sm:p-4">
          <ControlPanel />
          <ArrayInput />
        </aside>
        <SortCanvas frame={frame} />
        <CodePanel
          docsHref={`/docs#sorting-${algorithm}`}
          highlightedCode={highlightedCodeByLanguage.typescript}
          highlightedCodeByLanguage={highlightedCodeByLanguage}
        />
      </section>
    </main>
  )
}

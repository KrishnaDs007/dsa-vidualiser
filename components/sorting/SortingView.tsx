'use client'

import { useEffect } from 'react'
import { SortCanvas } from '@/components/canvas/SortCanvas'
import { CodePanel } from '@/components/code/CodePanel'
import { ArrayInput } from '@/components/controls/ArrayInput'
import { ControlPanel } from '@/components/controls/ControlPanel'
import { SORT_ALGORITHMS, type AlgorithmId } from '@/engine/sorting'
import { usePlayback } from '@/hooks/usePlayback'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { usePlaybackStore } from '@/store/playbackStore'

interface SortingViewProps {
  highlightedCodeByAlgo: Record<AlgorithmId, string>
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
  const highlightedCode = highlightedCodeByAlgo[algorithm]

  useEffect(() => {
    setAlgorithm(initialAlgo)
    setInputArray(initialArray)
  }, [initialAlgo, initialArray, setAlgorithm, setInputArray])

  const activeAlgorithm = SORT_ALGORITHMS[algorithm]

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Generator Driven
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Sorting Visualizer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Generator snapshots drive the bars, controls, and highlighted code
            from one source of truth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Algorithm
          </label>
          <select
            className="h-10 rounded-md bg-[hsl(var(--surface-container-highest))] px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
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
          <span className="rounded-md bg-emerald-200 px-2.5 py-1 font-mono text-sm font-semibold text-emerald-900">
            {activeAlgorithm.complexity}
          </span>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1.35fr)_minmax(380px,0.9fr)]">
        <aside className="flex flex-col gap-4 bg-[hsl(var(--surface-container-low))] p-4">
          <ControlPanel />
          <ArrayInput />
        </aside>
        <SortCanvas frame={frame} />
        <CodePanel highlightedCode={highlightedCode} />
      </section>
    </main>
  )
}

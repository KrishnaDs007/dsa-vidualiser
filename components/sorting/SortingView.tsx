'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { SortCanvas } from '@/components/canvas/SortCanvas'
import { CodePanel } from '@/components/code/CodePanel'
import { ArrayInput } from '@/components/controls/ArrayInput'
import { ControlPanel } from '@/components/controls/ControlPanel'
import { Button } from '@/components/ui/button'
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
    <main className="min-h-screen px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Algorithms
              </Link>
            </Button>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Sorting Visualizer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Generator snapshots drive the bars, controls, and highlighted code
              from one source of truth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Algorithm
            </label>
            <select
              className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold text-primary">
              {activeAlgorithm.complexity}
            </span>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.9fr)]">
          <div className="flex flex-col gap-4">
            <SortCanvas frame={frame} />
            <ControlPanel />
            <ArrayInput />
          </div>
          <CodePanel highlightedCode={highlightedCode} />
        </section>
      </div>
    </main>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { CodePanel } from '@/components/code/CodePanel'
import { SearchCanvas } from '@/components/search/SearchCanvas'
import { Button } from '@/components/ui/button'
import {
  SEARCH_ALGORITHMS,
  type SearchAlgorithmId
} from '@/engine/search'
import { parseArrayInput } from '@/lib/array'
import { speedToDelay } from '@/lib/constants'
import type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

interface SearchViewProps {
  highlightedCodeByAlgo: Record<SearchAlgorithmId, HighlightedCodeSamples>
  initialAlgo: SearchAlgorithmId
  initialArray: number[]
  initialTarget: number
}

export function SearchView({
  highlightedCodeByAlgo,
  initialAlgo,
  initialArray,
  initialTarget
}: SearchViewProps) {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithmId>(initialAlgo)
  const [array, setArray] = useState(initialArray)
  const [arrayInput, setArrayInput] = useState(initialArray.join(', '))
  const [target, setTarget] = useState(initialTarget)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(
    () => Array.from(SEARCH_ALGORITHMS[algorithm].run(array, target)),
    [algorithm, array, target]
  )
  const totalSteps = Math.max(frames.length - 1, 0)
  const frame = frames[Math.min(step, totalSteps)] ?? frames[0]
  const activeAlgorithm = SEARCH_ALGORITHMS[algorithm]
  const targetLabel = algorithm === 'answer' ? 'Days' : 'Target'
  const sortedInputNote =
    algorithm === 'binary' || algorithm === 'bounds'
      ? 'This visualizer displays a sorted copy of the input values.'
      : algorithm === 'rotated'
        ? 'This visualizer displays a rotated sorted copy of the input values.'
        : algorithm === 'answer'
          ? 'This visualizer displays the numeric answer space for package capacity.'
          : null

  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [algorithm, array, target])

  useEffect(() => {
    if (!isPlaying) return

    if (step >= totalSteps) {
      setIsPlaying(false)
      return
    }

    const id = window.setTimeout(
      () => setStep((current) => Math.min(current + 1, totalSteps)),
      speedToDelay(speed)
    )

    return () => window.clearTimeout(id)
  }, [isPlaying, speed, step, totalSteps])

  function applyArray() {
    const parsed = parseArrayInput(arrayInput)
    setArray(parsed)
    setArrayInput(parsed.join(', '))
  }

  function changeAlgorithm(next: SearchAlgorithmId) {
    setAlgorithm(next)
    if (next === 'answer') {
      setTarget(3)
      return
    }
    setTarget(array[0] ?? 0)
  }

  return (
    <main className="responsive-page flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Search Visualizer
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">
            Searching
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Compare direct scanning with range-halving search. Each step shows
            the active search space, eliminated indexes, and the synced code
            line.
          </p>
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-lg p-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Algorithm
          </label>
          <select
            className="h-10 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) => changeAlgorithm(event.target.value as SearchAlgorithmId)}
            value={algorithm}
          >
            {Object.values(SEARCH_ALGORITHMS).map((item) => (
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
          <div className="playback-panel flex flex-col gap-4 rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={() => setIsPlaying((current) => !current)}
                size="icon"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                aria-label="Step back"
                disabled={step === 0}
                onClick={() => {
                  setIsPlaying(false)
                  setStep((current) => Math.max(current - 1, 0))
                }}
                size="icon"
                variant="outline"
              >
                <StepBack className="h-4 w-4" />
              </Button>
              <Button
                aria-label="Step forward"
                disabled={step >= totalSteps}
                onClick={() => {
                  setIsPlaying(false)
                  setStep((current) => Math.min(current + 1, totalSteps))
                }}
                size="icon"
                variant="outline"
              >
                <StepForward className="h-4 w-4" />
              </Button>
              <Button
                aria-label="Reset"
                onClick={() => {
                  setIsPlaying(false)
                  setStep(0)
                }}
                size="icon"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <span className="ml-auto text-sm font-medium text-muted-foreground">
                {step + 1} / {totalSteps + 1}
              </span>
            </div>

            <input
              aria-label="Timeline"
              className="w-full accent-[hsl(var(--primary))]"
              max={totalSteps}
              min={0}
              onChange={(event) => {
                setIsPlaying(false)
                setStep(Number(event.target.value))
              }}
              type="range"
              value={step}
            />

            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Speed
            </label>
            <select
              className="h-10 rounded-md px-3 text-sm outline-none"
              onChange={(event) => setSpeed(Number(event.target.value))}
              value={speed}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {targetLabel}
            </label>
            <input
              className="border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
              onChange={(event) => setTarget(Number(event.target.value))}
              type="number"
              value={target}
            />

            <label className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Array values
            </label>
            <textarea
              className="min-h-24 resize-y rounded-md bg-[hsl(var(--surface-container-highest))]/45 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              onBlur={applyArray}
              onChange={(event) => setArrayInput(event.target.value)}
              value={arrayInput}
            />
            <Button onClick={applyArray} type="button" variant="secondary">
              Apply Values
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <SearchCanvas frame={frame} />
          <div className="glass-panel rounded-lg p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Step Note
            </p>
            <p className="mt-3 text-base font-semibold">{frame.note}</p>
            {sortedInputNote && (
              <p className="mt-3 text-sm text-muted-foreground">
                {sortedInputNote}
              </p>
            )}
          </div>
        </div>

        <CodePanel
          codeLine={frame.codeLine}
          docsHref={`/docs#searching-${algorithm}`}
          highlightedCode={highlightedCodeByAlgo[algorithm].typescript}
          highlightedCodeByLanguage={highlightedCodeByAlgo[algorithm]}
        />
      </section>
    </main>
  )
}

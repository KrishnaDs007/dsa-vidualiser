'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { ArrayStringCanvas } from '@/components/arrays-strings/ArrayStringCanvas'
import { CodePanel } from '@/components/code/CodePanel'
import { Button } from '@/components/ui/button'
import {
  ARRAY_STRING_ALGORITHMS,
  type ArrayStringAlgorithmId
} from '@/engine/arraysStrings'
import type { ArrayStringStep } from '@/engine/types'
import { parseArrayInput } from '@/lib/array'
import { speedToDelay } from '@/lib/constants'
import type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

interface ArraysStringsViewProps {
  highlightedCodeByAlgo: Record<ArrayStringAlgorithmId, HighlightedCodeSamples>
  initialAlgo: ArrayStringAlgorithmId
  initialValues: number[]
  initialTarget: number
}

export function ArraysStringsView({
  highlightedCodeByAlgo,
  initialAlgo,
  initialValues,
  initialTarget
}: ArraysStringsViewProps) {
  const [algorithm, setAlgorithm] = useState<ArrayStringAlgorithmId>(initialAlgo)
  const [values, setValues] = useState(initialValues)
  const [valueInput, setValueInput] = useState(initialValues.join(', '))
  const [target, setTarget] = useState(initialTarget)
  const [rangeStart, setRangeStart] = useState(1)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(
    () =>
      Array.from(
        (
          ARRAY_STRING_ALGORITHMS[algorithm].run as (
            values: number[],
            target: number,
            rangeStart?: number
          ) => Generator<ArrayStringStep>
        )(values, target, rangeStart)
      ),
    [algorithm, rangeStart, target, values]
  )
  const totalSteps = Math.max(frames.length - 1, 0)
  const frame = frames[Math.min(step, totalSteps)] ?? frames[0]
  const activeAlgorithm = ARRAY_STRING_ALGORITHMS[algorithm]
  const helperLabel =
    algorithm === 'slidingWindow'
      ? 'Window size'
      : algorithm === 'prefixSum'
        ? 'Query start'
        : algorithm === 'matrixTraversal'
          ? 'Cells to use'
          : algorithm === 'kadane'
            ? 'Best sum'
            : 'Target'
  const heading =
    algorithm === 'slidingWindow'
      ? 'Sliding Window'
      : algorithm === 'prefixSum'
        ? 'Prefix Sum'
        : algorithm === 'kadane'
          ? 'Kadane Algorithm'
          : algorithm === 'matrixTraversal'
            ? 'Matrix Traversal'
            : 'Two Pointers'
  const description =
    algorithm === 'slidingWindow'
      ? 'Slide a fixed-size window across the array while updating the running sum in constant time.'
      : algorithm === 'prefixSum'
        ? 'Build a prefix array once, then answer a selected range sum by subtracting two prefix totals.'
        : algorithm === 'kadane'
          ? 'Track the best subarray ending at each index and keep the maximum subarray seen so far.'
          : algorithm === 'matrixTraversal'
            ? 'Walk a matrix row by row, visiting every cell exactly once while maintaining a running total.'
            : 'Move left and right pointers inward on a sorted array to find a pair sum with linear time and constant auxiliary space.'

  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [algorithm, target, values])

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

  function applyValues() {
    const parsed = parseArrayInput(valueInput).slice(0, 14)
    setValues(parsed)
    setValueInput(parsed.join(', '))
  }

  function changeAlgorithm(next: ArrayStringAlgorithmId) {
    setAlgorithm(next)
    if (next === 'slidingWindow') {
      setTarget(3)
      return
    }
    if (next === 'prefixSum') {
      setRangeStart(1)
      setTarget(Math.min(4, Math.max(values.length - 1, 0)))
      return
    }
    if (next === 'kadane') {
      setTarget(0)
      return
    }
    if (next === 'matrixTraversal') {
      setTarget(9)
      return
    }
    setTarget(10)
  }

  return (
    <main className="responsive-page flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Arrays And Strings
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">{heading}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            {description}
          </p>
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-lg p-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Pattern
          </label>
          <select
            className="h-10 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) =>
              changeAlgorithm(event.target.value as ArrayStringAlgorithmId)
            }
            value={algorithm}
          >
            {Object.values(ARRAY_STRING_ALGORITHMS).map((item) => (
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
              Values
            </label>
            <textarea
              className="min-h-24 resize-y rounded-md bg-[hsl(var(--surface-container-highest))]/45 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              onBlur={applyValues}
              onChange={(event) => setValueInput(event.target.value)}
              value={valueInput}
            />
            <label className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {helperLabel}
            </label>
            {algorithm === 'prefixSum' && (
              <>
                <input
                  className="border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
                  max={Math.max(values.length - 1, 0)}
                  min={0}
                  onChange={(event) => setRangeStart(Number(event.target.value))}
                  type="number"
                  value={rangeStart}
                />
                <label className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Query end
                </label>
              </>
            )}
            {algorithm === 'kadane' || algorithm === 'matrixTraversal' ? (
              <p className="rounded-md bg-[hsl(var(--surface-container-highest))]/45 px-3 py-2 text-sm font-semibold text-foreground/75">
                {algorithm === 'kadane'
                  ? 'Calculated while stepping through the array.'
                  : 'Uses the first 9 values as a 3 x 3 matrix.'}
              </p>
            ) : (
              <input
                className="border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
                max={algorithm === 'prefixSum' ? Math.max(values.length - 1, 0) : undefined}
                min={algorithm === 'prefixSum' ? 0 : undefined}
                onChange={(event) => setTarget(Number(event.target.value))}
                type="number"
                value={target}
              />
            )}
            <Button onClick={applyValues} type="button" variant="secondary">
              Apply Values
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <ArrayStringCanvas frame={frame} />
          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="Time" value={frame.timeComplexity} />
            <Metric label="Space" value={frame.spaceComplexity} />
          </div>
          <div className="glass-panel rounded-lg p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Step Note
            </p>
            <p className="mt-3 text-base font-semibold">{frame.note}</p>
          </div>
        </div>

        <CodePanel
          codeLine={frame.codeLine}
          docsHref={`/docs#arrays-strings-${algorithm}`}
          highlightedCode={highlightedCodeByAlgo[algorithm].typescript}
          highlightedCodeByLanguage={highlightedCodeByAlgo[algorithm]}
        />
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-primary">{value}</p>
    </div>
  )
}

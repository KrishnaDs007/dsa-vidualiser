'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { CodePanel } from '@/components/code/CodePanel'
import { StackCanvas } from '@/components/stacks/StackCanvas'
import { Button } from '@/components/ui/button'
import {
  STACK_ALGORITHMS,
  type StackAlgorithmId
} from '@/engine/stacks'
import { parseArrayInput } from '@/lib/array'
import { speedToDelay } from '@/lib/constants'
import type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

interface StacksViewProps {
  highlightedCodeByAlgo: Record<StackAlgorithmId, HighlightedCodeSamples>
  initialAlgo: StackAlgorithmId
  initialValues: number[]
}

export function StacksView({
  highlightedCodeByAlgo,
  initialAlgo,
  initialValues
}: StacksViewProps) {
  const [algorithm, setAlgorithm] = useState<StackAlgorithmId>(initialAlgo)
  const [values, setValues] = useState(initialValues)
  const [valueInput, setValueInput] = useState(initialValues.join(', '))
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(
    () => Array.from(STACK_ALGORITHMS[algorithm].run(values)),
    [algorithm, values]
  )
  const totalSteps = Math.max(frames.length - 1, 0)
  const frame = frames[Math.min(step, totalSteps)] ?? frames[0]
  const activeAlgorithm = STACK_ALGORITHMS[algorithm]

  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [algorithm, values])

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
    const parsed = parseArrayInput(valueInput).slice(0, 10)
    setValues(parsed)
    setValueInput(parsed.join(', '))
  }

  return (
    <main className="responsive-page flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Stacks And Queues
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">
            Stack Operations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Visualize LIFO behavior with push, pop, and peek operations before
            moving into parentheses parsing and monotonic stack patterns.
          </p>
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-lg p-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Operation
          </label>
          <select
            className="h-10 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) => setAlgorithm(event.target.value as StackAlgorithmId)}
            value={algorithm}
          >
            {Object.values(STACK_ALGORITHMS).map((item) => (
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
          <div className="flex flex-col gap-4 rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
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
            <Button onClick={applyValues} type="button" variant="secondary">
              Apply Values
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <StackCanvas frame={frame} />
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
          docsHref={`/docs#stacks-${algorithm}`}
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

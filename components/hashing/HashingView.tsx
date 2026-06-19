'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { CodePanel } from '@/components/code/CodePanel'
import { HashCanvas } from '@/components/hashing/HashCanvas'
import { Button } from '@/components/ui/button'
import {
  HASH_ALGORITHMS,
  type HashAlgorithmId
} from '@/engine/hashing'
import { speedToDelay } from '@/lib/constants'
import type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

type HashValue = number | string

interface HashingViewProps {
  highlightedCodeByAlgo: Record<HashAlgorithmId, HighlightedCodeSamples>
  initialAlgo: HashAlgorithmId
  initialKeys: number[]
  initialTarget: number
}

export function HashingView({
  highlightedCodeByAlgo,
  initialAlgo,
  initialKeys,
  initialTarget
}: HashingViewProps) {
  const [algorithm, setAlgorithm] = useState<HashAlgorithmId>(initialAlgo)
  const [keys, setKeys] = useState<HashValue[]>(initialKeys)
  const [keyInput, setKeyInput] = useState(initialKeys.join(', '))
  const [target, setTarget] = useState<HashValue>(initialTarget)
  const [bucketCount, setBucketCount] = useState(7)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(
    () => Array.from(HASH_ALGORITHMS[algorithm].run(keys, target, bucketCount)),
    [algorithm, bucketCount, keys, target]
  )
  const totalSteps = Math.max(frames.length - 1, 0)
  const frame = frames[Math.min(step, totalSteps)] ?? frames[0]
  const activeAlgorithm = HASH_ALGORITHMS[algorithm]
  const targetLabel =
    algorithm === 'groupAnagrams'
      ? 'Sample word'
      : algorithm === 'subarraySum'
        ? 'Target sum K'
        : algorithm === 'longestConsecutive' || algorithm === 'frequency'
          ? 'Reference value'
          : 'Search target'

  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [algorithm, bucketCount, keys, target])

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

  function applyKeys() {
    const parsed = parseHashInput(keyInput, algorithm).slice(0, 18)
    setKeys(parsed)
    setKeyInput(parsed.join(', '))
  }

  function changeAlgorithm(next: HashAlgorithmId) {
    setAlgorithm(next)
    if (next === 'groupAnagrams') {
      const words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
      setKeys(words)
      setKeyInput(words.join(', '))
      setTarget('eat')
      return
    }
    const numericSample = [18, 25, 32, 7, 14, 21]
    setKeys(numericSample)
    setKeyInput(numericSample.join(', '))
    setTarget(next === 'subarraySum' ? 39 : next === 'twoSum' ? 39 : numericSample[0])
  }

  return (
    <main className="responsive-page flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Hashing Visualizer
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">
            Hash Tables
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Watch keys map into buckets with modulo hashing, collisions, chain
            traversal, and live average versus worst-case complexity.
          </p>
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 rounded-lg p-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Algorithm
          </label>
          <select
            className="h-10 rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) => changeAlgorithm(event.target.value as HashAlgorithmId)}
            value={algorithm}
          >
            {Object.values(HASH_ALGORITHMS).map((item) => (
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
              Keys
            </label>
            <textarea
              className="min-h-24 resize-y rounded-md bg-[hsl(var(--surface-container-highest))]/45 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              onBlur={applyKeys}
              onChange={(event) => setKeyInput(event.target.value)}
              value={keyInput}
            />

            <label className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {targetLabel}
            </label>
            <input
              className="border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
              onChange={(event) =>
                setTarget(
                  algorithm === 'groupAnagrams'
                    ? event.target.value
                    : Number(event.target.value)
                )
              }
              type={algorithm === 'groupAnagrams' ? 'text' : 'number'}
              value={target}
            />

            <label className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Buckets
            </label>
            <input
              className="border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
              max={12}
              min={3}
              onChange={(event) => setBucketCount(Number(event.target.value))}
              type="number"
              value={bucketCount}
            />
            <Button onClick={applyKeys} type="button" variant="secondary">
              Apply Keys
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <HashCanvas frame={frame} />
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
          docsHref={`/docs#hashing-${algorithm}`}
          highlightedCode={highlightedCodeByAlgo[algorithm].typescript}
          highlightedCodeByLanguage={highlightedCodeByAlgo[algorithm]}
        />
      </section>
    </main>
  )
}

function parseHashInput(input: string, algorithm: HashAlgorithmId): HashValue[] {
  const tokens = input
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)

  if (algorithm === 'groupAnagrams') return tokens

  const numbers = tokens
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  return numbers.length > 0 ? numbers : [18, 25, 32, 7, 14, 21]
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

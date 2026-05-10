'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Cpu, HardDrive, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

const sampleCode = `function twoSum(nums, target) {
  const seen = new Map()

  for (let i = 0; i < nums.length; i++) {
    const pair = target - nums[i]
    if (seen.has(pair)) return [seen.get(pair), i]
    seen.set(nums[i], i)
  }

  return []
}`

export default function CustomVisualizerPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const setFlash = useAuthStore((state) => state.setFlash)
  const saveAnalysis = useAuthStore((state) => state.saveAnalysis)
  const [title, setTitle] = useState('Custom Complexity Read')
  const [code, setCode] = useState(sampleCode)

  const result = useMemo(() => analyzeComplexity(code), [code])

  useEffect(() => {
    if (!hydrated || user) return

    setFlash('Please sign in before opening the custom code visualizer.')
    router.push('/login?next=/custom-visualizer')
  }, [hydrated, router, setFlash, user])

  if (!user) return null

  return (
    <main className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Custom Code Visualizer
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Complexity Blueprint
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Paste code to visualize only its estimated time and space complexity.
            The analysis focuses on loops, nesting, recursion, and memory-shaped
            declarations.
          </p>
        </div>
        <Button
          onClick={() =>
            saveAnalysis({
              title,
              timeComplexity: result.time,
              spaceComplexity: result.space
            })
          }
        >
          Save <Save className="h-4 w-4" />
        </Button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div className="bg-[hsl(var(--surface-container-low))] p-6">
          <label className="block text-xs font-bold uppercase tracking-[0.18em]">
            Visualizer Name
          </label>
          <input
            className="mt-3 w-full border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-3 text-base outline-none focus:border-primary"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />

          <label className="mt-8 block text-xs font-bold uppercase tracking-[0.18em]">
            Code
          </label>
          <textarea
            className="mt-3 min-h-[520px] w-full resize-y rounded-md bg-[hsl(var(--surface-container-lowest))] p-5 font-mono text-sm leading-7 outline-none focus:ring-2 focus:ring-primary/25"
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            value={code}
          />
        </div>

        <aside className="flex flex-col gap-5">
          <Metric
            description={result.timeReason}
            icon={Cpu}
            label="Time Complexity"
            value={result.time}
          />
          <Metric
            description={result.spaceReason}
            icon={HardDrive}
            label="Space Complexity"
            value={result.space}
          />
          <div className="bg-[hsl(var(--surface-container-low))] p-6">
            <h2 className="text-xl font-black">Signals Detected</h2>
            <ul className="mt-5 space-y-3 text-sm text-foreground/75">
              {result.signals.map((signal) => (
                <li className="bg-white px-4 py-3" key={signal}>
                  {signal}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant="secondary">
              <Link href="/dashboard">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Metric({
  label,
  value,
  description,
  icon: Icon
}: {
  label: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <article className="bg-[hsl(var(--surface-container-low))] p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-[hsl(var(--surface-container-highest))] text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <span className="font-mono text-3xl font-black text-primary">{value}</span>
      </div>
      <h2 className="mt-7 text-sm font-bold uppercase tracking-[0.18em]">
        {label}
      </h2>
      <p className="mt-3 text-sm leading-6 text-foreground/72">{description}</p>
    </article>
  )
}

function analyzeComplexity(code: string) {
  const normalized = code.toLowerCase()
  const loopCount = (normalized.match(/\b(for|while|foreach|map|filter|reduce)\b/g) ?? [])
    .length
  const recursiveName = normalized.match(/function\s+([a-z0-9_]+)/)?.[1]
  const recursiveCalls = recursiveName
    ? (normalized.match(new RegExp(`\\b${recursiveName}\\s*\\(`, 'g')) ?? []).length - 1
    : 0
  const divideSignal = /\/\s*2|>>\s*1|mid|binary/.test(normalized)
  const collectionSignal = /\b(new map|new set|\[\]|{}|push\(|set\(|object|array)\b/.test(
    normalized
  )
  const matrixSignal = /\bmatrix|grid|rows|cols\b/.test(normalized)

  let time = 'O(1)'
  let timeReason = 'No clear loop or recursion signal was detected.'

  if (recursiveCalls > 1 && divideSignal) {
    time = 'O(n log n)'
    timeReason = 'Recursive branching plus divide-style signals suggest logarithmic layers over linear work.'
  } else if (recursiveCalls > 0 && divideSignal) {
    time = 'O(log n)'
    timeReason = 'A recursive divide signal suggests logarithmic progression.'
  } else if (loopCount >= 2) {
    time = 'O(n²)'
    timeReason = 'Multiple iteration signals suggest nested or repeated linear scans.'
  } else if (loopCount === 1) {
    time = 'O(n)'
    timeReason = 'One primary iteration signal suggests linear traversal.'
  } else if (recursiveCalls > 0) {
    time = 'O(n)'
    timeReason = 'Recursion without a divide signal is treated as linear by default.'
  }

  let space = 'O(1)'
  let spaceReason = 'No growing collection or recursion stack signal was detected.'

  if (matrixSignal) {
    space = 'O(n²)'
    spaceReason = 'Matrix or grid-shaped terms suggest two-dimensional storage.'
  } else if (collectionSignal) {
    space = 'O(n)'
    spaceReason = 'Growing collection signals suggest linear auxiliary storage.'
  } else if (recursiveCalls > 0) {
    space = divideSignal ? 'O(log n)' : 'O(n)'
    spaceReason = 'Recursive calls add stack usage even without explicit collections.'
  }

  return {
    time,
    space,
    timeReason,
    spaceReason,
    signals: [
      `${loopCount} loop or iterator signal${loopCount === 1 ? '' : 's'}`,
      `${Math.max(recursiveCalls, 0)} recursive call signal${recursiveCalls === 1 ? '' : 's'}`,
      divideSignal ? 'Divide-and-conquer signal present' : 'No divide signal',
      collectionSignal ? 'Auxiliary collection signal present' : 'No growing collection signal'
    ]
  }
}

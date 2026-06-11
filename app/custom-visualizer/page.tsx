'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type React from 'react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Cpu, HardDrive, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CUSTOM_CODE_LANGUAGES,
  analyzeComplexity,
  getLanguageSample,
  isCustomCodeLanguageId,
  type CustomCodeLanguageId
} from '@/lib/customCode'
import { useAuthStore } from '@/store/authStore'

export default function CustomVisualizerPage() {
  return (
    <Suspense>
      <CustomVisualizerForm />
    </Suspense>
  )
}

function CustomVisualizerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const analyses = useAuthStore((state) => state.analyses)
  const setFlash = useAuthStore((state) => state.setFlash)
  const saveAnalysis = useAuthStore((state) => state.saveAnalysis)
  const updateAnalysis = useAuthStore((state) => state.updateAnalysis)
  const [title, setTitle] = useState('Custom Complexity Read')
  const [language, setLanguage] = useState<CustomCodeLanguageId>('javascript')
  const [code, setCode] = useState(getLanguageSample('javascript'))

  const result = useMemo(() => analyzeComplexity(code, language), [code, language])
  const editingAnalysis = editId
    ? analyses.find((analysis) => analysis.id === editId)
    : undefined

  useEffect(() => {
    if (!hydrated || user) return

    setFlash('Please sign in before opening the custom code visualizer.')
    router.push('/login?next=/custom-visualizer')
  }, [hydrated, router, setFlash, user])

  useEffect(() => {
    if (!editId || !hydrated || !user) return

    if (!editingAnalysis) {
      setFlash('That saved custom visualizer could not be found.')
      router.push('/dashboard')
      return
    }

    setTitle(editingAnalysis.title)
    if (isCustomCodeLanguageId(editingAnalysis.language)) {
      setLanguage(editingAnalysis.language)
    }
    setCode(editingAnalysis.code ?? getLanguageSample('javascript'))
  }, [editId, editingAnalysis, hydrated, router, setFlash, user])

  if (!user) return null

  function persistAnalysis() {
    const payload = {
      title,
      language,
      code,
      timeComplexity: result.time,
      spaceComplexity: result.space
    }

    if (editId && editingAnalysis) {
      updateAnalysis(editId, payload)
      return
    }

    saveAnalysis(payload)
  }

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
            Paste code to estimate time and space complexity across the
            supported language set. Step tracing comes next on top of this
            saved source model.
          </p>
        </div>
        <Button onClick={persistAnalysis}>
          {editId ? 'Update' : 'Save'} <Save className="h-4 w-4" />
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

          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em]">
                Language
              </label>
              <select
                className="mt-3 h-11 w-full rounded-md bg-[hsl(var(--surface-container-lowest))] px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/25"
                onChange={(event) =>
                  setLanguage(event.target.value as CustomCodeLanguageId)
                }
                value={language}
              >
                {CUSTOM_CODE_LANGUAGES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => setCode(getLanguageSample(language))}
              type="button"
              variant="secondary"
            >
              Load Sample
            </Button>
          </div>

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

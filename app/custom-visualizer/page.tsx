'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type React from 'react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Cpu,
  HardDrive,
  RotateCcw,
  Save,
  Sparkles,
  StepBack,
  StepForward,
  TerminalSquare
} from 'lucide-react'
import { ComplexityBreakdown } from '@/components/custom-code/ComplexityBreakdown'
import { CustomCodeEditor } from '@/components/custom-code/CustomCodeEditor'
import { Button } from '@/components/ui/button'
import {
  CUSTOM_CODE_LANGUAGES,
  CUSTOM_CODE_TEMPLATES,
  analyzeComplexity,
  createCustomCodeTrace,
  getCustomCodeTemplate,
  getLanguageSample,
  isCustomCodeLanguageId,
  type CustomCodeLanguageId,
  type CustomCodeTemplateId
} from '@/lib/customCode'
import { useAuthStore } from '@/store/authStore'

const CUSTOM_DRAFT_KEY = 'algo-precision-custom-draft'

// Backend auth is intentionally disabled for now. Flip this to true when
// backend-backed sign-in and dashboard sync are ready.
const AUTH_ENTRYPOINTS_ENABLED = false

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
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [templateId, setTemplateId] = useState<CustomCodeTemplateId>('two-sum')
  const [traceIndex, setTraceIndex] = useState(0)

  const finalResult = useMemo(() => analyzeComplexity(code, language), [code, language])
  const traceSteps = useMemo(
    () => createCustomCodeTrace(code, language),
    [code, language]
  )
  const activeTrace = traceSteps[Math.min(traceIndex, traceSteps.length - 1)]
  const result = activeTrace?.result ?? finalResult
  const editingAnalysis = editId
    ? analyses.find((analysis) => analysis.id === editId)
    : undefined

  useEffect(() => {
    setTraceIndex(0)
  }, [code, language])

  useEffect(() => {
    if (!editId || !hydrated) return

    if (!user) {
      setFlash('Editing saved custom visualizers will be available after backend auth is connected.')
      router.replace('/custom-visualizer')
      // Re-enable this redirect when backend auth is connected:
      // router.push(
      //   `/login?next=${encodeURIComponent(`/custom-visualizer?id=${editId}`)}`
      // )
      return
    }

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

  useEffect(() => {
    if (!hydrated || editId || typeof window === 'undefined') return

    try {
      const draft = JSON.parse(
        window.localStorage.getItem(CUSTOM_DRAFT_KEY) ?? 'null'
      ) as {
        title?: string
        language?: string
        code?: string
      } | null

      if (!draft) return

      if (draft.title) setTitle(draft.title)
      if (isCustomCodeLanguageId(draft.language)) setLanguage(draft.language)
      if (typeof draft.code === 'string') setCode(draft.code)
    } catch {
      window.localStorage.removeItem(CUSTOM_DRAFT_KEY)
    } finally {
      setDraftLoaded(true)
    }
  }, [editId, hydrated])

  useEffect(() => {
    if (!hydrated || !draftLoaded || editId || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      CUSTOM_DRAFT_KEY,
      JSON.stringify({ title, language, code })
    )
  }, [code, draftLoaded, editId, hydrated, language, title])

  function persistAnalysis() {
    if (!user) {
      setFlash('Saving custom visualizers will be available after backend auth is connected.')
      // Re-enable this redirect when backend auth is connected:
      // router.push('/login?next=/custom-visualizer')
      return
    }

    const payload = {
      title,
      language,
      code,
      timeComplexity: finalResult.time,
      spaceComplexity: finalResult.space
    }

    if (editId && editingAnalysis) {
      updateAnalysis(editId, payload)
      return
    }

    saveAnalysis(payload)
  }

  function loadTemplate(id: CustomCodeTemplateId) {
    const template = getCustomCodeTemplate(id)
    if (!template) return

    setTemplateId(id)
    setTitle(template.title)
    setLanguage(template.language)
    setCode(template.code)
  }

  return (
    <main className="responsive-page">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Custom Code Visualizer
          </p>
          <h1 className="mt-4 responsive-heading font-black tracking-tight">
            Complexity Blueprint
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            Paste code to estimate time and space complexity across the
            supported language set. Step tracing comes next on top of this
            saved source model.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {AUTH_ENTRYPOINTS_ENABLED && !user && (
            <Button asChild variant="secondary">
              <Link href="/login?next=/custom-visualizer">
                Sign in to save <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button onClick={persistAnalysis}>
            {editId ? 'Update' : 'Save'} <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)] 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,440px)]">
        <div className="flex flex-col gap-5">
          {!user && (
            <div className="glass-panel rounded-lg p-4 text-sm text-foreground/75">
              <div className="flex items-start gap-3">
                <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 text-primary" />
                <p>
                  You can write and analyze code now. Saving to a profile will
                  be enabled after backend auth is connected.
                </p>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-lg p-5">
            <label className="block text-xs font-bold uppercase tracking-[0.18em]">
              Visualizer Name
            </label>
            <input
              className="mt-3 w-full border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-3 text-base outline-none focus:border-primary"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.18em]">
                  Code Template
                </label>
                <select
                  className="mt-3 h-11 w-full rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/25"
                  onChange={(event) =>
                    loadTemplate(event.target.value as CustomCodeTemplateId)
                  }
                  value={templateId}
                >
                  {CUSTOM_CODE_TEMPLATES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.18em]">
                  Language
                </label>
                <select
                  className="mt-3 h-11 w-full rounded-md px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/25"
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
          </div>

          <CustomCodeEditor
            activeLine={activeTrace?.lineNumber}
            code={code}
            complexitySummary={
              <div className="flex flex-wrap items-center gap-2 rounded-md bg-[hsl(var(--glass))] px-3 py-2 text-xs font-bold">
                <span className="text-primary">Time {result.time}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-primary">Space {result.space}</span>
              </div>
            }
            headerActions={
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  aria-label="Previous code step"
                  disabled={traceIndex === 0}
                  onClick={() => setTraceIndex((current) => Math.max(current - 1, 0))}
                  size="icon"
                  variant="outline"
                >
                  <StepBack className="h-4 w-4" />
                </Button>
                <Button
                  disabled={traceIndex >= traceSteps.length - 1}
                  onClick={() =>
                    setTraceIndex((current) =>
                      Math.min(current + 1, traceSteps.length - 1)
                    )
                  }
                  size="sm"
                  variant="secondary"
                >
                  Run Step <StepForward className="h-4 w-4" />
                </Button>
                <Button
                  aria-label="Reset code trace"
                  onClick={() => setTraceIndex(0)}
                  size="icon"
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            }
            language={language}
            onChange={setCode}
          />
        </div>

        <aside className="flex flex-col gap-5">
          <div className="glass-panel-strong rounded-lg p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[hsl(var(--primary)/0.12)] text-primary">
                <TerminalSquare aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Live Complexity</h2>
                <p className="text-sm text-muted-foreground">
                  Step {traceIndex + 1} of {traceSteps.length}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="mt-4 rounded-md border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Line {activeTrace?.lineNumber ?? 1}
              </p>
              <code className="mt-2 block whitespace-pre-wrap break-words font-mono text-sm">
                {activeTrace?.line || 'No code yet'}
              </code>
              <p className="mt-3 text-sm leading-6 text-foreground/72">
                {activeTrace?.note}
              </p>
            </div>
          </div>
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
          <ComplexityBreakdown
            confidence={result.confidence}
            factors={result.factors}
            space={result.space}
            time={result.time}
          />
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-xl font-black">Signals Detected</h2>
            <ul className="mt-5 space-y-3 text-sm text-foreground/75">
              {result.signals.map((signal) => (
                <li
                  className="rounded-md border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] px-4 py-3"
                  key={signal}
                >
                  {signal}
                </li>
              ))}
            </ul>
            {user ? (
              <Button asChild className="mt-6 w-full" variant="secondary">
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : AUTH_ENTRYPOINTS_ENABLED ? (
              <Button asChild className="mt-6 w-full" variant="secondary">
                <Link href="/login?next=/custom-visualizer">
                  Sign in to save <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
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
    <article className="glass-panel rounded-lg p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-[hsl(var(--primary)/0.12)] text-primary">
          <Icon aria-hidden="true" className="h-6 w-6" />
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

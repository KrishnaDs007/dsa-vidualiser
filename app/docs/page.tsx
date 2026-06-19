import { DocsBrowser } from '@/components/docs/DocsBrowser'
import { DSA_CATALOG, SUPPORTED_LANGUAGES } from '@/lib/dsaCatalog'
import { VISUALIZER_DOCS } from '@/lib/visualizerDocs'

export default function DocsPage() {
  const readyCount = DSA_CATALOG.flatMap((category) => category.topics).filter(
    (topic) => topic.status === 'ready'
  ).length
  const topicCount = DSA_CATALOG.reduce(
    (total, category) => total + category.topics.length,
    0
  )

  return (
    <main className="responsive-page">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
        Documentation
      </p>
      <h1 className="mt-4 responsive-heading font-black tracking-tight">
        Algorithm Roadmap
      </h1>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <p className="max-w-3xl text-base leading-7 text-foreground/75">
          This standalone workbench will grow from deterministic DSA visualizers
          into custom code visualization with step-by-step state, time
          complexity, and space complexity updates. Backend sync is intentionally
          deferred until the local profile and visualizer model are stable.
        </p>
        <aside className="bg-[hsl(var(--surface-container-low))] p-5">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Coverage
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Topics" value={topicCount} />
            <Metric label="Ready" value={readyCount} />
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-black tracking-tight">
          Supported Languages
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {SUPPORTED_LANGUAGES.map((language) => (
            <span
              className="rounded-md bg-[hsl(var(--surface-container-highest))] px-4 py-2 text-sm font-semibold"
              key={language}
            >
              {language}
            </span>
          ))}
        </div>
      </section>

      <DocsBrowser docs={VISUALIZER_DOCS} />

      <section className="mt-10 responsive-grid">
        {DSA_CATALOG.map((category) => (
          <article
            className="bg-[hsl(var(--surface-container-low))] p-6"
            key={category.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  {category.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-foreground/72">
                  {category.description}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-white px-3 py-1 font-mono text-xs font-bold text-primary">
                {category.topics.length} topics
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {category.topics.map((topic) => (
                <div
                  className="rounded-md bg-white px-4 py-3"
                  key={`${category.id}-${topic.name}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold">{topic.name}</h3>
                    <span
                      className={
                        topic.status === 'ready'
                          ? 'rounded-sm bg-emerald-200 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-900'
                          : 'rounded-sm bg-[hsl(var(--surface-container-highest))] px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground'
                      }
                    >
                      {topic.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {topic.patterns.join(' / ')}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4">
      <p className="font-mono text-3xl font-black text-primary">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

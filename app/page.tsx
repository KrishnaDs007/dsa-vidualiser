import Link from 'next/link'
import { ArrowRight, Columns3, GitMerge, SquareStack, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const algorithms = [
  {
    title: 'Quicksort',
    description:
      "A highly efficient, divide-and-conquer sorting algorithm that picks an element as 'pivot' and partitions the array around it.",
    label: 'Divide & Conquer',
    time: 'O(n log n)',
    memory: 'O(log n)',
    icon: Zap,
    href: '/sorting?algo=bubble'
  },
  {
    title: 'Mergesort',
    description:
      'A stable, comparison-based sorting algorithm. It divides the input array into two halves, calls itself for the halves, and then merges them.',
    label: 'Stable Sort',
    time: 'O(n log n)',
    memory: 'O(n)',
    icon: GitMerge,
    href: '/sorting?algo=insertion'
  },
  {
    title: 'Heapsort',
    description:
      'Comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we find the maximum element.',
    label: 'Selection Based',
    time: 'O(n log n)',
    memory: 'In-Place',
    icon: SquareStack,
    href: '/sorting'
  },
  {
    title: 'Insertion Sort',
    description:
      'Efficient for small data sets and nearly sorted arrays. Builds the final sorted array one item at a time.',
    label: 'Online Sort',
    time: 'O(n²)',
    memory: 'O(n) Best Case',
    icon: Columns3,
    href: '/sorting?algo=insertion'
  }
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl">
      <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Sorting Algorithms
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-foreground/78">
            Explore the mechanics of data organization. Compare performance
            benchmarks and visualize time complexity through a high-precision
            triptych layout.
          </p>
        </div>
        <div className="flex gap-3">
          <Button aria-label="Filter algorithms" size="icon" variant="secondary">
            <Columns3 className="h-5 w-5 rotate-90" />
          </Button>
          <Button aria-label="Grid view" size="icon" variant="secondary">
            <SquareStack className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <section className="grid gap-7 xl:grid-cols-3">
        {algorithms.slice(0, 3).map((algorithm) => (
          <AlgorithmCard algorithm={algorithm} key={algorithm.title} />
        ))}

        <article className="bg-[hsl(var(--surface-container-low))] p-8 xl:col-span-2">
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(280px,1fr)] md:items-center">
            <div>
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="rounded-md bg-primary px-4 py-1 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
                  Legacy Favorite
                </span>
                <span className="rounded-sm bg-red-100 px-3 py-1 font-mono text-xs text-red-700">
                  O(n²)
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight">Bubble Sort</h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-foreground/78">
                Though inefficient for large datasets, Bubble Sort&apos;s simplicity
                makes it a foundational pedagogical tool for understanding swaps
                and iterative passes.
              </p>
              <Button asChild className="mt-8">
                <Link href="/sorting?algo=bubble">
                  Visualize Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="dot-grid grid min-h-60 place-items-center rounded-md bg-[hsl(var(--surface-container-highest))]/35">
              <div className="flex h-40 items-center gap-3">
                {[70, 48, 92, 55, 78].map((height, index) => (
                  <span
                    className="w-5 rounded-md bg-primary/55 even:bg-primary"
                    key={height}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <AlgorithmCard algorithm={algorithms[3]} />
      </section>
    </main>
  )
}

function AlgorithmCard({
  algorithm
}: {
  algorithm: (typeof algorithms)[number]
}) {
  const Icon = algorithm.icon

  return (
    <Link
      className="group flex min-h-[400px] flex-col bg-[hsl(var(--surface-container-low))] p-8 transition hover:bg-[hsl(var(--surface-container-lowest))]"
      href={algorithm.href}
    >
      <div className="mb-9 flex items-start justify-between gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-md bg-[hsl(var(--surface-container-highest))] text-primary">
          <Icon className="h-7 w-7" />
        </span>
        <div className="flex flex-col items-end gap-2 font-mono text-xs">
          <span className="rounded-sm bg-emerald-200 px-3 py-1 text-emerald-900">
            {algorithm.time}
          </span>
          <span className="rounded-sm bg-violet-100 px-3 py-1 text-primary">
            {algorithm.memory}
          </span>
        </div>
      </div>
      <h2 className="text-2xl font-black tracking-tight">{algorithm.title}</h2>
      <p className="mt-5 flex-1 text-base leading-7 text-foreground/78">
        {algorithm.description}
      </p>
      <div className="mt-8 flex items-center justify-between pt-7">
        <span className="font-mono text-xs uppercase tracking-[0.22em]">
          {algorithm.label}
        </span>
        <ArrowRight className="h-6 w-6 text-primary transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

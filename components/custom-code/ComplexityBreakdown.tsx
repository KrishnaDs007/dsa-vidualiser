import { Cpu, HardDrive } from 'lucide-react'
import type { ComplexityFactor } from '@/lib/customCode'

interface ComplexityBreakdownProps {
  confidence: number
  factors: ComplexityFactor[]
  space: string
  time: string
}

const levelWidth = {
  low: '34%',
  medium: '66%',
  high: '100%'
}

const levelTone = {
  low: 'bg-[hsl(var(--muted-foreground)/0.28)]',
  medium: 'bg-[hsl(var(--accent))]',
  high: 'bg-[hsl(var(--primary))]'
}

export function ComplexityBreakdown({
  confidence,
  factors,
  space,
  time
}: ComplexityBreakdownProps) {
  return (
    <section className="glass-panel rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Complexity Map
          </p>
          <h2 className="mt-3 text-xl font-black">Signal Breakdown</h2>
        </div>
        <div className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 text-right">
          <p className="font-mono text-lg font-black text-primary">{confidence}%</p>
          <p className="text-xs font-semibold text-muted-foreground">confidence</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryPill icon={Cpu} label="Time" value={time} />
        <SummaryPill icon={HardDrive} label="Space" value={space} />
      </div>

      <div className="mt-6 space-y-4">
        {factors.map((factor) => (
          <article
            className="rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4"
            key={factor.label}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black">{factor.label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {factor.description}
                </p>
              </div>
              <span className="rounded-md bg-[hsl(var(--foreground)/0.06)] px-2.5 py-1 font-mono text-xs font-bold">
                {factor.value}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[hsl(var(--foreground)/0.08)]">
              <div
                aria-hidden="true"
                className={`h-full rounded-full ${levelTone[factor.level]}`}
                style={{ width: levelWidth[factor.level] }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SummaryPill({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Cpu
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-3">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-[hsl(var(--primary)/0.12)] text-primary">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="font-mono text-lg font-black text-primary">{value}</p>
      </div>
    </div>
  )
}

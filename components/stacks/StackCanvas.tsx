'use client'

import { motion } from 'framer-motion'
import type { StackItem, StackStep } from '@/engine/types'

interface StackCanvasProps {
  frame: StackStep
}

export function StackCanvas({ frame }: StackCanvasProps) {
  const reversed = [...frame.items].reverse()

  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[360px] rounded-lg p-4 sm:min-h-[520px] sm:p-5 2xl:min-h-[620px]">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 font-mono text-sm font-bold text-primary">
          LIFO: last in, first out
        </span>
        <span className="rounded-md bg-[hsl(var(--accent)/0.16)] px-3 py-2 text-sm font-semibold">
          operation: {frame.operation}
        </span>
        {frame.activeValue !== null && (
          <span className="rounded-md bg-[hsl(var(--glass))] px-3 py-2 text-sm font-semibold">
            active value: {frame.activeValue}
          </span>
        )}
        {frame.result && (
          <span className="rounded-md bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
            result: {frame.result}
          </span>
        )}
      </div>

      <div className="mx-auto flex max-w-sm flex-col items-stretch gap-2">
        <div className="text-center font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Top
        </div>
        <div className="flex min-h-[390px] flex-col justify-start gap-2 rounded-lg border-2 border-dashed border-[hsl(var(--primary)/0.35)] p-4">
          {reversed.length === 0 ? (
            <div className="grid min-h-32 place-items-center rounded-md border border-dashed border-[hsl(var(--muted-foreground)/0.32)] text-sm text-muted-foreground">
              empty stack
            </div>
          ) : (
            reversed.map((item) => (
              <StackNode item={item} frame={frame} key={item.id} />
            ))
          )}
        </div>
        <div className="text-center font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Base
        </div>
      </div>
    </div>
  )
}

function StackNode({ item, frame }: { item: StackItem; frame: StackStep }) {
  const state = getItemState(item.id, frame)

  return (
    <motion.div
      animate={{
        backgroundColor: state.background,
        borderColor: state.border,
        color: state.color
      }}
      className="flex min-h-16 items-center justify-between rounded-md border-2 px-4 shadow-sm"
      layout
    >
      <span className="font-mono text-xs font-bold opacity-70">value</span>
      <span className="break-all text-2xl font-black">{item.value}</span>
    </motion.div>
  )
}

function getItemState(id: string, frame: StackStep) {
  if (frame.activeItemId === id) {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.removedItemId === id) {
    return { background: '#F97316', border: '#EA580C', color: '#FFFFFF' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

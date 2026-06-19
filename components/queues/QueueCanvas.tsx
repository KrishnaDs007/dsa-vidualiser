'use client'

import { motion } from 'framer-motion'
import type { QueueItem, QueueStep } from '@/engine/types'

interface QueueCanvasProps {
  frame: QueueStep
}

export function QueueCanvas({ frame }: QueueCanvasProps) {
  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[340px] rounded-lg p-4 sm:min-h-[420px] sm:p-5 2xl:min-h-[520px]">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 font-mono text-sm font-bold text-primary">
          FIFO: first in, first out
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

      <div className="grid gap-3">
        <div className="flex justify-between font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span>Front</span>
          <span>Rear</span>
        </div>
        <div className="flex min-h-40 items-center gap-3 overflow-x-auto rounded-lg border-2 border-dashed border-[hsl(var(--primary)/0.35)] p-4">
          {frame.items.length === 0 ? (
            <div className="grid min-h-24 min-w-full place-items-center rounded-md border border-dashed border-[hsl(var(--muted-foreground)/0.32)] text-sm text-muted-foreground">
              empty queue
            </div>
          ) : (
            frame.items.map((item) => (
              <QueueNode item={item} frame={frame} key={item.id} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function QueueNode({ item, frame }: { item: QueueItem; frame: QueueStep }) {
  const state = getItemState(item.id, frame)

  return (
    <motion.div
      animate={{
        backgroundColor: state.background,
        borderColor: state.border,
        color: state.color
      }}
      className="flex min-h-24 min-w-28 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
      layout
    >
      <span className="font-mono text-xs font-bold uppercase opacity-70">value</span>
      <span className="break-all text-3xl font-black">{item.value}</span>
    </motion.div>
  )
}

function getItemState(id: string, frame: QueueStep) {
  if (frame.activeItemId === id) {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.removedItemId === id) {
    return { background: '#F97316', border: '#EA580C', color: '#FFFFFF' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

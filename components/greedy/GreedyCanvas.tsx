'use client'

import { motion } from 'framer-motion'
import type { GreedyItem, GreedyStep } from '@/engine/types'

interface GreedyCanvasProps {
  frame: GreedyStep
}

export function GreedyCanvas({ frame }: GreedyCanvasProps) {
  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[320px] rounded-lg p-4 sm:min-h-[460px] sm:p-5 2xl:min-h-[560px]">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 font-mono text-sm font-bold text-primary">
          result: {frame.result || '-'}
        </span>
        <span className="rounded-md bg-[hsl(var(--accent)/0.16)] px-3 py-2 text-sm font-semibold">
          selected: {frame.selectedIds.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {frame.items.map((item) => (
          <GreedyCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  )
}

function GreedyCard({ item }: { item: GreedyItem }) {
  const state = getState(item)

  return (
    <motion.div
      animate={{
        backgroundColor: state.background,
        borderColor: state.border,
        color: state.color
      }}
      className="flex min-h-32 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-75">
          {item.label}
        </span>
        <span className="rounded-sm bg-white/35 px-2 py-1 font-mono text-[10px] font-bold uppercase">
          {item.state}
        </span>
      </div>
      <p className="text-3xl font-black">{item.value}</p>
      {item.meta && <p className="text-xs font-semibold opacity-75">{item.meta}</p>}
    </motion.div>
  )
}

function getState(item: GreedyItem) {
  if (item.state === 'active') {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }
  if (item.state === 'selected') {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }
  if (item.state === 'rejected') {
    return { background: '#FEE2E2', border: '#EF4444', color: '#172033' }
  }
  if (item.state === 'merged') {
    return { background: '#E8F0FF', border: '#6366F1', color: '#172033' }
  }
  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

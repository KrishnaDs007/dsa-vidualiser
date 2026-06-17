'use client'

import { motion } from 'framer-motion'
import type { ArrayStringStep } from '@/engine/types'

interface ArrayStringCanvasProps {
  frame: ArrayStringStep
}

export function ArrayStringCanvas({ frame }: ArrayStringCanvasProps) {
  const targetLabel = frame.mode === 'slidingWindow' ? 'window size' : 'target'

  return (
    <div className="glass-panel dot-grid min-h-[360px] rounded-lg p-5">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 font-mono text-sm font-bold text-primary">
          {targetLabel}: {frame.target}
        </span>
        <span className="rounded-md bg-[hsl(var(--accent)/0.16)] px-3 py-2 text-sm font-semibold">
          sum: {frame.currentSum ?? '-'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {frame.array.map((value, index) => {
          const state = getCellState(index, frame)

          return (
            <motion.div
              animate={{
                backgroundColor: state.background,
                borderColor: state.border,
                color: state.color
              }}
              className="flex min-h-28 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
              key={`${value}-${index}`}
              layout
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-75">
                  Index {index}
                </span>
                <span className="font-mono text-xs font-black">{getPointerLabel(index, frame)}</span>
              </div>
              <span className="text-3xl font-black">{value}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function getPointerLabel(index: number, frame: ArrayStringStep) {
  if (frame.leftIndex === index && frame.rightIndex === index) return 'L/R'
  if (frame.leftIndex === index) return 'L'
  if (frame.rightIndex === index) return 'R'
  return ''
}

function getCellState(index: number, frame: ArrayStringStep) {
  if (frame.foundIndexes.includes(index)) {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }

  if (frame.leftIndex === index || frame.rightIndex === index) {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.eliminatedIndexes.includes(index)) {
    return { background: '#DDE7EE', border: '#91A8B3', color: '#52616B' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

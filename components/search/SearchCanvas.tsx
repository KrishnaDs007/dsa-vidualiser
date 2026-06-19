'use client'

import { motion } from 'framer-motion'
import type { SearchStep } from '@/engine/types'

interface SearchCanvasProps {
  frame: SearchStep
}

export function SearchCanvas({ frame }: SearchCanvasProps) {
  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[320px] rounded-lg p-4 sm:min-h-[360px] sm:p-5 2xl:min-h-[460px]">
      <div className="grid h-full content-center gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {frame.array.map((value, index) => {
          const state = getCellState(index, frame)

          return (
            <motion.div
              animate={{
                backgroundColor: state.background,
                borderColor: state.border,
                color: state.color
              }}
              className="flex min-h-24 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
              key={`${value}-${index}`}
              layout
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-75">
                Index {index}
              </span>
              <span className="text-3xl font-black">{value}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function getCellState(index: number, frame: SearchStep) {
  if (frame.foundIndex === index) {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }

  if (frame.checking.includes(index)) {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.eliminated.includes(index)) {
    return { background: '#DDE7EE', border: '#91A8B3', color: '#52616B' }
  }

  if (frame.activeRange.includes(index)) {
    return { background: '#E8F0FF', border: '#6366F1', color: '#172033' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

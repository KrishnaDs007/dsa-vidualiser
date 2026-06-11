'use client'

import { motion } from 'framer-motion'
import type { SearchStep } from '@/engine/types'

interface SearchCanvasProps {
  frame: SearchStep
}

export function SearchCanvas({ frame }: SearchCanvasProps) {
  return (
    <div className="dot-grid min-h-[360px] rounded-lg bg-[hsl(var(--surface))] p-5">
      <div className="grid h-full content-center gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
    return { background: '#1D9E75', border: '#1D9E75', color: '#FFFFFF' }
  }

  if (frame.checking.includes(index)) {
    return { background: '#FAEEDA', border: '#BA7517', color: '#1B1C18' }
  }

  if (frame.eliminated.includes(index)) {
    return { background: '#E8E4DD', border: '#B4B2A9', color: '#6F6D67' }
  }

  if (frame.activeRange.includes(index)) {
    return { background: '#F8F7FF', border: '#534AB7', color: '#1B1C18' }
  }

  return { background: '#FFFFFF', border: '#D8D4CC', color: '#1B1C18' }
}

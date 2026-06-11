'use client'

import { motion } from 'framer-motion'
import type { DpStep } from '@/engine/types'

interface DpCanvasProps {
  frame: DpStep
}

export function DpCanvas({ frame }: DpCanvasProps) {
  return (
    <div className="dot-grid min-h-[360px] rounded-lg bg-[hsl(var(--surface))] p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
        {frame.cells.map((cell) => {
          const state = getCellState(cell.id, frame)

          return (
            <motion.div
              animate={{
                backgroundColor: state.background,
                borderColor: state.border,
                color: state.color
              }}
              className="flex min-h-24 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
              key={cell.id}
              layout
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-75">
                State {cell.label}
              </span>
              <span className="text-3xl font-black">{cell.value}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function getCellState(id: string, frame: DpStep) {
  if (frame.activeCellId === id) {
    return { background: '#FAEEDA', border: '#BA7517', color: '#1B1C18' }
  }

  if (frame.dependencyCellIds.includes(id)) {
    return { background: '#F8F7FF', border: '#534AB7', color: '#1B1C18' }
  }

  if (frame.completedCellIds.includes(id)) {
    return { background: '#1D9E75', border: '#1D9E75', color: '#FFFFFF' }
  }

  return { background: '#FFFFFF', border: '#B4B2A9', color: '#1B1C18' }
}

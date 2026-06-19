'use client'

import { motion } from 'framer-motion'
import type { DpStep } from '@/engine/types'

interface DpCanvasProps {
  frame: DpStep
}

export function DpCanvas({ frame }: DpCanvasProps) {
  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[320px] rounded-lg p-4 sm:min-h-[360px] sm:p-5 2xl:min-h-[460px]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.dependencyCellIds.includes(id)) {
    return { background: '#E8F0FF', border: '#6366F1', color: '#172033' }
  }

  if (frame.completedCellIds.includes(id)) {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

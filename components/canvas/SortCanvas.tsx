'use client'

import { AnimatePresence, LayoutGroup } from 'framer-motion'
import { Bar, type BarState } from '@/components/canvas/Bar'
import type { SortStep } from '@/engine/types'

interface SortCanvasProps {
  frame?: SortStep
}

export function SortCanvas({ frame }: SortCanvasProps) {
  const maxValue = Math.max(...(frame?.array ?? [1]))

  return (
    <LayoutGroup>
      <div className="visualizer-canvas glass-panel dot-grid flex min-h-[360px] items-end gap-2 overflow-x-auto overflow-y-hidden rounded-lg p-4 sm:min-h-[460px] sm:p-5 2xl:min-h-[620px]">
        <AnimatePresence>
          {frame?.array.map((value, index) => (
            <Bar
              key={`${value}-${index}`}
              maxValue={maxValue}
              state={getBarState(index, frame)}
              value={value}
            />
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

function getBarState(index: number, step: SortStep): BarState {
  if (step.sorted.includes(index)) return 'sorted'
  if (step.swapped.includes(index)) return 'swapped'
  if (step.comparing.includes(index)) return 'comparing'
  if (step.pivot === index) return 'pivot'
  return 'default'
}

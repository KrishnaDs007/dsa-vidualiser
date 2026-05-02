'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { STEP_COLORS } from '@/lib/constants'

export type BarState = keyof typeof STEP_COLORS

interface BarProps {
  value: number
  state: BarState
  maxValue: number
}

export function Bar({ value, state, maxValue }: BarProps) {
  const reduced = useReducedMotion()
  const heightPct = Math.max((value / maxValue) * 100, 8)
  const colors = STEP_COLORS[state]

  return (
    <motion.div
      animate={{
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
      className="relative flex min-w-7 flex-1 items-end justify-center rounded-t-md border px-1 shadow-sm"
      layout
      style={{ height: `${heightPct}%` }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              layout: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
              backgroundColor: { duration: 0.25 }
            }
      }
    >
      <span className="mb-2 text-xs font-semibold text-foreground">{value}</span>
    </motion.div>
  )
}

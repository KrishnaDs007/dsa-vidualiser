'use client'

import { motion } from 'framer-motion'
import type { BacktrackingCell, BacktrackingStep } from '@/engine/types'

interface BacktrackingCanvasProps {
  frame: BacktrackingStep
}

export function BacktrackingCanvas({ frame }: BacktrackingCanvasProps) {
  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[320px] rounded-lg p-4 sm:min-h-[460px] sm:p-5 2xl:min-h-[560px]">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)]">
        <div className="flex flex-col gap-5">
          {frame.board ? (
            <Board cells={frame.board} size={frame.boardSize ?? 4} />
          ) : (
            <ChoiceGrid frame={frame} />
          )}

          <div className="rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Current Path
            </p>
            <div className="mt-3 flex min-h-12 flex-wrap items-center gap-2">
              {frame.path.length > 0 ? (
                frame.path.map((item, index) => (
                  <span
                    className="rounded-md bg-[hsl(var(--primary)/0.14)] px-3 py-2 font-mono text-sm font-bold text-primary"
                    key={`${item}-${index}`}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">empty</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] p-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Results
          </p>
          <div className="mt-3 flex max-h-[330px] flex-col gap-2 overflow-auto pr-1">
            {frame.results.length > 0 ? (
              frame.results.slice(-12).map((item, index) => (
                <span
                  className="rounded-md bg-emerald-100 px-3 py-2 font-mono text-sm font-bold text-emerald-900"
                  key={`${item}-${index}`}
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">No result yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChoiceGrid({ frame }: { frame: BacktrackingStep }) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Choices
      </p>
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {frame.choices.map((choice) => {
          const rejected = frame.rejectedChoices.includes(choice)
          const chosen = frame.path.includes(choice)
          const active = frame.activeChoice === choice

          return (
            <motion.div
              animate={{
                backgroundColor: rejected
                  ? '#FEE2E2'
                  : active
                    ? '#FFE7B8'
                    : chosen
                      ? '#14B8A6'
                      : '#F8FAFC',
                borderColor: rejected
                  ? '#EF4444'
                  : active
                    ? '#F59E0B'
                    : chosen
                      ? '#0F766E'
                      : '#CBD5E1',
                color: chosen ? '#FFFFFF' : '#172033'
              }}
              className="flex min-h-24 flex-col justify-between rounded-md border-2 p-4 shadow-sm"
              key={choice}
              layout
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-75">
                Choice
              </span>
              <span className="text-3xl font-black">{choice}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Board({ cells, size }: { cells: BacktrackingCell[]; size: number }) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Board
      </p>
      <div
        className="grid max-w-xl gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const state = getCellState(cell)

          return (
            <motion.div
              animate={{
                backgroundColor: state.background,
                borderColor: state.border,
                color: state.color
              }}
              className="grid aspect-square min-h-16 place-items-center rounded-md border-2 p-2 shadow-sm"
              key={cell.id}
              layout
            >
              <div className="text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                  {cell.label}
                </p>
                <p className="mt-1 text-2xl font-black sm:text-3xl">{cell.value || '-'}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function getCellState(cell: BacktrackingCell) {
  if (cell.state === 'active') {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }
  if (cell.state === 'rejected') {
    return { background: '#FEE2E2', border: '#EF4444', color: '#172033' }
  }
  if (cell.state === 'chosen') {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }
  if (cell.state === 'fixed') {
    return { background: '#E8F0FF', border: '#6366F1', color: '#172033' }
  }
  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

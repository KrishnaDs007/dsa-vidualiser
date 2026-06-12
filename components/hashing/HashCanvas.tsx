'use client'

import { motion } from 'framer-motion'
import type { HashEntry, HashStep } from '@/engine/types'

interface HashCanvasProps {
  frame: HashStep
}

export function HashCanvas({ frame }: HashCanvasProps) {
  return (
    <div className="glass-panel dot-grid min-h-[520px] rounded-lg p-5">
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-md bg-[hsl(var(--primary)/0.12)] px-3 py-2 font-mono font-bold text-primary">
          bucket = abs(key) % {frame.bucketCount}
        </span>
        {frame.activeKey !== null && (
          <span className="rounded-md bg-[hsl(var(--accent)/0.16)] px-3 py-2 font-semibold">
            active key: {frame.activeKey}
          </span>
        )}
      </div>

      <div className="grid gap-3">
        {frame.buckets.map((bucket) => {
          const active = frame.activeBucketId === bucket.id

          return (
            <motion.div
              animate={{
                borderColor: active ? '#6366F1' : '#CBD5E1',
                backgroundColor: active ? '#E8F0FF' : '#F8FAFC'
              }}
              className="grid gap-3 rounded-lg border-2 p-3 md:grid-cols-[5rem_minmax(0,1fr)] md:items-center"
              key={bucket.id}
              layout
            >
              <div className="font-mono text-sm font-black text-primary">
                Bucket {bucket.id}
              </div>
              <div className="flex min-h-14 flex-wrap items-center gap-2">
                {bucket.entries.length === 0 ? (
                  <span className="rounded-md border border-dashed border-[hsl(var(--muted-foreground)/0.32)] px-3 py-2 text-sm text-muted-foreground">
                    empty
                  </span>
                ) : (
                  bucket.entries.map((entry) => (
                    <HashEntryNode entry={entry} frame={frame} key={entry.id} />
                  ))
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function HashEntryNode({ entry, frame }: { entry: HashEntry; frame: HashStep }) {
  const state = getEntryState(entry.id, frame)

  return (
    <motion.div
      animate={{
        backgroundColor: state.background,
        borderColor: state.border,
        color: state.color
      }}
      className="flex min-w-24 items-center justify-between gap-3 rounded-md border-2 px-3 py-2 shadow-sm"
      layout
    >
      <span className="font-mono text-xs font-bold opacity-70">key</span>
      <span className="text-lg font-black">{entry.key}</span>
    </motion.div>
  )
}

function getEntryState(id: string, frame: HashStep) {
  if (frame.foundEntryId === id) {
    return { background: '#14B8A6', border: '#0F766E', color: '#FFFFFF' }
  }

  if (frame.activeEntryId === id) {
    return { background: '#FFE7B8', border: '#F59E0B', color: '#172033' }
  }

  if (frame.visitedEntryIds.includes(id)) {
    return { background: '#DDE7EE', border: '#91A8B3', color: '#52616B' }
  }

  if (frame.insertedEntryIds.includes(id)) {
    return { background: '#EAF3F6', border: '#91A8B3', color: '#172033' }
  }

  return { background: '#F8FAFC', border: '#CBD5E1', color: '#172033' }
}

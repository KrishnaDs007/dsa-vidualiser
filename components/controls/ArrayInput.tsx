'use client'

import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateRandomArray, parseArrayInput } from '@/lib/array'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { usePlaybackStore } from '@/store/playbackStore'

export function ArrayInput() {
  const inputArray = useAlgorithmStore((state) => state.inputArray)
  const setInputArray = useAlgorithmStore((state) => state.setInputArray)
  const pause = usePlaybackStore((state) => state.pause)
  const [value, setValue] = useState(inputArray.join(', '))

  function applyArray(nextValue = value) {
    pause()
    const parsed = parseArrayInput(nextValue)
    setInputArray(parsed)
    setValue(parsed.join(', '))
  }

  function randomize() {
    const next = generateRandomArray(10)
    pause()
    setInputArray(next)
    setValue(next.join(', '))
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[hsl(var(--surface-container-lowest))] p-4">
      <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Array values
      </label>
      <div className="flex gap-2">
        <input
          className="min-w-0 flex-1 border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-2 text-sm outline-none transition focus:border-primary"
          onBlur={() => applyArray()}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') applyArray()
          }}
          value={value}
        />
        <Button
          aria-label="Randomize array"
          onClick={randomize}
          size="icon"
          type="button"
          variant="outline"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

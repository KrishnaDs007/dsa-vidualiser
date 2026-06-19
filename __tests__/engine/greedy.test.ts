import { describe, expect, it } from 'vitest'
import { GREEDY_ALGORITHMS } from '@/engine/greedy'

function framesFor(id: keyof typeof GREEDY_ALGORITHMS) {
  return Array.from(GREEDY_ALGORITHMS[id].run())
}

describe('greedy engine', () => {
  it('selects compatible activities', () => {
    const finalFrame = framesFor('activitySelection').at(-1)

    expect(finalFrame?.selectedIds).toEqual(['a1', 'a3', 'a5'])
    expect(finalFrame?.result).toBe('3 selected')
  })

  it('merges overlapping intervals', () => {
    const finalFrame = framesFor('mergeIntervals').at(-1)

    expect(finalFrame?.result).toBe('[1,6] [8,12]')
  })

  it('detects reachable jump game end', () => {
    const finalFrame = framesFor('jumpGame').at(-1)

    expect(finalFrame?.result).toBe('can reach end')
  })

  it('finds gas station start index', () => {
    const finalFrame = framesFor('gasStation').at(-1)

    expect(finalFrame?.result).toBe('start 3')
  })

  it('builds a Huffman root weight', () => {
    const finalFrame = framesFor('huffman').at(-1)

    expect(finalFrame?.result).toBe('root 39')
  })

  it.each(Object.values(GREEDY_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = Array.from(algorithm.run())

      expect(frames.length).toBeGreaterThan(1)
      for (const frame of frames) {
        expect(frame.items.length).toBeGreaterThan(0)
        expect(frame.note).toBeTruthy()
        expect(frame.timeComplexity).toMatch(/^O/)
        expect(frame.spaceComplexity).toMatch(/^O/)
        expect(frame.codeLine).toBeGreaterThan(0)
      }
    }
  )
})

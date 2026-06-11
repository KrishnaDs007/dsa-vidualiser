import { describe, expect, it } from 'vitest'
import { SEARCH_ALGORITHMS, SEARCH_PSEUDOCODE } from '@/engine/search'

function framesFor(
  algorithm: (typeof SEARCH_ALGORITHMS)[keyof typeof SEARCH_ALGORITHMS],
  input: number[],
  target: number
) {
  return Array.from(algorithm.run(input, target))
}

describe('search engine', () => {
  it('linear search finds the target without mutating input', () => {
    const input = [8, 3, 7, 4]
    const frames = framesFor(SEARCH_ALGORITHMS.linear, input, 7)
    const finalFrame = frames.at(-1)

    expect(finalFrame?.foundIndex).toBe(2)
    expect(input).toEqual([8, 3, 7, 4])
  })

  it('binary search finds the target in a sorted copy without mutating input', () => {
    const input = [8, 3, 7, 4, 2]
    const frames = framesFor(SEARCH_ALGORITHMS.binary, input, 7)
    const finalFrame = frames.at(-1)

    expect(finalFrame?.array).toEqual([2, 3, 4, 7, 8])
    expect(finalFrame?.foundIndex).toBe(3)
    expect(input).toEqual([8, 3, 7, 4, 2])
  })

  it.each(Object.values(SEARCH_ALGORITHMS))(
    '$label emits not-found states',
    (algorithm) => {
      const frames = framesFor(algorithm, [1, 4, 9], 7)
      const finalFrame = frames.at(-1)

      expect(finalFrame?.foundIndex).toBeNull()
      expect(finalFrame?.activeRange).toEqual([])
    }
  )

  it.each(Object.values(SEARCH_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = framesFor(algorithm, [6, 2, 8, 1, 5], 5)
      const codeLineCount = SEARCH_PSEUDOCODE[algorithm.id].split('\n').length

      expect(frames.length).toBeGreaterThan(0)

      for (const frame of frames) {
        expect(frame.array).toHaveLength(5)
        expect(frame.codeLine).toBeGreaterThanOrEqual(1)
        expect(frame.codeLine).toBeLessThanOrEqual(codeLineCount)

        const highlighted = [
          ...frame.checking,
          ...frame.activeRange,
          ...frame.eliminated,
          ...(frame.foundIndex === null ? [] : [frame.foundIndex])
        ]

        for (const index of highlighted) {
          expect(index).toBeGreaterThanOrEqual(0)
          expect(index).toBeLessThan(5)
        }
      }
    }
  )
})

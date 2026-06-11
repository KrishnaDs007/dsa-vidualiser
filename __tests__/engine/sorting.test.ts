import { describe, expect, it } from 'vitest'
import { PSEUDOCODE, SORT_ALGORITHMS } from '@/engine/sorting'

function finalArray(generator: Generator<{ array: number[] }>) {
  return Array.from(generator).at(-1)?.array
}

describe('sorting engine', () => {
  it.each(Object.values(SORT_ALGORITHMS))(
    '$label emits sorted final snapshot without mutating input',
    (algorithm) => {
      const input = [8, 3, 7, 4, 2, 9, 1, 5]
      const result = finalArray(algorithm.run(input))

      expect(result).toEqual([1, 2, 3, 4, 5, 7, 8, 9])
      expect(input).toEqual([8, 3, 7, 4, 2, 9, 1, 5])
    }
  )

  it.each(Object.values(SORT_ALGORITHMS))(
    '$label handles duplicates and negative values',
    (algorithm) => {
      const input = [4, -1, 4, 0, -3, 2]
      const result = finalArray(algorithm.run(input))

      expect(result).toEqual([-3, -1, 0, 2, 4, 4])
      expect(input).toEqual([4, -1, 4, 0, -3, 2])
    }
  )

  it.each(Object.values(SORT_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const input = [6, 2, 8, 1, 5]
      const frames = Array.from(algorithm.run(input))
      const codeLineCount = PSEUDOCODE[algorithm.id].split('\n').length

      expect(frames.length).toBeGreaterThan(0)

      for (const frame of frames) {
        expect(frame.array).toHaveLength(input.length)
        expect(frame.codeLine).toBeGreaterThanOrEqual(1)
        expect(frame.codeLine).toBeLessThanOrEqual(codeLineCount)

        const highlighted = [
          ...frame.comparing,
          ...frame.swapped,
          ...frame.sorted,
          ...(frame.pivot === undefined ? [] : [frame.pivot])
        ]

        for (const index of highlighted) {
          expect(index).toBeGreaterThanOrEqual(0)
          expect(index).toBeLessThan(input.length)
        }
      }
    }
  )
})

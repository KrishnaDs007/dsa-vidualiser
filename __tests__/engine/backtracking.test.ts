import { describe, expect, it } from 'vitest'
import { BACKTRACKING_ALGORITHMS } from '@/engine/backtracking'

function framesFor(id: keyof typeof BACKTRACKING_ALGORITHMS) {
  return Array.from(BACKTRACKING_ALGORITHMS[id].run())
}

describe('backtracking engine', () => {
  it('generates all subsets for three values', () => {
    const finalFrame = framesFor('subsets').at(-1)

    expect(finalFrame?.results).toHaveLength(8)
    expect(finalFrame?.timeComplexity).toBe('O(2^n)')
  })

  it('generates all permutations for three values', () => {
    const finalFrame = framesFor('permutations').at(-1)

    expect(finalFrame?.results).toHaveLength(6)
    expect(finalFrame?.spaceComplexity).toBe('O(n)')
  })

  it('generates combinations of length two', () => {
    const finalFrame = framesFor('combinations').at(-1)

    expect(finalFrame?.results).toHaveLength(6)
  })

  it('finds 4-Queens solutions with board frames', () => {
    const finalFrame = framesFor('nQueens').at(-1)

    expect(finalFrame?.results).toHaveLength(2)
    expect(finalFrame?.board).toHaveLength(16)
  })

  it('solves the compact Sudoku board', () => {
    const finalFrame = framesFor('sudoku').at(-1)

    expect(finalFrame?.result).toBe('Solved')
    expect(finalFrame?.board?.every((cell) => cell.value)).toBe(true)
  })

  it.each(Object.values(BACKTRACKING_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = Array.from(algorithm.run())

      expect(frames.length).toBeGreaterThan(1)
      for (const frame of frames) {
        expect(frame.note).toBeTruthy()
        expect(frame.timeComplexity).toMatch(/^O/)
        expect(frame.spaceComplexity).toMatch(/^O/)
        expect(frame.codeLine).toBeGreaterThan(0)
      }
    }
  )
})

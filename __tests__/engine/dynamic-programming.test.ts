import { describe, expect, it } from 'vitest'
import {
  DP_ALGORITHMS,
  DP_PSEUDOCODE
} from '@/engine/dynamicProgramming'

function framesFor(
  algorithm: (typeof DP_ALGORITHMS)[keyof typeof DP_ALGORITHMS],
  size: number
) {
  return Array.from(algorithm.run(size))
}

describe('dynamic programming engine', () => {
  it('computes fibonacci with tabulation', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.fibonacci, 7).at(-1)

    expect(finalFrame?.result).toBe('13')
  })

  it('computes climbing stairs ways', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.climbing, 5).at(-1)

    expect(finalFrame?.result).toBe('8')
  })

  it('computes coin change minimum with default coins', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.coinChange, 6).at(-1)

    expect(finalFrame?.result).toBe('2')
  })

  it('computes 0/1 knapsack best value', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.knapsack, 8).at(-1)

    expect(finalFrame?.result).toBe('12')
  })

  it('computes longest common subsequence length', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.lcs, 4).at(-1)

    expect(finalFrame?.result).toBe('3')
  })

  it('computes longest increasing subsequence length', () => {
    const finalFrame = framesFor(DP_ALGORITHMS.lis, 8).at(-1)

    expect(finalFrame?.result).toBe('4')
  })

  it.each(Object.values(DP_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = framesFor(algorithm, algorithm.defaultSize)
      const codeLineCount = DP_PSEUDOCODE[algorithm.id].split('\n').length

      expect(frames.length).toBeGreaterThan(0)

      for (const frame of frames) {
        const cellIds = new Set(frame.cells.map((cell) => cell.id))

        expect(frame.codeLine).toBeGreaterThanOrEqual(1)
        expect(frame.codeLine).toBeLessThanOrEqual(codeLineCount)
        expect(frame.timeComplexity).toMatch(/^O\(/)
        expect(frame.spaceComplexity).toMatch(/^O\(/)

        if (frame.activeCellId) expect(cellIds.has(frame.activeCellId)).toBe(true)

        for (const id of [
          ...frame.dependencyCellIds,
          ...frame.completedCellIds
        ]) {
          expect(cellIds.has(id)).toBe(true)
        }
      }
    }
  )
})

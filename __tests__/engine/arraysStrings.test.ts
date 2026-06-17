import { describe, expect, it } from 'vitest'
import { slidingWindowMaxSum } from '@/engine/arraysStrings/slidingWindow'
import { twoPointerTwoSum } from '@/engine/arraysStrings/twoPointers'

describe('arrays and strings engine', () => {
  it('finds a pair using inward-moving pointers', () => {
    const frames = Array.from(twoPointerTwoSum([9, 1, 4, 6, 12], 10))
    const foundFrame = frames.at(-1)

    expect(foundFrame?.foundIndexes).toHaveLength(2)
    expect(foundFrame?.currentSum).toBe(10)
    expect(foundFrame?.mode).toBe('twoPointers')
    expect(foundFrame?.timeComplexity).toBe('O(n)')
  })

  it('eliminates indexes when no pair exists', () => {
    const frames = Array.from(twoPointerTwoSum([2, 4, 8, 16], 100))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.foundIndexes).toEqual([])
    expect(finalFrame?.note).toContain('No pair')
    expect(finalFrame?.eliminatedIndexes.length).toBeGreaterThan(0)
  })

  it('tracks the best fixed-size sliding window sum', () => {
    const frames = Array.from(slidingWindowMaxSum([2, 1, 5, 1, 3, 2], 3))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.mode).toBe('slidingWindow')
    expect(finalFrame?.currentSum).toBe(9)
    expect(finalFrame?.foundIndexes).toEqual([2, 3, 4])
  })
})

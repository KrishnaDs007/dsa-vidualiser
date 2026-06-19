import { describe, expect, it } from 'vitest'
import { kadaneMaxSubarray } from '@/engine/arraysStrings/kadane'
import { matrixTraversal } from '@/engine/arraysStrings/matrixTraversal'
import { prefixRangeSum } from '@/engine/arraysStrings/prefixSum'
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

  it('builds prefix sums and answers a range query', () => {
    const frames = Array.from(prefixRangeSum([3, -2, 5, 1, 6], 3, 1))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.mode).toBe('prefixSum')
    expect(finalFrame?.derivedArray).toEqual([0, 3, 1, 6, 7, 13])
    expect(finalFrame?.currentSum).toBe(4)
    expect(finalFrame?.foundIndexes).toEqual([1, 2, 3])
    expect(finalFrame?.spaceComplexity).toBe('O(n)')
  })

  it('tracks the maximum subarray with Kadane Algorithm', () => {
    const frames = Array.from(kadaneMaxSubarray([4, -1, 2, -7, 5, 2, -1, 3]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.mode).toBe('kadane')
    expect(finalFrame?.target).toBe(9)
    expect(finalFrame?.currentSum).toBe(9)
    expect(finalFrame?.foundIndexes).toEqual([4, 5, 6, 7])
    expect(finalFrame?.spaceComplexity).toBe('O(1)')
  })

  it('visits every matrix cell row by row', () => {
    const frames = Array.from(matrixTraversal([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.mode).toBe('matrixTraversal')
    expect(finalFrame?.target).toBe(9)
    expect(finalFrame?.currentSum).toBe(45)
    expect(finalFrame?.foundIndexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(finalFrame?.timeComplexity).toBe('O(9)')
  })
})

import { describe, expect, it } from 'vitest'
import { twoPointerTwoSum } from '@/engine/arraysStrings/twoPointers'

describe('arrays and strings engine', () => {
  it('finds a pair using inward-moving pointers', () => {
    const frames = Array.from(twoPointerTwoSum([9, 1, 4, 6, 12], 10))
    const foundFrame = frames.at(-1)

    expect(foundFrame?.foundIndexes).toHaveLength(2)
    expect(foundFrame?.currentSum).toBe(10)
    expect(foundFrame?.timeComplexity).toBe('O(n)')
  })

  it('eliminates indexes when no pair exists', () => {
    const frames = Array.from(twoPointerTwoSum([2, 4, 8, 16], 100))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.foundIndexes).toEqual([])
    expect(finalFrame?.note).toContain('No pair')
    expect(finalFrame?.eliminatedIndexes.length).toBeGreaterThan(0)
  })
})

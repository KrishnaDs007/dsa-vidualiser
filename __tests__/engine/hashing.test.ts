import { describe, expect, it } from 'vitest'
import { hashInsert } from '@/engine/hashing/hashInsert'
import { hashSearch } from '@/engine/hashing/hashSearch'

describe('hashing engine', () => {
  it('inserts collided keys into the same bucket using chaining', () => {
    const frames = Array.from(hashInsert([5, 12, 19], 19, 7))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.buckets[5].entries.map((entry) => entry.key)).toEqual([
      5,
      12,
      19
    ])
    expect(finalFrame?.spaceComplexity).toBe('O(n)')
  })

  it('finds a target by scanning only the hashed bucket chain', () => {
    const frames = Array.from(hashSearch([4, 9, 14, 19], 14, 5))
    const foundFrame = frames.at(-1)

    expect(foundFrame?.foundEntryId).toBeTruthy()
    expect(foundFrame?.activeBucketId).toBe(4)
    expect(foundFrame?.visitedEntryIds.length).toBe(3)
  })

  it('reports not found when the target bucket chain has no matching key', () => {
    const frames = Array.from(hashSearch([1, 8, 15], 22, 7))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.foundEntryId).toBeNull()
    expect(finalFrame?.note).toContain('not found')
  })
})

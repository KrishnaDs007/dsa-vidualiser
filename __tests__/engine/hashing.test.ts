import { describe, expect, it } from 'vitest'
import { hashInsert } from '@/engine/hashing/hashInsert'
import {
  frequencyCounter,
  groupAnagrams,
  longestConsecutive,
  subarraySumEqualsK,
  twoSumHash
} from '@/engine/hashing/hashPatterns'
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

  it('finds a two sum pair with complement lookup', () => {
    const frames = Array.from(twoSumHash([2, 7, 11, 15], 9, 7))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.foundEntryId).toBeTruthy()
    expect(finalFrame?.note).toContain('2 + 7 = 9')
  })

  it('counts frequencies by updating existing hash entries', () => {
    const frames = Array.from(frequencyCounter([4, 4, 2, 4], 4, 7))
    const finalFrame = frames.at(-1)
    const values = finalFrame?.buckets.flatMap((bucket) => bucket.entries)

    expect(values?.find((entry) => entry.key === 4)?.value).toBe('count 3')
  })

  it('groups anagrams by sorted-letter signatures', () => {
    const frames = Array.from(groupAnagrams(['eat', 'tea', 'tan', 'ate'], 'eat', 7))
    const finalFrame = frames.at(-1)
    const entries = finalFrame?.buckets.flatMap((bucket) => bucket.entries)

    expect(entries?.find((entry) => entry.key === 'aet')?.value).toContain('ate')
  })

  it('finds the longest consecutive sequence length', () => {
    const frames = Array.from(longestConsecutive([100, 4, 200, 1, 3, 2], 0, 7))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.activeKey).toBe(4)
    expect(finalFrame?.note).toContain('length is 4')
  })

  it('counts subarrays that sum to k using prefix sums', () => {
    const frames = Array.from(subarraySumEqualsK([1, 2, 3, -2, 5], 3, 7))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.activeKey).toBe(4)
    expect(finalFrame?.note).toContain('4 subarray')
  })
})

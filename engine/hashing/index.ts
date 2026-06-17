import { hashInsert } from '@/engine/hashing/hashInsert'
import {
  frequencyCounter,
  groupAnagrams,
  longestConsecutive,
  subarraySumEqualsK,
  twoSumHash
} from '@/engine/hashing/hashPatterns'
import { hashSearch } from '@/engine/hashing/hashSearch'

export const HASH_ALGORITHMS = {
  insert: {
    id: 'insert',
    label: 'Hash Insert',
    complexity: 'Average O(1), worst O(n)',
    run: hashInsert
  },
  search: {
    id: 'search',
    label: 'Hash Search',
    complexity: 'Average O(1), worst O(n)',
    run: hashSearch
  },
  twoSum: {
    id: 'twoSum',
    label: 'Two Sum',
    complexity: 'O(n)',
    run: twoSumHash
  },
  frequency: {
    id: 'frequency',
    label: 'Frequency Counter',
    complexity: 'O(n)',
    run: frequencyCounter
  },
  groupAnagrams: {
    id: 'groupAnagrams',
    label: 'Group Anagrams',
    complexity: 'O(n * k log k)',
    run: groupAnagrams
  },
  longestConsecutive: {
    id: 'longestConsecutive',
    label: 'Longest Consecutive Sequence',
    complexity: 'O(n)',
    run: longestConsecutive
  },
  subarraySum: {
    id: 'subarraySum',
    label: 'Subarray Sum Equals K',
    complexity: 'O(n)',
    run: subarraySumEqualsK
  }
} as const

export type HashAlgorithmId = keyof typeof HASH_ALGORITHMS

export function isHashAlgorithmId(value?: string): value is HashAlgorithmId {
  return Boolean(value && value in HASH_ALGORITHMS)
}

export const HASH_PSEUDOCODE: Record<HashAlgorithmId, string> = {
  insert: `function insertAll(keys: number[], bucketCount: number) {
  const buckets = createEmptyBuckets(bucketCount)
  for (const key of keys) {
    const bucket = Math.abs(key) % bucketCount
    buckets[bucket].push({ key, value: \`value-\${key}\` })
  }
  return buckets
}`,
  search: `function search(table: Bucket[], target: number) {
  const bucket = Math.abs(target) % table.length
  for (const entry of table[bucket]) {
    if (entry.key === target) {
      return entry
    }
  }
  return null
}`,
  twoSum: `function twoSum(values: number[], target: number) {
  const seen = new Map<number, number>()
  for (let index = 0; index < values.length; index++) {
    const complement = target - values[index]
    if (seen.has(complement)) return [seen.get(complement), index]
    seen.set(values[index], index)
  }
  return null
}`,
  frequency: `function countFrequencies(values: number[]) {
  const counts = new Map<number, number>()
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}`,
  groupAnagrams: `function groupAnagrams(words: string[]) {
  const groups = new Map<string, string[]>()
  for (const word of words) {
    const key = [...word].sort().join('')
    groups.set(key, [...(groups.get(key) ?? []), word])
  }
  return [...groups.values()]
}`,
  longestConsecutive: `function longestConsecutive(values: number[]) {
  const set = new Set(values)
  let best = 0
  for (const value of set) {
    if (set.has(value - 1)) continue
    let next = value
    while (set.has(next + 1)) next++
    best = Math.max(best, next - value + 1)
  }
  return best
}`,
  subarraySum: `function subarraySum(values: number[], k: number) {
  const prefixCounts = new Map<number, number>([[0, 1]])
  let prefix = 0
  let matches = 0
  for (const value of values) {
    prefix += value
    matches += prefixCounts.get(prefix - k) ?? 0
    prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1)
  }
  return matches
}`
}

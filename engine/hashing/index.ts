import { hashInsert } from '@/engine/hashing/hashInsert'
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
}`
}

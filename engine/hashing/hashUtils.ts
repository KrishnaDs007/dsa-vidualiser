import type { HashBucket, HashEntry } from '@/engine/types'

export function createBuckets(bucketCount: number): HashBucket[] {
  return Array.from({ length: bucketCount }, (_, index) => ({
    id: index,
    entries: []
  }))
}

export function hashKey(key: number, bucketCount: number) {
  return Math.abs(key) % bucketCount
}

export function cloneBuckets(buckets: HashBucket[]) {
  return buckets.map((bucket) => ({
    ...bucket,
    entries: bucket.entries.map((entry) => ({ ...entry }))
  }))
}

export function entryId(key: number, position: number) {
  return `key-${key}-${position}`
}

export function makeEntry(key: number, position: number): HashEntry {
  return {
    id: entryId(key, position),
    key,
    value: `value-${key}`
  }
}

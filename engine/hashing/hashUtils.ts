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

export function hashText(value: string, bucketCount: number) {
  const total = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return total % bucketCount
}

export function cloneBuckets(buckets: HashBucket[]) {
  return buckets.map((bucket) => ({
    ...bucket,
    entries: bucket.entries.map((entry) => ({ ...entry }))
  }))
}

export function entryId(key: number | string, position: number) {
  return `key-${key}-${position}`
}

export function makeEntry(key: number | string, position: number, value = `value-${key}`): HashEntry {
  return {
    id: entryId(key, position),
    key,
    value
  }
}

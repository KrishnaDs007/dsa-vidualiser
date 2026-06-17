import type { HashBucket, HashStep } from '@/engine/types'
import { cloneBuckets, createBuckets, hashKey, makeEntry } from '@/engine/hashing/hashUtils'

export function* hashSearch(
  keys: Array<number | string>,
  target: number | string,
  bucketCount = 7
): Generator<HashStep> {
  const numericKeys = keys.map((key) => Number(key)).filter(Number.isFinite)
  const numericTarget = Number(target)
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []

  numericKeys.forEach((key, index) => {
    const bucketId = hashKey(key, bucketCount)
    const entry = makeEntry(key, index)
    buckets[bucketId].entries.push(entry)
    insertedEntryIds.push(entry.id)
  })

  yield step({
    buckets,
    inputKeys: numericKeys,
    activeKey: numericTarget,
    bucketCount,
    insertedEntryIds,
    codeLine: 1,
    note: `Hash table is built with ${numericKeys.length} keys and ${bucketCount} buckets.`
  })

  const bucketId = hashKey(numericTarget, bucketCount)

  yield step({
    buckets,
    inputKeys: numericKeys,
    activeKey: numericTarget,
    activeBucketId: bucketId,
    bucketCount,
    insertedEntryIds,
    codeLine: 2,
    note: `Hash target ${numericTarget}: abs(${numericTarget}) % ${bucketCount} = bucket ${bucketId}.`
  })

  const visitedEntryIds: string[] = []
  for (const entry of buckets[bucketId].entries) {
    visitedEntryIds.push(entry.id)

    yield step({
      buckets,
      inputKeys: numericKeys,
      activeKey: numericTarget,
      activeBucketId: bucketId,
      activeEntryId: entry.id,
      insertedEntryIds,
      visitedEntryIds,
      bucketCount,
      codeLine: 4,
      note: `Compare target ${numericTarget} with key ${entry.key}.`
    })

    if (entry.key === numericTarget) {
      yield step({
        buckets,
        inputKeys: numericKeys,
        activeKey: numericTarget,
        activeBucketId: bucketId,
        activeEntryId: entry.id,
        insertedEntryIds,
        visitedEntryIds,
        foundEntryId: entry.id,
        bucketCount,
        codeLine: 5,
        note: `Found ${numericTarget} in bucket ${bucketId}.`
      })
      return
    }
  }

  yield step({
    buckets,
    inputKeys: numericKeys,
    activeKey: numericTarget,
    activeBucketId: bucketId,
    insertedEntryIds,
    visitedEntryIds,
    bucketCount,
    codeLine: 8,
    note: `${numericTarget} was not found in bucket ${bucketId}.`
  })
}

function step({
  buckets,
  inputKeys,
  activeKey = null,
  activeBucketId = null,
  activeEntryId = null,
  insertedEntryIds = [],
  visitedEntryIds = [],
  foundEntryId = null,
  bucketCount,
  codeLine,
  note
}: {
  buckets: HashBucket[]
  inputKeys: number[]
  activeKey?: number | null
  activeBucketId?: number | null
  activeEntryId?: string | null
  insertedEntryIds?: string[]
  visitedEntryIds?: string[]
  foundEntryId?: string | null
  bucketCount: number
  codeLine: number
  note: string
}): HashStep {
  return {
    buckets: cloneBuckets(buckets),
    inputKeys: [...inputKeys],
    activeKey,
    activeBucketId,
    activeEntryId,
    insertedEntryIds: [...insertedEntryIds],
    visitedEntryIds: [...visitedEntryIds],
    foundEntryId,
    bucketCount,
    timeComplexity: 'Average O(1), worst O(n)',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

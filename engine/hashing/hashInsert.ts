import type { HashBucket, HashStep } from '@/engine/types'
import { cloneBuckets, createBuckets, hashKey, makeEntry } from '@/engine/hashing/hashUtils'

export function* hashInsert(
  keys: number[],
  target: number,
  bucketCount = 7
): Generator<HashStep> {
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []

  yield step({
    buckets,
    inputKeys: keys,
    bucketCount,
    insertedEntryIds,
    codeLine: 1,
    note: `Create ${bucketCount} empty buckets.`
  })

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    const bucketId = hashKey(key, bucketCount)

    yield step({
      buckets,
      inputKeys: keys,
      activeKey: key,
      activeBucketId: bucketId,
      bucketCount,
      insertedEntryIds,
      codeLine: 3,
      note: `Hash key ${key}: abs(${key}) % ${bucketCount} = bucket ${bucketId}.`
    })

    const entry = makeEntry(key, index)
    buckets[bucketId].entries.push(entry)
    insertedEntryIds.push(entry.id)

    yield step({
      buckets,
      inputKeys: keys,
      activeKey: key,
      activeBucketId: bucketId,
      activeEntryId: entry.id,
      bucketCount,
      insertedEntryIds,
      codeLine: 4,
      note:
        buckets[bucketId].entries.length > 1
          ? `Collision in bucket ${bucketId}; append ${key} to the chain.`
          : `Insert ${key} into empty bucket ${bucketId}.`
    })
  }

  yield step({
    buckets,
    inputKeys: keys,
    activeKey: target,
    bucketCount,
    insertedEntryIds,
    codeLine: 6,
    note: 'All keys are inserted. Separate chaining keeps collided keys in the same bucket.'
  })
}

function step({
  buckets,
  inputKeys,
  activeKey = null,
  activeBucketId = null,
  activeEntryId = null,
  insertedEntryIds = [],
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
    visitedEntryIds: [],
    foundEntryId: null,
    bucketCount,
    timeComplexity: 'Average O(1), worst O(n)',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

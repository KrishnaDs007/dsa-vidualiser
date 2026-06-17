import type { HashBucket, HashStep } from '@/engine/types'
import { cloneBuckets, createBuckets, hashKey, hashText, makeEntry } from '@/engine/hashing/hashUtils'

type HashValue = number | string

export function* twoSumHash(
  values: HashValue[],
  target: HashValue,
  bucketCount = 7
): Generator<HashStep> {
  const numbers = toNumbers(values)
  const goal = toNumber(target, 10)
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []
  const visitedEntryIds: string[] = []
  const seen = new Map<number, string>()

  yield step({ buckets, inputKeys: numbers, bucketCount, codeLine: 1, strategyLabel: 'map: value -> index', note: `Find two values that sum to ${goal}.` })

  for (let index = 0; index < numbers.length; index++) {
    const value = numbers[index]
    const complement = goal - value
    const complementId = seen.get(complement)

    yield step({ buckets, inputKeys: numbers, activeKey: value, bucketCount, insertedEntryIds, visitedEntryIds, codeLine: 4, strategyLabel: 'lookup complement before insert', note: `At index ${index}, look for complement ${complement}.` })

    if (complementId) {
      visitedEntryIds.push(complementId)
      yield step({ buckets, inputKeys: numbers, activeKey: value, activeEntryId: complementId, foundEntryId: complementId, bucketCount, insertedEntryIds, visitedEntryIds, codeLine: 5, strategyLabel: 'complement found', note: `${complement} was already seen, so ${complement} + ${value} = ${goal}.` })
      return
    }

    const bucketId = hashKey(value, bucketCount)
    const entry = makeEntry(value, index, `index ${index}`)
    buckets[bucketId].entries.push(entry)
    insertedEntryIds.push(entry.id)
    seen.set(value, entry.id)

    yield step({ buckets, inputKeys: numbers, activeKey: value, activeBucketId: bucketId, activeEntryId: entry.id, bucketCount, insertedEntryIds, visitedEntryIds, codeLine: 7, strategyLabel: 'store value for later complements', note: `Store ${value} so a future value can pair with it.` })
  }

  yield step({ buckets, inputKeys: numbers, activeKey: goal, bucketCount, insertedEntryIds, visitedEntryIds, codeLine: 10, strategyLabel: 'map lookup complete', note: `No pair sums to ${goal}.` })
}

export function* frequencyCounter(
  values: HashValue[],
  target: HashValue,
  bucketCount = 7
): Generator<HashStep> {
  const numbers = toNumbers(values)
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []
  const counts = new Map<number, HashBucket['entries'][number]>()

  yield step({ buckets, inputKeys: numbers, activeKey: toNumber(target, 0), bucketCount, codeLine: 1, strategyLabel: 'map: value -> frequency', note: 'Count how many times each value appears.' })

  for (let index = 0; index < numbers.length; index++) {
    const value = numbers[index]
    const bucketId = hashKey(value, bucketCount)
    const existing = counts.get(value)

    if (existing) {
      const count = Number(existing.value.replace('count ', '')) + 1
      existing.value = `count ${count}`
      yield step({ buckets, inputKeys: numbers, activeKey: value, activeBucketId: bucketId, activeEntryId: existing.id, bucketCount, insertedEntryIds, visitedEntryIds: [existing.id], codeLine: 5, strategyLabel: 'increment existing frequency', note: `${value} was already present, so increment its count to ${count}.` })
    } else {
      const entry = makeEntry(value, index, 'count 1')
      buckets[bucketId].entries.push(entry)
      insertedEntryIds.push(entry.id)
      counts.set(value, entry)
      yield step({ buckets, inputKeys: numbers, activeKey: value, activeBucketId: bucketId, activeEntryId: entry.id, bucketCount, insertedEntryIds, codeLine: 7, strategyLabel: 'insert first occurrence', note: `First time seeing ${value}; start count at 1.` })
    }
  }

  yield step({ buckets, inputKeys: numbers, activeKey: null, bucketCount, insertedEntryIds, codeLine: 10, strategyLabel: 'frequency map ready', note: `Built frequency counts for ${counts.size} distinct value(s).` })
}

export function* groupAnagrams(
  values: HashValue[],
  target: HashValue,
  bucketCount = 7
): Generator<HashStep> {
  const words = toWords(values)
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []
  const groups = new Map<string, string[]>()

  yield step({ buckets, inputKeys: words, activeKey: String(target || ''), bucketCount, codeLine: 1, strategyLabel: 'map: sorted letters -> words', note: 'Group words by their sorted-letter signature.' })

  for (let index = 0; index < words.length; index++) {
    const word = words[index]
    const signature = signatureOf(word)
    const bucketId = hashText(signature, bucketCount)
    const group = [...(groups.get(signature) ?? []), word]
    groups.set(signature, group)
    const existing = buckets[bucketId].entries.find((entry) => entry.key === signature)

    if (existing) {
      existing.value = group.join(', ')
      yield step({ buckets, inputKeys: words, activeKey: word, activeBucketId: bucketId, activeEntryId: existing.id, bucketCount, insertedEntryIds, visitedEntryIds: [existing.id], codeLine: 5, strategyLabel: `signature "${signature}"`, note: `"${word}" joins the existing anagram group ${group.join(', ')}.` })
    } else {
      const entry = makeEntry(signature, index, word)
      buckets[bucketId].entries.push(entry)
      insertedEntryIds.push(entry.id)
      yield step({ buckets, inputKeys: words, activeKey: word, activeBucketId: bucketId, activeEntryId: entry.id, bucketCount, insertedEntryIds, codeLine: 7, strategyLabel: `signature "${signature}"`, note: `"${word}" starts a new anagram group.` })
    }
  }

  yield step({ buckets, inputKeys: words, activeKey: null, bucketCount, insertedEntryIds, codeLine: 10, strategyLabel: 'anagram groups ready', note: `Built ${groups.size} anagram group(s).` })
}

export function* longestConsecutive(
  values: HashValue[],
  target: HashValue,
  bucketCount = 7
): Generator<HashStep> {
  const numbers = [...new Set(toNumbers(values))]
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []
  const set = new Set(numbers)

  numbers.forEach((value, index) => {
    const bucketId = hashKey(value, bucketCount)
    const entry = makeEntry(value, index, 'in set')
    buckets[bucketId].entries.push(entry)
    insertedEntryIds.push(entry.id)
  })

  let best = 0
  yield step({ buckets, inputKeys: numbers, activeKey: toNumber(target, 0), bucketCount, insertedEntryIds, codeLine: 1, strategyLabel: 'hash set membership', note: 'Insert each distinct number into a set.' })

  for (const value of numbers) {
    if (set.has(value - 1)) {
      yield step({ buckets, inputKeys: numbers, activeKey: value, bucketCount, insertedEntryIds, codeLine: 4, strategyLabel: 'skip non-start values', note: `${value} has predecessor ${value - 1}, so it cannot start a sequence.` })
      continue
    }

    let current = value
    let length = 1
    while (set.has(current + 1)) {
      current++
      length++
    }
    best = Math.max(best, length)
    yield step({ buckets, inputKeys: numbers, activeKey: value, bucketCount, insertedEntryIds, codeLine: 8, strategyLabel: 'expand from sequence start', note: `Sequence starting at ${value} has length ${length}; best is ${best}.` })
  }

  yield step({ buckets, inputKeys: numbers, activeKey: best, bucketCount, insertedEntryIds, codeLine: 11, strategyLabel: 'longest sequence found', note: `Longest consecutive sequence length is ${best}.` })
}

export function* subarraySumEqualsK(
  values: HashValue[],
  target: HashValue,
  bucketCount = 7
): Generator<HashStep> {
  const numbers = toNumbers(values)
  const k = toNumber(target, 3)
  const buckets = createBuckets(bucketCount)
  const insertedEntryIds: string[] = []
  const prefixCounts = new Map<number, HashBucket['entries'][number]>()
  let prefix = 0
  let matches = 0

  const zeroEntry = makeEntry(0, 0, 'count 1')
  buckets[0].entries.push(zeroEntry)
  insertedEntryIds.push(zeroEntry.id)
  prefixCounts.set(0, zeroEntry)

  yield step({ buckets, inputKeys: numbers, activeKey: k, bucketCount, insertedEntryIds, codeLine: 1, strategyLabel: 'map: prefix sum -> count', note: `Start with prefix sum 0. Count subarrays with sum ${k}.` })

  for (let index = 0; index < numbers.length; index++) {
    prefix += numbers[index]
    const needed = prefix - k
    const found = prefixCounts.get(needed)
    if (found) matches += Number(found.value.replace('count ', ''))

    yield step({ buckets, inputKeys: numbers, activeKey: prefix, activeEntryId: found?.id ?? null, foundEntryId: found?.id ?? null, bucketCount, insertedEntryIds, visitedEntryIds: found ? [found.id] : [], codeLine: 5, strategyLabel: `need prefix ${needed}`, note: `After index ${index}, prefix is ${prefix}. Look for previous prefix ${needed}; matches = ${matches}.` })

    const bucketId = hashKey(prefix, bucketCount)
    const existing = prefixCounts.get(prefix)
    if (existing) {
      const count = Number(existing.value.replace('count ', '')) + 1
      existing.value = `count ${count}`
      yield step({ buckets, inputKeys: numbers, activeKey: prefix, activeBucketId: bucketId, activeEntryId: existing.id, bucketCount, insertedEntryIds, codeLine: 8, strategyLabel: 'update prefix count', note: `Increment prefix ${prefix} count to ${count}.` })
    } else {
      const entry = makeEntry(prefix, index + 1, 'count 1')
      buckets[bucketId].entries.push(entry)
      insertedEntryIds.push(entry.id)
      prefixCounts.set(prefix, entry)
      yield step({ buckets, inputKeys: numbers, activeKey: prefix, activeBucketId: bucketId, activeEntryId: entry.id, bucketCount, insertedEntryIds, codeLine: 10, strategyLabel: 'store prefix sum', note: `Store prefix sum ${prefix}.` })
    }
  }

  yield step({ buckets, inputKeys: numbers, activeKey: matches, bucketCount, insertedEntryIds, codeLine: 13, strategyLabel: 'subarray count complete', note: `Found ${matches} subarray(s) with sum ${k}.` })
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
  strategyLabel,
  codeLine,
  note
}: {
  buckets: HashBucket[]
  inputKeys: HashValue[]
  activeKey?: HashValue | null
  activeBucketId?: number | null
  activeEntryId?: string | null
  insertedEntryIds?: string[]
  visitedEntryIds?: string[]
  foundEntryId?: string | null
  bucketCount: number
  strategyLabel: string
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
    strategyLabel,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

function toNumbers(values: HashValue[]) {
  return values.map((value) => toNumber(value, 0))
}

function toNumber(value: HashValue, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toWords(values: HashValue[]) {
  const words = values.map(String).filter((value) => Number.isNaN(Number(value)))
  return words.length > 0 ? words : ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
}

function signatureOf(word: string) {
  return [...word.toLowerCase()].sort().join('')
}

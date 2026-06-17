import type { ArrayStringStep } from '@/engine/types'

export function* prefixRangeSum(
  values: number[],
  queryEnd: number,
  queryStart = 1
): Generator<ArrayStringStep> {
  const array = [...values]
  const prefix = Array(array.length + 1).fill(0) as number[]
  const left = clamp(Math.min(queryStart, queryEnd), 0, array.length - 1)
  const right = clamp(Math.max(queryStart, queryEnd), 0, array.length - 1)

  yield step({
    array,
    prefix,
    target: right,
    leftIndex: left,
    rightIndex: right,
    codeLine: 1,
    note: 'Create prefix[0] = 0 so range sums can subtract two stored totals.'
  })

  for (let index = 0; index < array.length; index++) {
    prefix[index + 1] = prefix[index] + array[index]

    yield step({
      array,
      prefix,
      target: right,
      leftIndex: index,
      rightIndex: index,
      currentSum: prefix[index + 1],
      foundIndexes: range(0, index),
      codeLine: 3,
      note: `prefix[${index + 1}] = prefix[${index}] + ${array[index]} = ${prefix[index + 1]}.`
    })
  }

  yield step({
    array,
    prefix,
    target: right,
    leftIndex: left,
    rightIndex: right,
    foundIndexes: range(left, right),
    eliminatedIndexes: range(0, left - 1),
    codeLine: 6,
    note: `Read prefix[${right + 1}] and prefix[${left}] for the requested range.`
  })

  const result = prefix[right + 1] - prefix[left]

  yield step({
    array,
    prefix,
    target: right,
    leftIndex: left,
    rightIndex: right,
    currentSum: result,
    foundIndexes: range(left, right),
    eliminatedIndexes: range(0, left - 1),
    codeLine: 7,
    note: `Range sum from index ${left} to ${right} is ${prefix[right + 1]} - ${prefix[left]} = ${result}.`
  })
}

function step({
  array,
  prefix,
  target,
  leftIndex,
  rightIndex,
  currentSum = null,
  foundIndexes = [],
  eliminatedIndexes = [],
  codeLine,
  note
}: {
  array: number[]
  prefix: number[]
  target: number
  leftIndex: number | null
  rightIndex: number | null
  currentSum?: number | null
  foundIndexes?: number[]
  eliminatedIndexes?: number[]
  codeLine: number
  note: string
}): ArrayStringStep {
  return {
    mode: 'prefixSum',
    array: [...array],
    derivedArray: [...prefix],
    target,
    leftIndex,
    rightIndex,
    currentSum,
    foundIndexes: [...foundIndexes],
    eliminatedIndexes: [...eliminatedIndexes],
    timeComplexity: 'O(n) build, O(1) query',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

function range(start: number, end: number) {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

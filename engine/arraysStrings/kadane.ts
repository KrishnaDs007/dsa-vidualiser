import type { ArrayStringStep } from '@/engine/types'

export function* kadaneMaxSubarray(values: number[]): Generator<ArrayStringStep> {
  const array = values.length > 0 ? [...values] : [4, -1, 2, -7, 5, 2, -1, 3]
  let currentSum = array[0]
  let bestSum = array[0]
  let currentStart = 0
  let bestStart = 0
  let bestEnd = 0

  yield step({
    array,
    target: bestSum,
    leftIndex: 0,
    rightIndex: 0,
    currentSum,
    foundIndexes: [0],
    codeLine: 1,
    note: `Start with ${array[0]} as both current and best subarray sum.`
  })

  for (let index = 1; index < array.length; index++) {
    const extendSum = currentSum + array[index]

    yield step({
      array,
      target: bestSum,
      leftIndex: currentStart,
      rightIndex: index,
      currentSum: extendSum,
      foundIndexes: range(bestStart, bestEnd),
      codeLine: 4,
      note: `Compare starting fresh at ${array[index]} with extending to ${extendSum}.`
    })

    if (array[index] > extendSum) {
      currentSum = array[index]
      currentStart = index

      yield step({
        array,
        target: bestSum,
        leftIndex: currentStart,
        rightIndex: index,
        currentSum,
        foundIndexes: range(bestStart, bestEnd),
        eliminatedIndexes: range(0, index - 1),
        codeLine: 5,
        note: `Starting a new subarray at index ${index} gives a better running sum.`
      })
    } else {
      currentSum = extendSum

      yield step({
        array,
        target: bestSum,
        leftIndex: currentStart,
        rightIndex: index,
        currentSum,
        foundIndexes: range(bestStart, bestEnd),
        codeLine: 7,
        note: `Extend the current subarray through index ${index}.`
      })
    }

    if (currentSum > bestSum) {
      bestSum = currentSum
      bestStart = currentStart
      bestEnd = index

      yield step({
        array,
        target: bestSum,
        leftIndex: currentStart,
        rightIndex: index,
        currentSum,
        foundIndexes: range(bestStart, bestEnd),
        codeLine: 9,
        note: `New best subarray sum is ${bestSum}.`
      })
    }
  }

  yield step({
    array,
    target: bestSum,
    leftIndex: bestStart,
    rightIndex: bestEnd,
    currentSum: bestSum,
    foundIndexes: range(bestStart, bestEnd),
    codeLine: 12,
    note: `Maximum subarray sum is ${bestSum}.`
  })
}

function step({
  array,
  target,
  leftIndex,
  rightIndex,
  currentSum,
  foundIndexes = [],
  eliminatedIndexes = [],
  codeLine,
  note
}: {
  array: number[]
  target: number
  leftIndex: number | null
  rightIndex: number | null
  currentSum: number | null
  foundIndexes?: number[]
  eliminatedIndexes?: number[]
  codeLine: number
  note: string
}): ArrayStringStep {
  return {
    mode: 'kadane',
    array: [...array],
    target,
    leftIndex,
    rightIndex,
    currentSum,
    foundIndexes: [...foundIndexes],
    eliminatedIndexes: [...eliminatedIndexes],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    codeLine,
    note
  }
}

function range(start: number, end: number) {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

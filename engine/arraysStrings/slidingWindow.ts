import type { ArrayStringStep } from '@/engine/types'

export function* slidingWindowMaxSum(
  values: number[],
  windowSize: number
): Generator<ArrayStringStep> {
  const array = [...values]
  const size = Math.max(1, Math.min(windowSize, array.length))
  let currentSum = 0
  let bestSum = Number.NEGATIVE_INFINITY
  let bestStart = 0

  yield step({
    array,
    target: size,
    leftIndex: 0,
    rightIndex: size - 1,
    currentSum,
    codeLine: 1,
    note: `Use a fixed window size of ${size}.`
  })

  for (let index = 0; index < array.length; index++) {
    currentSum += array[index]

    yield step({
      array,
      target: size,
      leftIndex: Math.max(0, index - size + 1),
      rightIndex: index,
      currentSum,
      codeLine: 4,
      note: `Add ${array[index]} to the current window sum.`
    })

    if (index >= size - 1) {
      const start = index - size + 1

      if (currentSum > bestSum) {
        bestSum = currentSum
        bestStart = start

        yield step({
          array,
          target: size,
          leftIndex: start,
          rightIndex: index,
          currentSum,
          foundIndexes: range(bestStart, bestStart + size - 1),
          eliminatedIndexes: range(0, start - 1),
          codeLine: 6,
          note: `New best window sum is ${bestSum}.`
        })
      }

      currentSum -= array[start]

      yield step({
        array,
        target: size,
        leftIndex: start + 1,
        rightIndex: index,
        currentSum,
        foundIndexes: range(bestStart, bestStart + size - 1),
        eliminatedIndexes: range(0, start),
        codeLine: 8,
        note: `Remove ${array[start]} before sliding the window right.`
      })
    }
  }

  yield step({
    array,
    target: size,
    leftIndex: bestStart,
    rightIndex: bestStart + size - 1,
    currentSum: bestSum,
    foundIndexes: range(bestStart, bestStart + size - 1),
    eliminatedIndexes: [],
    codeLine: 11,
    note: `Best fixed-size window sum is ${bestSum}.`
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
    mode: 'slidingWindow',
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

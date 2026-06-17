import type { ArrayStringStep } from '@/engine/types'

export function* twoPointerTwoSum(
  values: number[],
  target: number
): Generator<ArrayStringStep> {
  const array = [...values].sort((a, b) => a - b)
  let left = 0
  let right = array.length - 1
  const eliminatedIndexes: number[] = []

  yield step({
    array,
    target,
    leftIndex: left,
    rightIndex: right,
    eliminatedIndexes,
    codeLine: 1,
    note: 'Sort the values, then place one pointer at each end.'
  })

  while (left < right) {
    const currentSum = array[left] + array[right]

    yield step({
      array,
      target,
      leftIndex: left,
      rightIndex: right,
      currentSum,
      eliminatedIndexes,
      codeLine: 4,
      note: `Compare ${array[left]} + ${array[right]} = ${currentSum}.`
    })

    if (currentSum === target) {
      yield step({
        array,
        target,
        leftIndex: left,
        rightIndex: right,
        currentSum,
        foundIndexes: [left, right],
        eliminatedIndexes,
        codeLine: 5,
        note: `Found pair ${array[left]} and ${array[right]} for target ${target}.`
      })
      return
    }

    if (currentSum < target) {
      eliminatedIndexes.push(left)
      left++
      yield step({
        array,
        target,
        leftIndex: left,
        rightIndex: right,
        currentSum,
        eliminatedIndexes,
        codeLine: 7,
        note: 'Sum is too small, so move the left pointer right to increase it.'
      })
    } else {
      eliminatedIndexes.push(right)
      right--
      yield step({
        array,
        target,
        leftIndex: left,
        rightIndex: right,
        currentSum,
        eliminatedIndexes,
        codeLine: 9,
        note: 'Sum is too large, so move the right pointer left to decrease it.'
      })
    }
  }

  yield step({
    array,
    target,
    leftIndex: left,
    rightIndex: right,
    eliminatedIndexes,
    codeLine: 12,
    note: `No pair sums to ${target}.`
  })
}

function step({
  array,
  target,
  leftIndex = null,
  rightIndex = null,
  currentSum = null,
  foundIndexes = [],
  eliminatedIndexes,
  codeLine,
  note
}: {
  array: number[]
  target: number
  leftIndex?: number | null
  rightIndex?: number | null
  currentSum?: number | null
  foundIndexes?: number[]
  eliminatedIndexes: number[]
  codeLine: number
  note: string
}): ArrayStringStep {
  return {
    mode: 'twoPointers',
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

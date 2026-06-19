import type { ArrayStringStep } from '@/engine/types'

const DEFAULT_MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

export function* matrixTraversal(values: number[]): Generator<ArrayStringStep> {
  const matrix = buildMatrix(values)
  const array = matrix.flat()
  const visited: number[] = []
  let runningTotal = 0

  yield step({
    array,
    target: matrix.length * matrix[0].length,
    leftIndex: 0,
    rightIndex: matrix[0].length - 1,
    currentSum: 0,
    foundIndexes: [],
    codeLine: 1,
    note: `Traverse a ${matrix.length} x ${matrix[0].length} matrix row by row.`
  })

  for (let row = 0; row < matrix.length; row++) {
    yield step({
      array,
      target: matrix.length * matrix[0].length,
      leftIndex: row * matrix[0].length,
      rightIndex: row * matrix[0].length + matrix[0].length - 1,
      currentSum: runningTotal,
      foundIndexes: visited,
      codeLine: 2,
      note: `Enter row ${row}.`
    })

    for (let col = 0; col < matrix[row].length; col++) {
      const flatIndex = row * matrix[row].length + col
      runningTotal += matrix[row][col]
      visited.push(flatIndex)

      yield step({
        array,
        target: matrix.length * matrix[0].length,
        leftIndex: flatIndex,
        rightIndex: flatIndex,
        currentSum: runningTotal,
        foundIndexes: visited,
        codeLine: 4,
        note: `Visit matrix[${row}][${col}] = ${matrix[row][col]}.`
      })
    }
  }

  yield step({
    array,
    target: matrix.length * matrix[0].length,
    leftIndex: null,
    rightIndex: null,
    currentSum: runningTotal,
    foundIndexes: visited,
    codeLine: 7,
    note: `Visited all ${visited.length} cells with total ${runningTotal}.`
  })
}

function step({
  array,
  target,
  leftIndex,
  rightIndex,
  currentSum,
  foundIndexes,
  codeLine,
  note
}: {
  array: number[]
  target: number
  leftIndex: number | null
  rightIndex: number | null
  currentSum: number | null
  foundIndexes: number[]
  codeLine: number
  note: string
}): ArrayStringStep {
  return {
    mode: 'matrixTraversal',
    array: [...array],
    target,
    leftIndex,
    rightIndex,
    currentSum,
    foundIndexes: [...foundIndexes],
    eliminatedIndexes: [],
    timeComplexity: `O(${foundIndexes.length || 1})`,
    spaceComplexity: 'O(1)',
    codeLine,
    note
  }
}

function buildMatrix(values: number[]) {
  if (values.length < 9) return DEFAULT_MATRIX
  return [
    values.slice(0, 3),
    values.slice(3, 6),
    values.slice(6, 9)
  ]
}

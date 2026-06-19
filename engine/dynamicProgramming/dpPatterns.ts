import type { DpCell, DpStep } from '@/engine/types'

export function* knapsack01Dp(size: number): Generator<DpStep> {
  const capacity = clampSize(size, 8)
  const items = [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 }
  ]
  const rows = items.length + 1
  const cols = capacity + 1
  const table = Array.from({ length: rows }, () => Array(cols).fill(0) as number[])
  const completed = new Set<string>()

  yield snapshot(tableCells(table), null, [], completed, '', 'O(items * capacity)', 'O(items * capacity)', 1, `Solve 0/1 Knapsack for capacity ${capacity}.`)

  for (let item = 1; item <= items.length; item++) {
    for (let cap = 0; cap <= capacity; cap++) {
      const current = items[item - 1]
      const without = table[item - 1][cap]
      const withItem =
        current.weight <= cap
          ? current.value + table[item - 1][cap - current.weight]
          : Number.NEGATIVE_INFINITY
      table[item][cap] = Math.max(without, withItem)
      completed.add(gridId(item, cap))

      const dependencies = [gridId(item - 1, cap)]
      if (current.weight <= cap) dependencies.push(gridId(item - 1, cap - current.weight))

      yield snapshot(
        tableCells(table),
        gridId(item, cap),
        dependencies,
        completed,
        String(table[item][cap]),
        `O(${item} * ${cap + 1})`,
        'O(items * capacity)',
        current.weight <= cap ? 6 : 4,
        current.weight <= cap
          ? `Choose max of skipping item ${item} or taking it at capacity ${cap}.`
          : `Item ${item} is too heavy for capacity ${cap}, so skip it.`
      )
    }
  }

  yield snapshot(tableCells(table), null, [], completed, String(table[items.length][capacity]), 'O(items * capacity)', 'O(items * capacity)', 9, `Best value is ${table[items.length][capacity]}.`)
}

export function* longestCommonSubsequenceDp(size: number): Generator<DpStep> {
  const left = 'ABCD'.slice(0, Math.min(4, clampSize(size, 4)))
  const right = 'ACBD'
  const rows = left.length + 1
  const cols = right.length + 1
  const table = Array.from({ length: rows }, () => Array(cols).fill(0) as number[])
  const completed = new Set<string>()

  yield snapshot(tableCells(table, left, right), null, [], completed, '', 'O(n * m)', 'O(n * m)', 1, `Find LCS length for "${left}" and "${right}".`)

  for (let row = 1; row <= left.length; row++) {
    for (let col = 1; col <= right.length; col++) {
      if (left[row - 1] === right[col - 1]) {
        table[row][col] = table[row - 1][col - 1] + 1
        yield snapshot(
          tableCells(table, left, right),
          gridId(row, col),
          [gridId(row - 1, col - 1)],
          completed.add(gridId(row, col)),
          String(table[row][col]),
          `O(${row} * ${col})`,
          'O(n * m)',
          5,
          `"${left[row - 1]}" matches, so extend the diagonal subsequence.`
        )
      } else {
        table[row][col] = Math.max(table[row - 1][col], table[row][col - 1])
        yield snapshot(
          tableCells(table, left, right),
          gridId(row, col),
          [gridId(row - 1, col), gridId(row, col - 1)],
          completed.add(gridId(row, col)),
          String(table[row][col]),
          `O(${row} * ${col})`,
          'O(n * m)',
          7,
          `Characters differ, so keep the best top or left value.`
        )
      }
    }
  }

  yield snapshot(tableCells(table, left, right), null, [], completed, String(table[left.length][right.length]), 'O(n * m)', 'O(n * m)', 10, `LCS length is ${table[left.length][right.length]}.`)
}

export function* longestIncreasingSubsequenceDp(size: number): Generator<DpStep> {
  const values = [10, 9, 2, 5, 3, 7, 101, 18].slice(0, clampSize(size, 8))
  const tails: number[] = []
  const completed = new Set<string>()

  yield snapshot(tailCells(values, tails), null, [], completed, '', 'O(n log n)', 'O(n)', 1, 'Use binary search over tails for LIS length.')

  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    let left = 0
    let right = tails.length

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      yield snapshot(tailCells(values, tails), tailId(mid), [inputId(index)], completed, String(tails.length), `O(${index + 1} log n)`, 'O(n)', 5, `Compare ${value} with tail ${tails[mid]}.`)
      if (tails[mid] < value) left = mid + 1
      else right = mid
    }

    tails[left] = value
    completed.add(tailId(left))

    yield snapshot(
      tailCells(values, tails),
      tailId(left),
      [inputId(index)],
      completed,
      String(tails.length),
      `O(${index + 1} log n)`,
      'O(n)',
      8,
      `Place ${value} at tails[${left}]. LIS length is ${tails.length}.`
    )
  }

  yield snapshot(tailCells(values, tails), null, [], completed, String(tails.length), 'O(n log n)', 'O(n)', 10, `LIS length is ${tails.length}.`)
}

function snapshot(
  cells: DpCell[],
  activeCellId: string | null,
  dependencyCellIds: string[],
  completed: Set<string>,
  result: string,
  timeComplexity: string,
  spaceComplexity: string,
  codeLine: number,
  note: string
): DpStep {
  return {
    cells,
    activeCellId,
    dependencyCellIds,
    completedCellIds: [...completed],
    result,
    timeComplexity,
    spaceComplexity,
    codeLine,
    note
  }
}

function tableCells(table: number[][], left = '', right = ''): DpCell[] {
  return table.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => ({
      id: gridId(rowIndex, colIndex),
      label:
        left || right
          ? `${left[rowIndex - 1] ?? '-'}:${right[colIndex - 1] ?? '-'}`
          : `${rowIndex},${colIndex}`,
      value: String(value)
    }))
  )
}

function tailCells(values: number[], tails: number[]): DpCell[] {
  return [
    ...values.map((value, index) => ({
      id: inputId(index),
      label: `a${index}`,
      value: String(value)
    })),
    ...tails.map((value, index) => ({
      id: tailId(index),
      label: `t${index}`,
      value: String(value)
    }))
  ]
}

function gridId(row: number, col: number) {
  return `cell-${row}-${col}`
}

function inputId(index: number) {
  return `input-${index}`
}

function tailId(index: number) {
  return `tail-${index}`
}

function clampSize(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(Math.max(Math.floor(value), 2), 12)
}

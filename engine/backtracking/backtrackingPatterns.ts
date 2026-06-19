import type { BacktrackingCell, BacktrackingStep } from '@/engine/types'

export function* subsetsBacktracking(): Generator<BacktrackingStep> {
  const values = ['1', '2', '3']
  const path: string[] = []
  const results: string[] = []

  yield step(values, path, results, null, [], 'O(2^n)', 'O(n)', 1, 'Start with an empty subset path.')

  function* dfs(index: number): Generator<BacktrackingStep> {
    if (index === values.length) {
      results.push(`[${path.join(', ')}]`)
      yield step(values, path, results, null, [], 'O(2^n)', 'O(n)', 3, `Record subset [${path.join(', ')}].`)
      return
    }

    const value = values[index]
    yield step(values, path, results, value, [], `O(2^${index + 1})`, 'O(n)', 5, `Choose whether to include ${value}.`)
    path.push(value)
    yield step(values, path, results, value, [], `O(2^${index + 1})`, 'O(n)', 6, `Include ${value}.`)
    yield* dfs(index + 1)
    path.pop()
    yield step(values, path, results, value, [value], `O(2^${index + 1})`, 'O(n)', 8, `Backtrack and exclude ${value}.`)
    yield* dfs(index + 1)
  }

  yield* dfs(0)
  yield step(values, path, results, null, [], 'O(2^n)', 'O(n)', 11, `Generated ${results.length} subsets.`)
}

export function* permutationsBacktracking(): Generator<BacktrackingStep> {
  const values = ['1', '2', '3']
  const path: string[] = []
  const used = new Set<string>()
  const results: string[] = []

  yield step(values, path, results, null, [], 'O(n!)', 'O(n)', 1, 'Build each ordering by choosing unused values.')

  function* dfs(): Generator<BacktrackingStep> {
    if (path.length === values.length) {
      results.push(`[${path.join(', ')}]`)
      yield step(values, path, results, null, [], 'O(n!)', 'O(n)', 3, `Record permutation [${path.join(', ')}].`)
      return
    }

    for (const value of values) {
      if (used.has(value)) {
        yield step(values, path, results, value, [value], 'O(n!)', 'O(n)', 6, `${value} is already used in this path.`)
        continue
      }
      used.add(value)
      path.push(value)
      yield step(values, path, results, value, [], 'O(n!)', 'O(n)', 8, `Choose ${value}.`)
      yield* dfs()
      path.pop()
      used.delete(value)
      yield step(values, path, results, value, [value], 'O(n!)', 'O(n)', 10, `Backtrack after ${value}.`)
    }
  }

  yield* dfs()
  yield step(values, path, results, null, [], 'O(n!)', 'O(n)', 13, `Generated ${results.length} permutations.`)
}

export function* combinationsBacktracking(): Generator<BacktrackingStep> {
  const values = ['1', '2', '3', '4']
  const path: string[] = []
  const results: string[] = []
  const targetLength = 2

  yield step(values, path, results, null, [], 'O(C(n,k))', 'O(k)', 1, `Choose combinations of length ${targetLength}.`)

  function* dfs(start: number): Generator<BacktrackingStep> {
    if (path.length === targetLength) {
      results.push(`[${path.join(', ')}]`)
      yield step(values, path, results, null, [], 'O(C(n,k))', 'O(k)', 3, `Record combination [${path.join(', ')}].`)
      return
    }

    for (let index = start; index < values.length; index++) {
      const value = values[index]
      path.push(value)
      yield step(values, path, results, value, [], 'O(C(n,k))', 'O(k)', 7, `Choose ${value} and move the start index forward.`)
      yield* dfs(index + 1)
      path.pop()
      yield step(values, path, results, value, [value], 'O(C(n,k))', 'O(k)', 9, `Backtrack from ${value}.`)
    }
  }

  yield* dfs(0)
  yield step(values, path, results, null, [], 'O(C(n,k))', 'O(k)', 12, `Generated ${results.length} combinations.`)
}

export function* nQueensBacktracking(): Generator<BacktrackingStep> {
  const size = 4
  const queens: Array<[number, number]> = []
  const results: string[] = []

  yield boardStep(size, queens, null, results, 'O(n!)', 'O(n)', 1, 'Place one queen in each row.')

  function* dfs(row: number): Generator<BacktrackingStep> {
    if (row === size) {
      results.push(queens.map(([, col]) => col + 1).join('-'))
      yield boardStep(size, queens, null, results, 'O(n!)', 'O(n)', 3, 'Record a valid queen placement.')
      return
    }

    for (let col = 0; col < size; col++) {
      const active: [number, number] = [row, col]
      yield boardStep(size, queens, active, results, 'O(n!)', 'O(n)', 6, `Try row ${row + 1}, column ${col + 1}.`)
      if (!isSafeQueen(queens, row, col)) {
        yield boardStep(size, queens, active, results, 'O(n!)', 'O(n)', 7, 'Reject this square because a queen attacks it.', true)
        continue
      }
      queens.push(active)
      yield boardStep(size, queens, active, results, 'O(n!)', 'O(n)', 9, `Place queen at row ${row + 1}, column ${col + 1}.`)
      yield* dfs(row + 1)
      queens.pop()
      yield boardStep(size, queens, active, results, 'O(n!)', 'O(n)', 11, 'Remove queen and try the next column.')
    }
  }

  yield* dfs(0)
  yield boardStep(size, queens, null, results, 'O(n!)', 'O(n)', 14, `Found ${results.length} solutions for 4-Queens.`)
}

export function* sudokuSolverBacktracking(): Generator<BacktrackingStep> {
  const size = 4
  const board = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [0, 1, 2, 0],
    [2, 0, 0, 1]
  ]
  const fixed = new Set<string>()
  board.forEach((row, rowIndex) =>
    row.forEach((value, colIndex) => {
      if (value !== 0) fixed.add(`${rowIndex}-${colIndex}`)
    })
  )
  const results: string[] = []

  yield sudokuStep(board, fixed, null, results, 'O(4^empty)', 'O(empty)', 1, 'Solve a compact 4 x 4 Sudoku board.')

  function* dfs(): Generator<BacktrackingStep, boolean> {
    const empty = findEmpty(board)
    if (!empty) {
      results.push('Solved')
      yield sudokuStep(board, fixed, null, results, 'O(4^empty)', 'O(empty)', 3, 'All cells are filled legally.')
      return true
    }

    const [row, col] = empty
    for (let value = 1; value <= size; value++) {
      yield sudokuStep(board, fixed, [row, col], results, 'O(4^empty)', 'O(empty)', 6, `Try ${value} at row ${row + 1}, column ${col + 1}.`)
      if (!isSafeSudoku(board, row, col, value)) {
        yield sudokuStep(board, fixed, [row, col], results, 'O(4^empty)', 'O(empty)', 7, `${value} conflicts with row, column, or box.`, true)
        continue
      }
      board[row][col] = value
      yield sudokuStep(board, fixed, [row, col], results, 'O(4^empty)', 'O(empty)', 9, `Place ${value}.`)
      if (yield* dfs()) return true
      board[row][col] = 0
      yield sudokuStep(board, fixed, [row, col], results, 'O(4^empty)', 'O(empty)', 11, `Backtrack from ${value}.`)
    }

    return false
  }

  yield* dfs()
  yield sudokuStep(board, fixed, null, results, 'O(4^empty)', 'O(empty)', 14, results.length ? 'Sudoku solved.' : 'No solution exists.')
}

function step(
  choices: string[],
  path: string[],
  results: string[],
  activeChoice: string | null,
  rejectedChoices: string[],
  timeComplexity: string,
  spaceComplexity: string,
  codeLine: number,
  note: string
): BacktrackingStep {
  return {
    choices,
    path: [...path],
    results: [...results],
    activeChoice,
    rejectedChoices,
    result: results.at(-1),
    timeComplexity,
    spaceComplexity,
    codeLine,
    note
  }
}

function boardStep(
  size: number,
  queens: Array<[number, number]>,
  active: [number, number] | null,
  results: string[],
  timeComplexity: string,
  spaceComplexity: string,
  codeLine: number,
  note: string,
  rejected = false
): BacktrackingStep {
  const queenIds = new Set(queens.map(([row, col]) => `${row}-${col}`))
  const activeId = active ? `${active[0]}-${active[1]}` : null

  return {
    choices: Array.from({ length: size }, (_, index) => `col ${index + 1}`),
    path: queens.map(([row, col]) => `R${row + 1}C${col + 1}`),
    results: [...results],
    activeChoice: activeId,
    rejectedChoices: rejected && activeId ? [activeId] : [],
    board: grid(size, (row, col) => ({
      id: `${row}-${col}`,
      label: `${row + 1},${col + 1}`,
      value: queenIds.has(`${row}-${col}`) ? 'Q' : '',
      state:
        activeId === `${row}-${col}`
          ? rejected
            ? 'rejected'
            : 'active'
          : queenIds.has(`${row}-${col}`)
            ? 'chosen'
            : 'empty'
    })),
    boardSize: size,
    result: results.at(-1),
    timeComplexity,
    spaceComplexity,
    codeLine,
    note
  }
}

function sudokuStep(
  board: number[][],
  fixed: Set<string>,
  active: [number, number] | null,
  results: string[],
  timeComplexity: string,
  spaceComplexity: string,
  codeLine: number,
  note: string,
  rejected = false
): BacktrackingStep {
  const activeId = active ? `${active[0]}-${active[1]}` : null

  return {
    choices: ['1', '2', '3', '4'],
    path: board.flat().filter(Boolean).map(String),
    results: [...results],
    activeChoice: activeId,
    rejectedChoices: rejected && activeId ? [activeId] : [],
    board: grid(board.length, (row, col) => {
      const id = `${row}-${col}`
      return {
        id,
        label: `${row + 1},${col + 1}`,
        value: board[row][col] === 0 ? '' : String(board[row][col]),
        state:
          activeId === id
            ? rejected
              ? 'rejected'
              : 'active'
            : fixed.has(id)
              ? 'fixed'
              : board[row][col] !== 0
                ? 'chosen'
                : 'empty'
      }
    }),
    boardSize: board.length,
    result: results.at(-1),
    timeComplexity,
    spaceComplexity,
    codeLine,
    note
  }
}

function grid(size: number, getCell: (row: number, col: number) => BacktrackingCell) {
  return Array.from({ length: size * size }, (_, index) =>
    getCell(Math.floor(index / size), index % size)
  )
}

function isSafeQueen(queens: Array<[number, number]>, row: number, col: number) {
  return queens.every(
    ([queenRow, queenCol]) =>
      queenCol !== col && Math.abs(queenRow - row) !== Math.abs(queenCol - col)
  )
}

function findEmpty(board: number[][]): [number, number] | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) return [row, col]
    }
  }
  return null
}

function isSafeSudoku(board: number[][], row: number, col: number, value: number) {
  const boxSize = 2
  for (let index = 0; index < board.length; index++) {
    if (board[row][index] === value || board[index][col] === value) return false
  }
  const startRow = Math.floor(row / boxSize) * boxSize
  const startCol = Math.floor(col / boxSize) * boxSize
  for (let rowOffset = 0; rowOffset < boxSize; rowOffset++) {
    for (let colOffset = 0; colOffset < boxSize; colOffset++) {
      if (board[startRow + rowOffset][startCol + colOffset] === value) return false
    }
  }
  return true
}

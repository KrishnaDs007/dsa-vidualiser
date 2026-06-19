import {
  combinationsBacktracking,
  nQueensBacktracking,
  permutationsBacktracking,
  subsetsBacktracking,
  sudokuSolverBacktracking
} from '@/engine/backtracking/backtrackingPatterns'

export const BACKTRACKING_ALGORITHMS = {
  subsets: {
    id: 'subsets',
    label: 'Subsets',
    complexity: 'O(2^n) time / O(n) space',
    run: subsetsBacktracking
  },
  permutations: {
    id: 'permutations',
    label: 'Permutations',
    complexity: 'O(n!) time / O(n) space',
    run: permutationsBacktracking
  },
  combinations: {
    id: 'combinations',
    label: 'Combinations',
    complexity: 'O(C(n,k)) time / O(k) space',
    run: combinationsBacktracking
  },
  nQueens: {
    id: 'nQueens',
    label: 'N-Queens',
    complexity: 'O(n!) time / O(n) space',
    run: nQueensBacktracking
  },
  sudoku: {
    id: 'sudoku',
    label: 'Sudoku Solver',
    complexity: 'O(4^empty) time / O(empty) space',
    run: sudokuSolverBacktracking
  }
} as const

export type BacktrackingAlgorithmId = keyof typeof BACKTRACKING_ALGORITHMS

export function isBacktrackingAlgorithmId(
  value?: string
): value is BacktrackingAlgorithmId {
  return Boolean(value && value in BACKTRACKING_ALGORITHMS)
}

export const BACKTRACKING_PSEUDOCODE: Record<BacktrackingAlgorithmId, string> = {
  subsets: `function subsets(values: number[]) {
  const result = []
  function dfs(index: number, path: number[]) {
    if (index === values.length) result.push([...path])
    path.push(values[index])
    dfs(index + 1, path)
    path.pop()
    dfs(index + 1, path)
  }
  dfs(0, [])
  return result
}`,
  permutations: `function permutations(values: number[]) {
  const result = []
  function dfs(path: number[], used: Set<number>) {
    if (path.length === values.length) result.push([...path])
    for (const value of values) {
      if (used.has(value)) continue
      used.add(value)
      path.push(value)
      dfs(path, used)
      path.pop()
      used.delete(value)
    }
  }
  return result
}`,
  combinations: `function combinations(values: number[], k: number) {
  const result = []
  function dfs(start: number, path: number[]) {
    if (path.length === k) result.push([...path])
    for (let index = start; index < values.length; index++) {
      path.push(values[index])
      dfs(index + 1, path)
      path.pop()
    }
  }
  return result
}`,
  nQueens: `function nQueens(size: number) {
  const queens = []
  function dfs(row: number) {
    if (row === size) return recordSolution()
    for (let col = 0; col < size; col++) {
      if (!isSafe(row, col, queens)) continue
      queens.push([row, col])
      dfs(row + 1)
      queens.pop()
    }
  }
}`,
  sudoku: `function solveSudoku(board: number[][]) {
  const empty = findEmpty(board)
  if (!empty) return true
  for (const value of [1, 2, 3, 4]) {
    if (!isSafe(board, empty, value)) continue
    board[empty.row][empty.col] = value
    if (solveSudoku(board)) return true
    board[empty.row][empty.col] = 0
  }
  return false
}`
}

import type { DpCell, DpStep } from '@/engine/types'

export function* fibonacciDp(size: number): Generator<DpStep> {
  const n = normalizeSize(size, 10)
  const values = Array.from({ length: n + 1 }, () => 0)
  const completed = new Set<string>()

  yield snapshot(values, null, [], completed, '', 'O(n)', 'O(n)', 1, `Build Fibonacci up to F(${n}).`)

  values[0] = 0
  completed.add(cellId(0))
  yield snapshot(values, cellId(0), [], completed, '0', 'O(1)', 'O(n)', 3, 'Base case F(0) = 0.')

  if (n >= 1) {
    values[1] = 1
    completed.add(cellId(1))
    yield snapshot(values, cellId(1), [], completed, '1', 'O(1)', 'O(n)', 4, 'Base case F(1) = 1.')
  }

  for (let index = 2; index <= n; index++) {
    values[index] = values[index - 1] + values[index - 2]
    completed.add(cellId(index))

    yield snapshot(
      values,
      cellId(index),
      [cellId(index - 1), cellId(index - 2)],
      completed,
      String(values[index]),
      `O(${index})`,
      'O(n)',
      6,
      `F(${index}) = F(${index - 1}) + F(${index - 2}).`
    )
  }

  yield snapshot(values, null, [], completed, String(values[n]), 'O(n)', 'O(n)', 8, `Result is F(${n}) = ${values[n]}.`)
}

export function* climbingStairsDp(size: number): Generator<DpStep> {
  const n = normalizeSize(size, 8)
  const values = Array.from({ length: n + 1 }, () => 0)
  const completed = new Set<string>()

  yield snapshot(values, null, [], completed, '', 'O(n)', 'O(n)', 1, `Count ways to climb ${n} stairs.`)

  values[0] = 1
  completed.add(cellId(0))
  yield snapshot(values, cellId(0), [], completed, '1', 'O(1)', 'O(n)', 3, 'There is one way to stand at step 0.')

  for (let index = 1; index <= n; index++) {
    const oneStep = values[index - 1]
    const twoStep = index >= 2 ? values[index - 2] : 0
    values[index] = oneStep + twoStep
    completed.add(cellId(index))

    yield snapshot(
      values,
      cellId(index),
      index >= 2 ? [cellId(index - 1), cellId(index - 2)] : [cellId(index - 1)],
      completed,
      String(values[index]),
      `O(${index})`,
      'O(n)',
      6,
      `Ways(${index}) = Ways(${index - 1}) + Ways(${index - 2}).`
    )
  }

  yield snapshot(values, null, [], completed, String(values[n]), 'O(n)', 'O(n)', 8, `Result is ${values[n]} ways.`)
}

export function* coinChangeDp(amountInput: number): Generator<DpStep> {
  const amount = normalizeSize(amountInput, 11)
  const coins = [1, 3, 4]
  const values = Array.from({ length: amount + 1 }, () => Infinity)
  const completed = new Set<string>()
  values[0] = 0

  yield snapshot(values, cellId(0), [], new Set([cellId(0)]), '0', 'O(amount * coins)', 'O(amount)', 1, `Find minimum coins for amount ${amount}.`)

  for (const coin of coins) {
    for (let current = coin; current <= amount; current++) {
      const previous = values[current - coin]
      if (Number.isFinite(previous)) {
        values[current] = Math.min(values[current], previous + 1)
      }
      completed.add(cellId(current))

      yield snapshot(
        values,
        cellId(current),
        [cellId(current - coin)],
        completed,
        formatValue(values[current]),
        `O(${coin} * ${current})`,
        'O(amount)',
        6,
        `Try coin ${coin} for amount ${current}.`
      )
    }
  }

  yield snapshot(
    values,
    null,
    [],
    completed,
    formatValue(values[amount]),
    'O(amount * coins)',
    'O(amount)',
    9,
    `Minimum coins for ${amount} is ${formatValue(values[amount])}.`
  )
}

export const DP_ALGORITHMS = {
  fibonacci: {
    id: 'fibonacci',
    label: 'Fibonacci',
    complexity: 'O(n)',
    defaultSize: 10,
    run: fibonacciDp
  },
  climbing: {
    id: 'climbing',
    label: 'Climbing Stairs',
    complexity: 'O(n)',
    defaultSize: 8,
    run: climbingStairsDp
  },
  coinChange: {
    id: 'coinChange',
    label: 'Coin Change',
    complexity: 'O(amount * coins)',
    defaultSize: 11,
    run: coinChangeDp
  }
} as const

export type DpAlgorithmId = keyof typeof DP_ALGORITHMS

export function isDpAlgorithmId(value?: string): value is DpAlgorithmId {
  return Boolean(value && value in DP_ALGORITHMS)
}

export const DP_PSEUDOCODE: Record<DpAlgorithmId, string> = {
  fibonacci: `function fibonacci(n: number) {
  const dp = Array(n + 1).fill(0)
  dp[0] = 0
  dp[1] = 1
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}`,
  climbing: `function climbStairs(n: number) {
  const dp = Array(n + 1).fill(0)
  dp[0] = 1
  for (let i = 1; i <= n; i++) {
    const twoBack = i >= 2 ? dp[i - 2] : 0
    dp[i] = dp[i - 1] + twoBack
  }
  return dp[n]
}`,
  coinChange: `function coinChange(coins: number[], amount: number) {
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (const coin of coins) {
    for (let current = coin; current <= amount; current++) {
      dp[current] = Math.min(dp[current], dp[current - coin] + 1)
    }
  }
  return dp[amount]
}`
}

function snapshot(
  values: number[],
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
    cells: values.map((value, index) => ({
      id: cellId(index),
      label: String(index),
      value: formatValue(value)
    })),
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

function normalizeSize(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(Math.max(Math.floor(value), 2), 20)
}

function cellId(index: number) {
  return `cell-${index}`
}

function formatValue(value: number) {
  return Number.isFinite(value) ? String(value) : 'inf'
}

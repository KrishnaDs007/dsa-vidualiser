import { stackPeek } from '@/engine/stacks/stackPeek'
import { stackPop } from '@/engine/stacks/stackPop'
import { stackPush } from '@/engine/stacks/stackPush'

export const STACK_ALGORITHMS = {
  push: {
    id: 'push',
    label: 'Stack Push',
    complexity: 'O(1) per operation',
    run: stackPush
  },
  pop: {
    id: 'pop',
    label: 'Stack Pop',
    complexity: 'O(1) per operation',
    run: stackPop
  },
  peek: {
    id: 'peek',
    label: 'Stack Peek',
    complexity: 'O(1)',
    run: stackPeek
  }
} as const

export type StackAlgorithmId = keyof typeof STACK_ALGORITHMS

export function isStackAlgorithmId(value?: string): value is StackAlgorithmId {
  return Boolean(value && value in STACK_ALGORITHMS)
}

export const STACK_PSEUDOCODE: Record<StackAlgorithmId, string> = {
  push: `function pushAll(values: number[]) {
  const stack = []
  for (const value of values) {
    stack.push(value)
  }
  return stack
}`,
  pop: `function popAll(stack: number[]) {
  while (stack.length > 0) {
    const top = stack[stack.length - 1]
    stack.pop()
  }
  return stack
}`,
  peek: `function peek(stack: number[]) {
  if (stack.length === 0) return null
  return stack[stack.length - 1]
}`
}

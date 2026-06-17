import { stackPeek } from '@/engine/stacks/stackPeek'
import {
  dailyTemperatures,
  nextGreaterElement,
  validParentheses
} from '@/engine/stacks/stackPatterns'
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
  },
  validParentheses: {
    id: 'validParentheses',
    label: 'Valid Parentheses',
    complexity: 'O(n) time / O(n) space',
    run: validParentheses
  },
  nextGreater: {
    id: 'nextGreater',
    label: 'Next Greater Element',
    complexity: 'O(n) time / O(n) space',
    run: nextGreaterElement
  },
  dailyTemperatures: {
    id: 'dailyTemperatures',
    label: 'Daily Temperatures',
    complexity: 'O(n) time / O(n) space',
    run: dailyTemperatures
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
}`,
  validParentheses: `function isValid(text: string) {
  const stack = []
  const pairs = { ')': '(', ']': '[', '}': '{' }
  for (const char of text) {
    if ('([{'.includes(char)) stack.push(char)
    else if (stack.pop() !== pairs[char]) return false
  }
  return stack.length === 0
}`,
  nextGreater: `function nextGreater(values: number[]) {
  const stack = []
  const answer = Array(values.length).fill(-1)
  for (let i = 0; i < values.length; i++) {
    while (stack.length && values[stack.at(-1)] < values[i]) {
      answer[stack.pop()] = values[i]
    }
    stack.push(i)
  }
  return answer
}`,
  dailyTemperatures: `function dailyTemperatures(values: number[]) {
  const stack = []
  const waits = Array(values.length).fill(0)
  for (let day = 0; day < values.length; day++) {
    while (stack.length && values[stack.at(-1)] < values[day]) {
      const previous = stack.pop()
      waits[previous] = day - previous
    }
    stack.push(day)
  }
  return waits
}`
}

import { queueDequeue } from '@/engine/queues/queueDequeue'
import { queueEnqueue } from '@/engine/queues/queueEnqueue'
import {
  queueUsingStacks,
  slidingWindowMaximum
} from '@/engine/queues/queuePatterns'
import { queuePeek } from '@/engine/queues/queuePeek'

export const QUEUE_ALGORITHMS = {
  enqueue: {
    id: 'enqueue',
    label: 'Queue Enqueue',
    complexity: 'O(1) per operation',
    run: queueEnqueue
  },
  dequeue: {
    id: 'dequeue',
    label: 'Queue Dequeue',
    complexity: 'O(1) per operation',
    run: queueDequeue
  },
  peek: {
    id: 'peek',
    label: 'Queue Peek',
    complexity: 'O(1)',
    run: queuePeek
  },
  slidingWindowMaximum: {
    id: 'slidingWindowMaximum',
    label: 'Sliding Window Maximum',
    complexity: 'O(n) time / O(n) space',
    run: slidingWindowMaximum
  },
  queueUsingStacks: {
    id: 'queueUsingStacks',
    label: 'Queue Using Stacks',
    complexity: 'Amortized O(1) per operation',
    run: queueUsingStacks
  }
} as const

export type QueueAlgorithmId = keyof typeof QUEUE_ALGORITHMS

export function isQueueAlgorithmId(value?: string): value is QueueAlgorithmId {
  return Boolean(value && value in QUEUE_ALGORITHMS)
}

export const QUEUE_PSEUDOCODE: Record<QueueAlgorithmId, string> = {
  enqueue: `function enqueueAll(values: number[]) {
  const queue = []
  for (const value of values) {
    queue.push(value)
  }
  return queue
}`,
  dequeue: `function dequeueAll(queue: number[]) {
  while (queue.length > 0) {
    const front = queue[0]
    queue.shift()
  }
  return queue
}`,
  peek: `function peek(queue: number[]) {
  if (queue.length === 0) return null
  return queue[0]
}`,
  slidingWindowMaximum: `function maxSlidingWindow(values: number[], size: number) {
  const deque = []
  const output = []
  for (let i = 0; i < values.length; i++) {
    while (deque.length && deque[0] <= i - size) deque.shift()
    while (deque.length && values[deque.at(-1)] <= values[i]) deque.pop()
    deque.push(i)
    if (i >= size - 1) output.push(values[deque[0]])
  }
  return output
}`,
  queueUsingStacks: `class QueueUsingStacks {
  input = []
  output = []
  enqueue(value: number) {
    this.input.push(value)
  }
  dequeue() {
    if (this.output.length === 0) {
      while (this.input.length) this.output.push(this.input.pop())
    }
    return this.output.pop()
  }
}`
}

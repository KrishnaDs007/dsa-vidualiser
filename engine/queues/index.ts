import { queueDequeue } from '@/engine/queues/queueDequeue'
import { queueEnqueue } from '@/engine/queues/queueEnqueue'
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
}`
}

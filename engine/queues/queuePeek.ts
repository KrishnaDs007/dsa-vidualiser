import type { QueueStep } from '@/engine/types'
import { cloneQueue, makeQueueItem } from '@/engine/queues/queueUtils'

export function* queuePeek(values: number[]): Generator<QueueStep> {
  const items = values.map((value, index) => makeQueueItem(value, index))
  const front = items[0] ?? null

  yield {
    items: cloneQueue(items),
    inputValues: [...values],
    activeValue: front?.value ?? null,
    activeItemId: front?.id ?? null,
    removedItemId: null,
    operation: 'peek',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    codeLine: 1,
    note: 'Peek reads the front queue item without removing it.'
  }

  yield {
    items: cloneQueue(items),
    inputValues: [...values],
    activeValue: front?.value ?? null,
    activeItemId: front?.id ?? null,
    removedItemId: null,
    operation: 'peek',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    codeLine: 3,
    note: front
      ? `Front value is ${front.value}. The queue stays unchanged.`
      : 'The queue is empty, so there is no value to peek.'
  }
}

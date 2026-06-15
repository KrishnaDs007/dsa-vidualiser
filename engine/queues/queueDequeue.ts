import type { QueueItem, QueueStep } from '@/engine/types'
import { cloneQueue, makeQueueItem } from '@/engine/queues/queueUtils'

export function* queueDequeue(values: number[]): Generator<QueueStep> {
  const items: QueueItem[] = values.map((value, index) =>
    makeQueueItem(value, index)
  )

  yield step({
    items,
    inputValues: values,
    operation: 'dequeue',
    codeLine: 1,
    note: 'Start with a filled queue. Dequeue always removes the front item.'
  })

  while (items.length > 0) {
    const front = items[0]

    yield step({
      items,
      inputValues: values,
      activeValue: front.value,
      activeItemId: front.id,
      operation: 'dequeue',
      codeLine: 3,
      note: `Read front value ${front.value}.`
    })

    const removed = items.shift()

    yield step({
      items,
      inputValues: values,
      activeValue: removed?.value ?? null,
      removedItemId: removed?.id ?? null,
      operation: 'dequeue',
      codeLine: 4,
      note: `Dequeue ${removed?.value}. The next item becomes the front.`
    })
  }

  yield step({
    items,
    inputValues: values,
    operation: 'dequeue',
    codeLine: 6,
    note: 'The queue is empty.'
  })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  removedItemId = null,
  operation,
  codeLine,
  note
}: {
  items: QueueItem[]
  inputValues: number[]
  activeValue?: number | null
  activeItemId?: string | null
  removedItemId?: string | null
  operation: 'dequeue'
  codeLine: number
  note: string
}): QueueStep {
  return {
    items: cloneQueue(items),
    inputValues: [...inputValues],
    activeValue,
    activeItemId,
    removedItemId,
    operation,
    timeComplexity: 'O(1) per dequeue',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

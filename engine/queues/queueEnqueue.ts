import type { QueueItem, QueueStep } from '@/engine/types'
import { cloneQueue, makeQueueItem } from '@/engine/queues/queueUtils'

export function* queueEnqueue(values: number[]): Generator<QueueStep> {
  const items: QueueItem[] = []

  yield step({
    items,
    inputValues: values,
    operation: 'enqueue',
    codeLine: 1,
    note: 'Start with an empty queue. New values enter at the rear.'
  })

  for (let index = 0; index < values.length; index++) {
    const value = values[index]

    yield step({
      items,
      inputValues: values,
      activeValue: value,
      operation: 'enqueue',
      codeLine: 3,
      note: `Read ${value} from the input list.`
    })

    const item = makeQueueItem(value, index)
    items.push(item)

    yield step({
      items,
      inputValues: values,
      activeValue: value,
      activeItemId: item.id,
      operation: 'enqueue',
      codeLine: 4,
      note: `Enqueue ${value} at the rear of the queue.`
    })
  }

  yield step({
    items,
    inputValues: values,
    operation: 'enqueue',
    codeLine: 6,
    note: 'All values are now queued in input order.'
  })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  operation,
  codeLine,
  note
}: {
  items: QueueItem[]
  inputValues: number[]
  activeValue?: number | null
  activeItemId?: string | null
  operation: 'enqueue'
  codeLine: number
  note: string
}): QueueStep {
  return {
    items: cloneQueue(items),
    inputValues: [...inputValues],
    activeValue,
    activeItemId,
    removedItemId: null,
    operation,
    timeComplexity: 'O(1) per enqueue',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

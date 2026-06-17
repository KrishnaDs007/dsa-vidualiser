import type { QueueItem, QueueStep } from '@/engine/types'
import { cloneQueue, makeQueueItem } from '@/engine/queues/queueUtils'

export function* slidingWindowMaximum(values: number[]): Generator<QueueStep> {
  const size = Math.min(3, Math.max(1, values.length))
  const deque: QueueItem[] = []
  const output: number[] = []

  yield step({ items: deque, inputValues: values, operation: 'deque', result: output.join(', ') || '-', codeLine: 1, note: `Use a decreasing deque of indexes for window size ${size}.` })

  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    yield step({ items: deque, inputValues: values, activeValue: value, operation: 'deque', result: output.join(', ') || '-', codeLine: 3, note: `Read value ${value} at index ${index}.` })

    while (deque.length > 0 && Number(deque[0].value) <= index - size) {
      const removed = deque.shift()
      yield step({ items: deque, inputValues: values, activeValue: value, removedItemId: removed?.id ?? null, operation: 'deque', result: output.join(', ') || '-', codeLine: 5, note: `Remove index ${removed?.value}; it left the window.` })
    }

    while (deque.length > 0 && values[Number(deque.at(-1)?.value)] <= value) {
      const removed = deque.pop()
      yield step({ items: deque, inputValues: values, activeValue: value, removedItemId: removed?.id ?? null, operation: 'deque', result: output.join(', ') || '-', codeLine: 8, note: `Remove index ${removed?.value}; ${value} is larger and more useful.` })
    }

    const item = makeQueueItem(index, index)
    deque.push(item)
    yield step({ items: deque, inputValues: values, activeValue: value, activeItemId: item.id, operation: 'deque', result: output.join(', ') || '-', codeLine: 10, note: `Push index ${index} into the deque.` })

    if (index >= size - 1) {
      const max = values[Number(deque[0].value)]
      output.push(max)
      yield step({ items: deque, inputValues: values, activeValue: max, activeItemId: deque[0].id, operation: 'deque', result: output.join(', '), codeLine: 12, note: `Window ending at index ${index} has maximum ${max}.` })
    }
  }

  yield step({ items: deque, inputValues: values, operation: 'deque', result: output.join(', '), codeLine: 14, note: 'Sliding window maximum output is complete.' })
}

export function* queueUsingStacks(values: number[]): Generator<QueueStep> {
  const inStack: number[] = []
  const outStack: number[] = []
  const visual: QueueItem[] = []
  const dequeued: number[] = []

  yield step({ items: visual, inputValues: values, operation: 'twoStacks', result: 'in: [] | out: []', codeLine: 1, note: 'Use one stack for enqueue and one stack for dequeue.' })

  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    inStack.push(value)
    visual.push(makeQueueItem(`in:${value}`, index))
    yield step({ items: visual, inputValues: values, activeValue: value, activeItemId: visual.at(-1)?.id ?? null, operation: 'twoStacks', result: `in: [${inStack.join(', ')}] | out: [${outStack.join(', ')}]`, codeLine: 3, note: `Enqueue ${value} by pushing it onto the input stack.` })
  }

  while (inStack.length > 0) {
    const moved = inStack.pop() as number
    outStack.push(moved)
    visual.push(makeQueueItem(`out:${moved}`, values.length + outStack.length))
    yield step({ items: visual, inputValues: values, activeValue: moved, activeItemId: visual.at(-1)?.id ?? null, operation: 'twoStacks', result: `in: [${inStack.join(', ')}] | out: [${outStack.join(', ')}]`, codeLine: 7, note: `Move ${moved} from input stack to output stack.` })
  }

  while (outStack.length > 0) {
    const removed = outStack.pop() as number
    dequeued.push(removed)
    const removedItem = visual.find((item) => item.value === `out:${removed}`)
    visual.splice(0, visual.length, ...visual.filter((item) => item.id !== removedItem?.id))
    yield step({ items: visual, inputValues: values, activeValue: removed, removedItemId: removedItem?.id ?? null, operation: 'twoStacks', result: `dequeued: [${dequeued.join(', ')}]`, codeLine: 10, note: `Pop ${removed} from output stack; this preserves FIFO order.` })
  }

  yield step({ items: visual, inputValues: values, operation: 'twoStacks', result: `dequeued: [${dequeued.join(', ')}]`, codeLine: 12, note: 'Queue using two stacks has dequeued all values in original order.' })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  removedItemId = null,
  operation,
  result,
  codeLine,
  note
}: {
  items: QueueItem[]
  inputValues: Array<number | string>
  activeValue?: number | string | null
  activeItemId?: string | null
  removedItemId?: string | null
  operation: QueueStep['operation']
  result?: string
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
    result,
    timeComplexity: operation === 'twoStacks' ? 'Amortized O(1)' : 'O(n)',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

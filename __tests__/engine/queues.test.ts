import { describe, expect, it } from 'vitest'
import { queueDequeue } from '@/engine/queues/queueDequeue'
import { queueEnqueue } from '@/engine/queues/queueEnqueue'
import { queuePeek } from '@/engine/queues/queuePeek'
import {
  queueUsingStacks,
  slidingWindowMaximum
} from '@/engine/queues/queuePatterns'

describe('queue engine', () => {
  it('enqueues values so the first value remains at the front', () => {
    const frames = Array.from(queueEnqueue([10, 20, 30]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.items.map((item) => item.value)).toEqual([10, 20, 30])
    expect(finalFrame?.items[0]?.value).toBe(10)
    expect(finalFrame?.timeComplexity).toBe('O(1) per enqueue')
  })

  it('dequeues values from the front in insertion order', () => {
    const frames = Array.from(queueDequeue([10, 20, 30]))
    const removedValues = frames
      .filter((frame) => frame.removedItemId)
      .map((frame) => frame.activeValue)

    expect(removedValues).toEqual([10, 20, 30])
    expect(frames.at(-1)?.items).toEqual([])
  })

  it('peeks without removing the front value', () => {
    const frames = Array.from(queuePeek([4, 8, 12]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.activeValue).toBe(4)
    expect(finalFrame?.items.map((item) => item.value)).toEqual([4, 8, 12])
  })

  it('tracks sliding window maximums with a deque', () => {
    const frames = Array.from(slidingWindowMaximum([1, 3, -1, -3, 5, 3, 6, 7]))

    expect(frames.at(-1)?.result).toBe('3, 3, 5, 5, 6, 7')
  })

  it('dequeues in FIFO order when implemented with two stacks', () => {
    const frames = Array.from(queueUsingStacks([10, 20, 30]))

    expect(frames.at(-1)?.result).toBe('dequeued: [10, 20, 30]')
  })
})

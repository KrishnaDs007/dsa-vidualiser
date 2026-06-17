import { describe, expect, it } from 'vitest'
import { stackPeek } from '@/engine/stacks/stackPeek'
import { stackPop } from '@/engine/stacks/stackPop'
import { stackPush } from '@/engine/stacks/stackPush'
import {
  dailyTemperatures,
  nextGreaterElement,
  validParentheses
} from '@/engine/stacks/stackPatterns'

describe('stack engine', () => {
  it('pushes values so the newest value becomes the top', () => {
    const frames = Array.from(stackPush([10, 20, 30]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.items.map((item) => item.value)).toEqual([10, 20, 30])
    expect(finalFrame?.items.at(-1)?.value).toBe(30)
    expect(finalFrame?.timeComplexity).toBe('O(1) per push')
  })

  it('pops values from the top in reverse insertion order', () => {
    const frames = Array.from(stackPop([10, 20, 30]))
    const removedValues = frames
      .filter((frame) => frame.removedItemId)
      .map((frame) => frame.activeValue)

    expect(removedValues).toEqual([30, 20, 10])
    expect(frames.at(-1)?.items).toEqual([])
  })

  it('peeks without removing the top value', () => {
    const frames = Array.from(stackPeek([4, 8, 12]))
    const finalFrame = frames.at(-1)

    expect(finalFrame?.activeValue).toBe(12)
    expect(finalFrame?.items.map((item) => item.value)).toEqual([4, 8, 12])
  })

  it('validates matched parentheses with a stack', () => {
    const frames = Array.from(validParentheses([]))

    expect(frames.at(-1)?.result).toBe('valid')
    expect(frames.at(-1)?.items).toEqual([])
  })

  it('computes next greater elements with a monotonic stack', () => {
    const frames = Array.from(nextGreaterElement([2, 1, 2, 4, 3]))

    expect(frames.at(-1)?.result).toBe('4, 2, 4, -1, -1')
  })

  it('computes daily temperature waits with a monotonic stack', () => {
    const frames = Array.from(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]))

    expect(frames.at(-1)?.result).toBe('1, 1, 4, 2, 1, 1, 0, 0')
  })
})

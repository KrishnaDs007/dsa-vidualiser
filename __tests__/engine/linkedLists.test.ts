import { describe, expect, it } from 'vitest'
import {
  detectCycle,
  mergeTwoSortedLists,
  middleOfLinkedList,
  removeNthFromEnd
} from '@/engine/linkedLists/linkedListPatterns'
import { reverseLinkedList } from '@/engine/linkedLists/reverseLinkedList'

describe('linked list engine', () => {
  it('reverses next pointers while keeping O(1) auxiliary space', () => {
    const frames = Array.from(reverseLinkedList([10, 20, 30, 40]))
    const finalFrame = frames.at(-1)
    const byId = new Map(finalFrame?.nodes.map((node) => [node.id, node]))
    const values: number[] = []
    let currentId = finalFrame?.headId ?? null

    while (currentId) {
      const node = byId.get(currentId)
      if (!node) break
      values.push(node.value)
      currentId = node.nextId
    }

    expect(values).toEqual([40, 30, 20, 10])
    expect(finalFrame?.spaceComplexity).toBe('O(1)')
  })

  it('emits pointer movement frames with current and next markers', () => {
    const frames = Array.from(reverseLinkedList([5, 15, 25]))

    expect(frames.some((frame) => frame.currentId && frame.nextId)).toBe(true)
    expect(frames.at(-1)?.currentId).toBeNull()
    expect(frames.at(-1)?.rewiredNodeIds).toHaveLength(3)
  })

  it('finds the middle node with slow and fast pointers', () => {
    const frames = Array.from(middleOfLinkedList([10, 20, 30, 40, 50]))

    expect(frames.at(-1)?.result).toBe('middle = 30')
  })

  it('detects a cycle with Floyd pointers', () => {
    const frames = Array.from(detectCycle([10, 20, 30, 40]))

    expect(frames.at(-1)?.result).toBe('cycle at 40')
  })

  it('merges two sorted demo lists', () => {
    const frames = Array.from(mergeTwoSortedLists([8, 1, 5, 3]))

    expect(frames.at(-1)?.result).toBe('1 -> 3 -> 5 -> 8')
  })

  it('removes the second node from the end in one pass', () => {
    const frames = Array.from(removeNthFromEnd([10, 20, 30, 40, 50]))

    expect(frames.at(-1)?.result).toBe('removed 40')
  })
})

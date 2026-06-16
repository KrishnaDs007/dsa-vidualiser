import { describe, expect, it } from 'vitest'
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
})

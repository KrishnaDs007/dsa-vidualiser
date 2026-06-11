import { describe, expect, it } from 'vitest'
import { BST_ALGORITHMS, BST_PSEUDOCODE } from '@/engine/trees'

function framesFor(
  algorithm: (typeof BST_ALGORITHMS)[keyof typeof BST_ALGORITHMS],
  values: number[],
  target: number
) {
  return Array.from(algorithm.run(values, target))
}

describe('tree engine', () => {
  it('BST insert builds one node per input value', () => {
    const values = [42, 18, 67, 29]
    const frames = framesFor(BST_ALGORITHMS.insert, values, 42)
    const finalFrame = frames.at(-1)

    expect(finalFrame?.nodes.map((node) => node.value).sort((a, b) => a - b)).toEqual([
      18,
      29,
      42,
      67
    ])
    expect(values).toEqual([42, 18, 67, 29])
  })

  it('BST search highlights the found target', () => {
    const frames = framesFor(BST_ALGORITHMS.search, [42, 18, 67, 29], 29)
    const finalFrame = frames.at(-1)
    const highlighted = finalFrame?.nodes.find(
      (node) => node.id === finalFrame.highlightedId
    )

    expect(highlighted?.value).toBe(29)
  })

  it('inorder traversal visits values in sorted order', () => {
    const frames = framesFor(BST_ALGORITHMS.inorder, [42, 18, 67, 29], 42)
    const finalFrame = frames.at(-1)
    const valueById = new Map(finalFrame?.nodes.map((node) => [node.id, node.value]))
    const visitedValues = finalFrame?.visitedIds.map((id) => valueById.get(id))

    expect(visitedValues).toEqual([18, 29, 42, 67])
  })

  it.each(Object.values(BST_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = framesFor(algorithm, [42, 18, 67, 29, 54], 29)
      const codeLineCount = BST_PSEUDOCODE[algorithm.id].split('\n').length

      expect(frames.length).toBeGreaterThan(0)

      for (const frame of frames) {
        const nodeIds = new Set(frame.nodes.map((node) => node.id))

        expect(frame.codeLine).toBeGreaterThanOrEqual(1)
        expect(frame.codeLine).toBeLessThanOrEqual(codeLineCount)

        if (frame.highlightedId) {
          expect(nodeIds.has(frame.highlightedId)).toBe(true)
        }

        for (const id of frame.visitedIds) {
          expect(nodeIds.has(id)).toBe(true)
        }

        for (const node of frame.nodes) {
          expect(node.x).toBeGreaterThanOrEqual(0)
          expect(node.y).toBeGreaterThanOrEqual(0)
          if (node.parentId) expect(nodeIds.has(node.parentId)).toBe(true)
        }
      }
    }
  )
})

import { describe, expect, it } from 'vitest'
import {
  DEFAULT_GRAPH,
  GRAPH_ALGORITHMS,
  GRAPH_PSEUDOCODE
} from '@/engine/graphs'

function framesFor(
  algorithm: (typeof GRAPH_ALGORITHMS)[keyof typeof GRAPH_ALGORITHMS],
  startId = 'a'
) {
  return Array.from(algorithm.run(DEFAULT_GRAPH, startId))
}

describe('graph engine', () => {
  it('BFS visits every reachable node', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.bfs).at(-1)

    expect(finalFrame?.visitedNodeIds.sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('DFS visits every reachable node', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.dfs).at(-1)

    expect(finalFrame?.visitedNodeIds.sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('Dijkstra computes shortest distances from the start node', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.dijkstra).at(-1)

    expect(finalFrame?.distances).toMatchObject({
      a: 0,
      b: 4,
      c: 2,
      d: 3,
      e: 9,
      f: 6
    })
  })

  it('topological sort emits every node in dependency order', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.topological).at(-1)

    expect(finalFrame?.visitedNodeIds).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(finalFrame?.note).toContain('Topological order')
  })

  it('union find connects graph components without invalid node references', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.unionFind).at(-1)

    expect(finalFrame?.settledNodeIds.sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(finalFrame?.note).toContain('complete')
  })

  it('minimum spanning tree accepts low weight edges', () => {
    const finalFrame = framesFor(GRAPH_ALGORITHMS.mst).at(-1)

    expect(finalFrame?.edges).toHaveLength(5)
    expect(finalFrame?.distances.total).toBe(11)
    expect(finalFrame?.note).toContain('MST complete')
  })

  it.each(Object.values(GRAPH_ALGORITHMS))(
    '$label emits valid visualizer frames',
    (algorithm) => {
      const frames = framesFor(algorithm)
      const codeLineCount = GRAPH_PSEUDOCODE[algorithm.id].split('\n').length
      const nodeIds = new Set(DEFAULT_GRAPH.nodes.map((node) => node.id))

      expect(frames.length).toBeGreaterThan(0)

      for (const frame of frames) {
        expect(frame.codeLine).toBeGreaterThanOrEqual(1)
        expect(frame.codeLine).toBeLessThanOrEqual(codeLineCount)

        if (frame.activeNodeId) expect(nodeIds.has(frame.activeNodeId)).toBe(true)

        for (const id of [
          ...frame.visitedNodeIds,
          ...frame.frontierNodeIds,
          ...frame.settledNodeIds
        ]) {
          expect(nodeIds.has(id)).toBe(true)
        }

        for (const edge of frame.edges) {
          expect(nodeIds.has(edge.source)).toBe(true)
          expect(nodeIds.has(edge.target)).toBe(true)
          expect(edge.weight).toBeGreaterThan(0)
        }
      }
    }
  )
})

import type { GraphEdge, GraphNode, GraphStep } from '@/engine/types'
import {
  minimumSpanningTree,
  topologicalSort,
  unionFind
} from '@/engine/graphs/graphPatterns'

export interface GraphDefinition {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export const DEFAULT_GRAPH: GraphDefinition = {
  nodes: [
    { id: 'a', label: 'A', x: 90, y: 190 },
    { id: 'b', label: 'B', x: 250, y: 80 },
    { id: 'c', label: 'C', x: 250, y: 300 },
    { id: 'd', label: 'D', x: 450, y: 110 },
    { id: 'e', label: 'E', x: 450, y: 290 },
    { id: 'f', label: 'F', x: 650, y: 190 }
  ],
  edges: [
    { source: 'a', target: 'b', weight: 4 },
    { source: 'a', target: 'c', weight: 2 },
    { source: 'b', target: 'd', weight: 5 },
    { source: 'c', target: 'd', weight: 1 },
    { source: 'c', target: 'e', weight: 7 },
    { source: 'd', target: 'f', weight: 3 },
    { source: 'e', target: 'f', weight: 1 }
  ]
}

export function* breadthFirstSearch(
  graph: GraphDefinition,
  startId: string
): Generator<GraphStep> {
  const visited = new Set<string>()
  const queue = [startId]

  yield snapshot(graph, null, visited, queue, new Set(), {}, 1, 'Start BFS with the chosen node in the queue.')

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) continue

    visited.add(current)
    yield snapshot(graph, current, visited, queue, visited, {}, 4, `Visit ${label(graph, current)}.`)

    for (const neighbor of neighbors(graph, current)) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor)
        yield snapshot(graph, current, visited, queue, visited, {}, 7, `Add ${label(graph, neighbor)} to the queue.`)
      }
    }
  }

  yield snapshot(graph, null, visited, [], visited, {}, 9, 'BFS traversal complete.')
}

export function* depthFirstSearch(
  graph: GraphDefinition,
  startId: string
): Generator<GraphStep> {
  const visited = new Set<string>()
  const stack = [startId]

  yield snapshot(graph, null, visited, stack, new Set(), {}, 1, 'Start DFS with the chosen node on the stack.')

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current || visited.has(current)) continue

    visited.add(current)
    yield snapshot(graph, current, visited, stack, visited, {}, 4, `Visit ${label(graph, current)}.`)

    for (const neighbor of [...neighbors(graph, current)].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor)
        yield snapshot(graph, current, visited, stack, visited, {}, 7, `Push ${label(graph, neighbor)} onto the stack.`)
      }
    }
  }

  yield snapshot(graph, null, visited, [], visited, {}, 9, 'DFS traversal complete.')
}

export function* dijkstra(
  graph: GraphDefinition,
  startId: string
): Generator<GraphStep> {
  const distances = Object.fromEntries(
    graph.nodes.map((node) => [node.id, node.id === startId ? 0 : Infinity])
  )
  const settled = new Set<string>()
  const frontier = new Set([startId])

  yield snapshot(graph, null, new Set(), [...frontier], settled, distances, 1, 'Initialize distances from the start node.')

  while (settled.size < graph.nodes.length && frontier.size > 0) {
    const current = [...frontier].sort(
      (left, right) => distances[left] - distances[right]
    )[0]
    frontier.delete(current)
    settled.add(current)

    yield snapshot(graph, current, settled, [...frontier], settled, distances, 5, `Settle ${label(graph, current)} with distance ${distances[current]}.`)

    for (const edge of outgoingEdges(graph, current)) {
      if (settled.has(edge.target)) continue

      const candidate = distances[current] + edge.weight
      if (candidate < distances[edge.target]) {
        distances[edge.target] = candidate
        frontier.add(edge.target)

        yield snapshot(graph, edge.target, settled, [...frontier], settled, distances, 8, `Relax ${label(graph, edge.target)} to distance ${candidate}.`)
      }
    }
  }

  yield snapshot(graph, null, settled, [], settled, distances, 10, 'Dijkstra shortest paths complete.')
}

export const GRAPH_ALGORITHMS = {
  bfs: {
    id: 'bfs',
    label: 'BFS',
    complexity: 'O(V + E)',
    run: breadthFirstSearch
  },
  dfs: {
    id: 'dfs',
    label: 'DFS',
    complexity: 'O(V + E)',
    run: depthFirstSearch
  },
  dijkstra: {
    id: 'dijkstra',
    label: 'Dijkstra',
    complexity: 'O((V + E) log V)',
    run: dijkstra
  },
  topological: {
    id: 'topological',
    label: 'Topological Sort',
    complexity: 'O(V + E)',
    run: topologicalSort
  },
  unionFind: {
    id: 'unionFind',
    label: 'Union Find',
    complexity: 'Almost O(1) per operation',
    run: unionFind
  },
  mst: {
    id: 'mst',
    label: 'Minimum Spanning Tree',
    complexity: 'O(E log E)',
    run: minimumSpanningTree
  }
} as const

export type GraphAlgorithmId = keyof typeof GRAPH_ALGORITHMS

export function isGraphAlgorithmId(value?: string): value is GraphAlgorithmId {
  return Boolean(value && value in GRAPH_ALGORITHMS)
}

export const GRAPH_PSEUDOCODE: Record<GraphAlgorithmId, string> = {
  bfs: `function bfs(graph: Graph, start: Node) {
  const queue = [start]
  while (queue.length > 0) {
    const node = queue.shift()
    visit(node)
    for (const neighbor of graph.neighbors(node)) {
      queue.push(neighbor)
    }
  }
}`,
  dfs: `function dfs(graph: Graph, start: Node) {
  const stack = [start]
  while (stack.length > 0) {
    const node = stack.pop()
    visit(node)
    for (const neighbor of graph.neighbors(node)) {
      stack.push(neighbor)
    }
  }
}`,
  dijkstra: `function dijkstra(graph: Graph, start: Node) {
  initializeDistances(start)
  while (frontier.hasNodes()) {
    const node = extractNearestNode()
    settle(node)
    for (const edge of graph.outgoing(node)) {
      relax(edge)
    }
  }
  return distances
}`,
  topological: `function topologicalSort(graph: Graph) {
  const indegree = countIncomingEdges(graph)
  const queue = nodesWithZeroIndegree(indegree)
  const order = []
  while (queue.length > 0) {
    const node = queue.shift()
    order.push(node)
    for (const neighbor of graph.neighbors(node)) {
      indegree[neighbor]--
      if (indegree[neighbor] === 0) queue.push(neighbor)
    }
  }
  return order
}`,
  unionFind: `function unionFind(edges: Edge[]) {
  const parent = makeSet()
  for (const edge of edges) {
    if (find(edge.u) !== find(edge.v)) {
      union(edge.u, edge.v)
    }
  }
}`,
  mst: `function kruskal(graph: Graph) {
  const edges = graph.edges.sort((a, b) => a.weight - b.weight)
  const parent = makeSet()
  const mst = []
  for (const edge of edges) {
    if (find(edge.u) !== find(edge.v)) {
      union(edge.u, edge.v)
      mst.push(edge)
    }
  }
  return mst
}`
}

function snapshot(
  graph: GraphDefinition,
  activeNodeId: string | null,
  visited: Set<string>,
  frontier: string[],
  settled: Set<string>,
  distances: Record<string, number>,
  codeLine: number,
  note: string
): GraphStep {
  return {
    nodes: graph.nodes,
    edges: graph.edges,
    activeNodeId,
    visitedNodeIds: [...visited],
    frontierNodeIds: frontier,
    settledNodeIds: [...settled],
    distances: { ...distances },
    codeLine,
    note
  }
}

function neighbors(graph: GraphDefinition, nodeId: string) {
  return outgoingEdges(graph, nodeId).map((edge) => edge.target)
}

function outgoingEdges(graph: GraphDefinition, nodeId: string) {
  return graph.edges.filter((edge) => edge.source === nodeId)
}

function label(graph: GraphDefinition, nodeId: string) {
  return graph.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
}

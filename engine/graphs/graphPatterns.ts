import type { GraphStep } from '@/engine/types'
import type { GraphDefinition } from '@/engine/graphs'

export function* topologicalSort(
  graph: GraphDefinition,
  _startId: string
): Generator<GraphStep> {
  const indegree = Object.fromEntries(graph.nodes.map((node) => [node.id, 0]))
  for (const edge of graph.edges) indegree[edge.target]++
  const queue = graph.nodes
    .filter((node) => indegree[node.id] === 0)
    .map((node) => node.id)
  const order: string[] = []

  yield snapshot(graph, null, order, queue, new Set(), indegree, 1, 'Compute indegrees and enqueue nodes with indegree 0.')

  while (queue.length > 0) {
    const current = queue.shift() as string
    order.push(current)
    yield snapshot(graph, current, order, queue, new Set(order), indegree, 4, `Output ${label(graph, current)} in topological order.`)

    for (const edge of graph.edges.filter((item) => item.source === current)) {
      indegree[edge.target]--
      if (indegree[edge.target] === 0) queue.push(edge.target)
      yield snapshot(graph, edge.target, order, queue, new Set(order), indegree, 7, `Reduce indegree of ${label(graph, edge.target)} to ${indegree[edge.target]}.`)
    }
  }

  yield snapshot(graph, null, order, [], new Set(order), indegree, 10, `Topological order: ${order.map((id) => label(graph, id)).join(' -> ')}.`)
}

export function* unionFind(
  graph: GraphDefinition,
  _startId: string
): Generator<GraphStep> {
  const parent = Object.fromEntries(graph.nodes.map((node) => [node.id, node.id]))
  const rank = Object.fromEntries(graph.nodes.map((node) => [node.id, 0]))
  const accepted = new Set<string>()

  yield snapshot(graph, null, [], [], accepted, componentLabels(graph, parent), 1, 'Start with each node in its own disjoint set.')

  for (const edge of graph.edges) {
    const sourceRoot = find(parent, edge.source)
    const targetRoot = find(parent, edge.target)
    yield snapshot(graph, edge.source, [edge.source, edge.target], [], accepted, componentLabels(graph, parent), 4, `Check whether ${label(graph, edge.source)} and ${label(graph, edge.target)} are already connected.`)

    if (sourceRoot !== targetRoot) {
      unite(parent, rank, sourceRoot, targetRoot)
      accepted.add(edge.source)
      accepted.add(edge.target)
      yield snapshot(graph, edge.target, [edge.source, edge.target], [], accepted, componentLabels(graph, parent), 6, `Union the two sets; this edge connects separate components.`)
    } else {
      yield snapshot(graph, edge.target, [edge.source, edge.target], [], accepted, componentLabels(graph, parent), 8, 'They already share a root, so this edge would form a cycle.')
    }
  }

  yield snapshot(graph, null, [...accepted], [], accepted, componentLabels(graph, parent), 8, 'Union Find pass complete.')
}

export function* minimumSpanningTree(
  graph: GraphDefinition,
  _startId: string
): Generator<GraphStep> {
  const parent = Object.fromEntries(graph.nodes.map((node) => [node.id, node.id]))
  const rank = Object.fromEntries(graph.nodes.map((node) => [node.id, 0]))
  const acceptedNodes = new Set<string>()
  const acceptedEdges = new Set<string>()
  let total = 0
  const sortedEdges = [...graph.edges].sort((left, right) => left.weight - right.weight)

  yield snapshot(graph, null, [], sortedEdges.map((edge) => edge.source), acceptedNodes, {}, 1, 'Sort edges by weight for Kruskal MST.')

  for (const edge of sortedEdges) {
    const edgeId = `${edge.source}-${edge.target}`
    yield snapshot(graph, edge.source, [edge.source, edge.target], [], acceptedNodes, { total }, 4, `Try edge ${label(graph, edge.source)}-${label(graph, edge.target)} with weight ${edge.weight}.`)

    if (find(parent, edge.source) !== find(parent, edge.target)) {
      unite(parent, rank, edge.source, edge.target)
      acceptedNodes.add(edge.source)
      acceptedNodes.add(edge.target)
      acceptedEdges.add(edgeId)
      total += edge.weight
      yield snapshot(
        { ...graph, edges: graph.edges.filter((item) => acceptedEdges.has(`${item.source}-${item.target}`)) },
        edge.target,
        [...acceptedNodes],
        [],
        acceptedNodes,
        { total },
        6,
        `Accept the edge. Current MST weight is ${total}.`
      )
    } else {
      yield snapshot(graph, edge.target, [edge.source, edge.target], [], acceptedNodes, { total }, 8, 'Reject the edge because it would create a cycle.')
    }
  }

  yield snapshot(
    { ...graph, edges: graph.edges.filter((item) => acceptedEdges.has(`${item.source}-${item.target}`)) },
    null,
    [...acceptedNodes],
    [],
    acceptedNodes,
    { total },
    11,
    `MST complete with total weight ${total}.`
  )
}

function snapshot(
  graph: GraphDefinition,
  activeNodeId: string | null,
  visited: Iterable<string>,
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

function find(parent: Record<string, string>, node: string): string {
  if (parent[node] !== node) parent[node] = find(parent, parent[node])
  return parent[node]
}

function unite(
  parent: Record<string, string>,
  rank: Record<string, number>,
  left: string,
  right: string
) {
  const leftRoot = find(parent, left)
  const rightRoot = find(parent, right)
  if (leftRoot === rightRoot) return
  if (rank[leftRoot] < rank[rightRoot]) parent[leftRoot] = rightRoot
  else if (rank[leftRoot] > rank[rightRoot]) parent[rightRoot] = leftRoot
  else {
    parent[rightRoot] = leftRoot
    rank[leftRoot]++
  }
}

function componentLabels(graph: GraphDefinition, parent: Record<string, string>) {
  return Object.fromEntries(
    graph.nodes.map((node, index) => [node.id, graph.nodes.findIndex((item) => item.id === find(parent, node.id)) + index * 0])
  )
}

function label(graph: GraphDefinition, nodeId: string) {
  return graph.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
}

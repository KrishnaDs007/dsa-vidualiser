export interface SortStep {
  array: number[]
  comparing: number[]
  swapped: number[]
  sorted: number[]
  pivot?: number
  codeLine: number
}

export interface TreeNode {
  id: string
  value: number
  parentId?: string
  x: number
  y: number
}

export interface TreeStep {
  nodes: TreeNode[]
  highlightedId: string | null
  visitedIds: string[]
  codeLine: number
  note: string
}

export interface SearchStep {
  array: number[]
  target: number
  checking: number[]
  activeRange: number[]
  eliminated: number[]
  foundIndex: number | null
  codeLine: number
  note: string
}

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  source: string
  target: string
  weight: number
}

export interface GraphStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNodeId: string | null
  visitedNodeIds: string[]
  frontierNodeIds: string[]
  settledNodeIds: string[]
  distances: Record<string, number>
  codeLine: number
  note: string
}

export interface DpCell {
  id: string
  label: string
  value: string
}

export interface DpStep {
  cells: DpCell[]
  activeCellId: string | null
  dependencyCellIds: string[]
  completedCellIds: string[]
  result: string
  timeComplexity: string
  spaceComplexity: string
  codeLine: number
  note: string
}

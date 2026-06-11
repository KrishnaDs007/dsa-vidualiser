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
  x: number
  y: number
}

export interface TreeStep {
  nodes: TreeNode[]
  highlightedId: string | null
  visitedIds: string[]
  codeLine: number
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

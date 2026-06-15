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

export interface HashEntry {
  id: string
  key: number
  value: string
}

export interface HashBucket {
  id: number
  entries: HashEntry[]
}

export interface HashStep {
  buckets: HashBucket[]
  inputKeys: number[]
  activeKey: number | null
  activeBucketId: number | null
  activeEntryId: string | null
  insertedEntryIds: string[]
  visitedEntryIds: string[]
  foundEntryId: string | null
  bucketCount: number
  timeComplexity: string
  spaceComplexity: string
  codeLine: number
  note: string
}

export interface StackItem {
  id: string
  value: number
}

export interface StackStep {
  items: StackItem[]
  inputValues: number[]
  activeValue: number | null
  activeItemId: string | null
  removedItemId: string | null
  operation: 'push' | 'pop' | 'peek'
  timeComplexity: string
  spaceComplexity: string
  codeLine: number
  note: string
}

export interface QueueItem {
  id: string
  value: number
}

export interface QueueStep {
  items: QueueItem[]
  inputValues: number[]
  activeValue: number | null
  activeItemId: string | null
  removedItemId: string | null
  operation: 'enqueue' | 'dequeue' | 'peek'
  timeComplexity: string
  spaceComplexity: string
  codeLine: number
  note: string
}

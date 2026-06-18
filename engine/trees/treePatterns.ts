import type { TreeNode, TreeStep } from '@/engine/types'

interface PatternTreeNode {
  id: string
  value: number
  parentId?: string
  leftId?: string
  rightId?: string
}

export function* bstPreorderTraversal(values: number[]): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const visited: string[] = []

  yield snapshot(nodes, null, [], 1, 'Start preorder traversal from the root.')

  function* traverse(id?: string): Generator<TreeStep> {
    if (!id) return
    const node = nodes.get(id)
    if (!node) return

    visited.push(id)
    yield snapshot(nodes, id, [...visited], 3, `Visit ${node.value} before its children.`)
    yield snapshot(nodes, id, [...visited], 4, `Move left from ${node.value}.`)
    yield* traverse(node.leftId)
    yield snapshot(nodes, id, [...visited], 5, `Move right from ${node.value}.`)
    yield* traverse(node.rightId)
  }

  yield* traverse(rootId)
  yield snapshot(nodes, null, [...visited], 6, 'Preorder traversal complete.')
}

export function* bstPostorderTraversal(values: number[]): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const visited: string[] = []

  yield snapshot(nodes, null, [], 1, 'Start postorder traversal from the root.')

  function* traverse(id?: string): Generator<TreeStep> {
    if (!id) return
    const node = nodes.get(id)
    if (!node) return

    yield snapshot(nodes, id, [...visited], 3, `Move left from ${node.value}.`)
    yield* traverse(node.leftId)
    yield snapshot(nodes, id, [...visited], 4, `Move right from ${node.value}.`)
    yield* traverse(node.rightId)
    visited.push(id)
    yield snapshot(nodes, id, [...visited], 5, `Visit ${node.value} after both children.`)
  }

  yield* traverse(rootId)
  yield snapshot(nodes, null, [...visited], 6, 'Postorder traversal complete.')
}

export function* bstLevelOrderTraversal(values: number[]): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const visited: string[] = []
  const queue = rootId ? [rootId] : []

  yield snapshot(nodes, rootId ?? null, [], 1, 'Start BFS level-order traversal with the root in a queue.')

  while (queue.length > 0) {
    const id = queue.shift() as string
    const node = nodes.get(id)
    if (!node) continue
    visited.push(id)
    yield snapshot(nodes, id, [...visited], 4, `Visit ${node.value}, then enqueue its children.`)
    if (node.leftId) queue.push(node.leftId)
    if (node.rightId) queue.push(node.rightId)
    yield snapshot(nodes, id, [...visited, ...queue], 5, `Queue now holds the next level candidates.`)
  }

  yield snapshot(nodes, null, [...visited], 7, 'Level-order traversal complete.')
}

export function* bstLowestCommonAncestor(values: number[], target: number): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const sorted = [...values].sort((a, b) => a - b)
  const first = sorted[Math.max(0, Math.floor(sorted.length / 3))]
  const second = Number.isFinite(target) && values.includes(target)
    ? target
    : sorted[Math.min(sorted.length - 1, Math.floor((sorted.length * 2) / 3))]
  const low = Math.min(first, second)
  const high = Math.max(first, second)
  const visited: string[] = []
  let current = rootId ? nodes.get(rootId) : undefined

  yield snapshot(nodes, current?.id ?? null, [], 1, `Find LCA for ${low} and ${high}.`)

  while (current) {
    visited.push(current.id)
    yield snapshot(nodes, current.id, [...visited], 4, `Compare ${low} and ${high} with ${current.value}.`)
    const value = Number(current.value)
    if (high < value) current = nodes.get(current.leftId ?? '')
    else if (low > value) current = nodes.get(current.rightId ?? '')
    else {
      yield snapshot(nodes, current.id, [...visited], 7, `${current.value} splits the paths, so it is the LCA.`)
      return
    }
  }

  yield snapshot(nodes, null, [...visited], 9, 'No common ancestor was found.')
}

export function* trieInsertSearch(_values: number[], target: number): Generator<TreeStep> {
  const words = ['algo', 'all', 'also', 'tree', 'trie']
  const searchWord = target % 2 === 0 ? 'trie' : 'also'
  const nodes: TreeNode[] = [{ id: 'root', value: '*', x: 410, y: 44 }]
  const byPath = new Map<string, TreeNode>([['', nodes[0]]])
  const visited: string[] = []

  yield trieSnapshot(nodes, 'root', [], 1, 'Start with an empty trie root.')

  for (const word of words) {
    let path = ''
    let parent = nodes[0]
    for (const char of word) {
      path += char
      let node = byPath.get(path)
      if (!node) {
        node = {
          id: `trie-${path}`,
          value: char,
          parentId: parent.id,
          x: 90 + nodes.length * 68,
          y: 44 + path.length * 76
        }
        nodes.push(node)
        byPath.set(path, node)
      }
      parent = node
      visited.push(node.id)
      yield trieSnapshot(nodes, node.id, [...visited], 4, `Insert character "${char}" for word "${word}".`)
    }
  }

  let path = ''
  const searchVisited: string[] = []
  for (const char of searchWord) {
    path += char
    const node = byPath.get(path)
    if (!node) {
      yield trieSnapshot(nodes, null, searchVisited, 8, `"${searchWord}" is missing at character "${char}".`)
      return
    }
    searchVisited.push(node.id)
    yield trieSnapshot(nodes, node.id, [...searchVisited], 7, `Follow "${char}" while searching for "${searchWord}".`)
  }

  yield trieSnapshot(nodes, searchVisited.at(-1) ?? null, [...searchVisited], 9, `"${searchWord}" exists in the trie.`)
}

function trieSnapshot(
  nodes: TreeNode[],
  highlightedId: string | null,
  visitedIds: string[],
  codeLine: number,
  note: string
): TreeStep {
  return {
    nodes: nodes.map((node) => ({ ...node })),
    highlightedId,
    visitedIds,
    codeLine,
    note
  }
}

function buildTree(values: number[]) {
  const nodes = new Map<string, PatternTreeNode>()
  let rootId: string | undefined

  for (const [index, value] of values.entries()) {
    const nextNode: PatternTreeNode = {
      id: `pattern-${index}-${value}`,
      value
    }

    if (!rootId) {
      nodes.set(nextNode.id, nextNode)
      rootId = nextNode.id
      continue
    }

    let current = nodes.get(rootId)
    while (current) {
      if (value < current.value) {
        if (!current.leftId) {
          current.leftId = nextNode.id
          nextNode.parentId = current.id
          nodes.set(nextNode.id, nextNode)
          break
        }
        current = nodes.get(current.leftId)
      } else {
        if (!current.rightId) {
          current.rightId = nextNode.id
          nextNode.parentId = current.id
          nodes.set(nextNode.id, nextNode)
          break
        }
        current = nodes.get(current.rightId)
      }
    }
  }

  return { nodes, rootId }
}

function snapshot(
  nodes: Map<string, PatternTreeNode>,
  highlightedId: string | null,
  visitedIds: string[],
  codeLine: number,
  note: string
): TreeStep {
  return {
    nodes: layoutNodes(nodes),
    highlightedId,
    visitedIds,
    codeLine,
    note
  }
}

function layoutNodes(nodes: Map<string, PatternTreeNode>): TreeNode[] {
  const root = [...nodes.values()].find((node) => !node.parentId)
  if (!root) return []
  const ordered: string[] = []
  const depths = new Map<string, number>()

  function walk(id: string | undefined, depth: number) {
    if (!id) return
    const node = nodes.get(id)
    if (!node) return
    depths.set(id, depth)
    walk(node.leftId, depth + 1)
    ordered.push(id)
    walk(node.rightId, depth + 1)
  }

  walk(root.id, 0)
  const xById = new Map(
    ordered.map((id, index) => [id, ((index + 1) / (ordered.length + 1)) * 760 + 20])
  )

  return [...nodes.values()].map((node) => ({
    id: node.id,
    value: node.value,
    parentId: node.parentId,
    x: xById.get(node.id) ?? 400,
    y: (depths.get(node.id) ?? 0) * 86 + 44
  }))
}

import type { TreeNode, TreeStep } from '@/engine/types'

interface BstModelNode {
  id: string
  value: number
  parentId?: string
  leftId?: string
  rightId?: string
}

export function* bstInsert(values: number[]): Generator<TreeStep> {
  const nodes = new Map<string, BstModelNode>()
  let rootId: string | undefined

  yield snapshot(nodes, null, [], 1, 'Start with an empty binary search tree.')

  for (const [index, value] of values.entries()) {
    const nextNode: BstModelNode = {
      id: nodeId(index, value),
      value
    }

    if (!rootId) {
      nodes.set(nextNode.id, nextNode)
      rootId = nextNode.id
      yield snapshot(nodes, nextNode.id, [nextNode.id], 3, `Insert ${value} as the root.`)
      continue
    }

    let current = nodes.get(rootId)

    while (current) {
      yield snapshot(nodes, current.id, [current.id], 5, `Compare ${value} with ${current.value}.`)

      if (value < current.value) {
        if (!current.leftId) {
          current.leftId = nextNode.id
          nextNode.parentId = current.id
          nodes.set(nextNode.id, nextNode)
          yield snapshot(nodes, nextNode.id, [current.id, nextNode.id], 7, `Insert ${value} to the left of ${current.value}.`)
          break
        }

        current = nodes.get(current.leftId)
      } else {
        if (!current.rightId) {
          current.rightId = nextNode.id
          nextNode.parentId = current.id
          nodes.set(nextNode.id, nextNode)
          yield snapshot(nodes, nextNode.id, [current.id, nextNode.id], 9, `Insert ${value} to the right of ${current.value}.`)
          break
        }

        current = nodes.get(current.rightId)
      }
    }
  }

  yield snapshot(nodes, null, [...nodes.keys()], 9, 'BST build complete.')
}

export function* bstSearch(values: number[], target: number): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const visited: string[] = []
  let current = rootId ? nodes.get(rootId) : undefined

  yield snapshot(nodes, null, [], 1, `Search for ${target} from the root.`)

  while (current) {
    visited.push(current.id)
    yield snapshot(nodes, current.id, [...visited], 4, `Compare ${target} with ${current.value}.`)

    if (current.value === target) {
      yield snapshot(nodes, current.id, [...visited], 5, `Found ${target}.`)
      return
    }

    current = nodes.get(target < current.value ? current.leftId ?? '' : current.rightId ?? '')
  }

  yield snapshot(nodes, null, [...visited], 9, `${target} is not present in this BST.`)
}

export function* bstInorderTraversal(values: number[]): Generator<TreeStep> {
  const { nodes, rootId } = buildTree(values)
  const visited: string[] = []

  yield snapshot(nodes, null, [], 1, 'Start inorder traversal from the root.')

  function* traverse(id?: string): Generator<TreeStep> {
    if (!id) return

    const node = nodes.get(id)
    if (!node) return

    yield snapshot(nodes, id, [...visited], 3, `Move left from ${node.value}.`)
    yield* traverse(node.leftId)
    visited.push(id)
    yield snapshot(nodes, id, [...visited], 4, `Visit ${node.value}.`)
    yield snapshot(nodes, id, [...visited], 5, `Move right from ${node.value}.`)
    yield* traverse(node.rightId)
  }

  yield* traverse(rootId)
  yield snapshot(nodes, null, [...visited], 6, 'Inorder traversal complete.')
}

export const BST_ALGORITHMS = {
  insert: {
    id: 'insert',
    label: 'BST Insert',
    complexity: 'O(h) per insert',
    run: (values: number[], _target: number) => bstInsert(values)
  },
  search: {
    id: 'search',
    label: 'BST Search',
    complexity: 'O(h)',
    run: bstSearch
  },
  inorder: {
    id: 'inorder',
    label: 'Inorder Traversal',
    complexity: 'O(n)',
    run: (values: number[], _target: number) => bstInorderTraversal(values)
  }
} as const

export type BstAlgorithmId = keyof typeof BST_ALGORITHMS

export function isBstAlgorithmId(value?: string): value is BstAlgorithmId {
  return Boolean(value && value in BST_ALGORITHMS)
}

export const BST_PSEUDOCODE: Record<BstAlgorithmId, string> = {
  insert: `function insert(root: Node | null, value: number) {
  if (!root) return new Node(value)
  if (value < root.value) {
    root.left = insert(root.left, value)
  } else {
    root.right = insert(root.right, value)
  }
  return root
}`,
  search: `function search(root: Node | null, target: number) {
  let current = root
  while (current) {
    if (current.value === target) return current
    if (target < current.value) current = current.left
    else current = current.right
  }
  return null
}`,
  inorder: `function inorder(node: Node | null) {
  if (!node) return
  inorder(node.left)
  visit(node)
  inorder(node.right)
}`
}

function buildTree(values: number[]) {
  const nodes = new Map<string, BstModelNode>()
  let rootId: string | undefined

  for (const [index, value] of values.entries()) {
    const nextNode: BstModelNode = {
      id: nodeId(index, value),
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
  nodes: Map<string, BstModelNode>,
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

function layoutNodes(nodes: Map<string, BstModelNode>): TreeNode[] {
  const roots = [...nodes.values()].filter((node) => !node.parentId)
  const root = roots[0]
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
    ordered.map((id, index) => [
      id,
      ((index + 1) / (ordered.length + 1)) * 760 + 20
    ])
  )

  return [...nodes.values()].map((node) => ({
    id: node.id,
    value: node.value,
    parentId: node.parentId,
    x: xById.get(node.id) ?? 400,
    y: (depths.get(node.id) ?? 0) * 86 + 44
  }))
}

function nodeId(index: number, value: number) {
  return `node-${index}-${value}`
}

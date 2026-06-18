import type { LinkedListNode, LinkedListStep } from '@/engine/types'

export function* middleOfLinkedList(values: number[]): Generator<LinkedListStep> {
  const nodes = createNodes(values)
  let slow = 0
  let fast = 0

  yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, codeLine: 1, note: 'Use slow and fast pointers. Slow moves one step, fast moves two.' })

  while (fast < nodes.length && fast + 1 < nodes.length) {
    slow += 1
    fast += 2
    yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, codeLine: 4, note: `Move slow to ${nodes[slow]?.value}; fast moves ahead.` })
  }

  yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: null, result: `middle = ${nodes[slow]?.value ?? 'none'}`, codeLine: 7, note: `Fast reached the end, so slow is the middle node.` })
}

export function* detectCycle(values: number[]): Generator<LinkedListStep> {
  const nodes = createNodes(values)
  if (nodes.length > 2) nodes[nodes.length - 1].nextId = nodes[1].id
  let slow = 0
  let fast = 0
  const visited: string[] = []

  yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, rewiredNodeIds: visited, codeLine: 1, note: 'Create a demo cycle by pointing the tail back near the head.' })

  for (let guard = 0; guard < nodes.length + 2; guard++) {
    slow = nextIndex(nodes, slow)
    fast = nextIndex(nodes, nextIndex(nodes, fast))
    if (nodes[slow]) visited.push(nodes[slow].id)

    yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, rewiredNodeIds: visited, codeLine: 4, note: `Move slow by one and fast by two.` })

    if (slow === fast && nodes[slow]) {
      yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow].id, nextId: nodes[fast].id, rewiredNodeIds: visited, result: `cycle at ${nodes[slow].value}`, codeLine: 5, note: 'Slow and fast met, so a cycle exists.' })
      return
    }
  }

  yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: null, nextId: null, rewiredNodeIds: visited, result: 'no cycle', codeLine: 8, note: 'Fast reached null, so there is no cycle.' })
}

export function* mergeTwoSortedLists(values: number[]): Generator<LinkedListStep> {
  const sorted = [...values].sort((a, b) => a - b)
  const leftValues = sorted.filter((_, index) => index % 2 === 0)
  const rightValues = sorted.filter((_, index) => index % 2 === 1)
  const left = createNodes(leftValues, 'a', 120)
  const right = createNodes(rightValues, 'b', 260)
  const merged: LinkedListNode[] = []
  let i = 0
  let j = 0

  yield step({ nodes: [...left, ...right], inputValues: values, headId: left[0]?.id ?? right[0]?.id ?? null, currentId: left[0]?.id ?? null, nextId: right[0]?.id ?? null, codeLine: 1, note: 'Split the sorted values into two sorted demo lists.' })

  while (i < left.length || j < right.length) {
    const takeLeft = j >= right.length || (i < left.length && left[i].value <= right[j].value)
    const source = takeLeft ? left[i++] : right[j++]
    const node = { ...source, id: `m-${merged.length}-${source.value}`, x: 90 + merged.length * 132, y: 380, nextId: null }
    if (merged.length > 0) merged[merged.length - 1].nextId = node.id
    merged.push(node)

    yield step({ nodes: [...left, ...right, ...merged], inputValues: values, headId: merged[0]?.id ?? null, currentId: source.id, nextId: node.id, rewiredNodeIds: merged.map((item) => item.id), result: merged.map((item) => item.value).join(' -> '), codeLine: takeLeft ? 5 : 7, note: `Append ${source.value} from the ${takeLeft ? 'first' : 'second'} list to the merged chain.` })
  }

  yield step({ nodes: merged, inputValues: values, headId: merged[0]?.id ?? null, currentId: null, nextId: null, rewiredNodeIds: merged.map((item) => item.id), result: merged.map((item) => item.value).join(' -> '), codeLine: 10, note: 'Both lists are exhausted, so the merged sorted list is complete.' })
}

export function* removeNthFromEnd(values: number[]): Generator<LinkedListStep> {
  const nodes = createNodes(values)
  const n = Math.min(2, nodes.length)
  let fast = 0
  let slow = 0

  yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, codeLine: 1, note: `Use two pointers with a gap of ${n}.` })

  for (let gap = 0; gap < n; gap++) {
    fast++
    yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, codeLine: 3, note: `Advance fast pointer to create the gap.` })
  }

  while (fast < nodes.length - 1) {
    fast++
    slow++
    yield step({ nodes, inputValues: values, headId: nodes[0]?.id ?? null, currentId: nodes[slow]?.id ?? null, nextId: nodes[fast]?.id ?? null, codeLine: 6, note: 'Move both pointers until fast reaches the tail.' })
  }

  const removeIndex = slow + 1
  const removed = nodes[removeIndex]
  if (nodes[slow]) nodes[slow].nextId = nodes[removeIndex + 1]?.id ?? null
  const visible = nodes.filter((_, index) => index !== removeIndex)

  yield step({ nodes: visible, inputValues: values, headId: visible[0]?.id ?? null, prevId: nodes[slow]?.id ?? null, currentId: removed?.id ?? null, nextId: nodes[removeIndex + 1]?.id ?? null, rewiredNodeIds: nodes[slow] ? [nodes[slow].id] : [], result: `removed ${removed?.value ?? 'none'}`, codeLine: 8, note: `Remove the ${n}nd node from the end by bypassing ${removed?.value}.` })
}

function createNodes(values: number[], prefix = 'node', y = 190): LinkedListNode[] {
  return values.map((value, index) => ({
    id: `${prefix}-${index}-${value}`,
    value,
    nextId: index < values.length - 1 ? `${prefix}-${index + 1}-${values[index + 1]}` : null,
    x: 90 + index * 132,
    y
  }))
}

function nextIndex(nodes: LinkedListNode[], index: number) {
  const nextId = nodes[index]?.nextId
  if (!nextId) return -1
  return nodes.findIndex((node) => node.id === nextId)
}

function step({
  nodes,
  inputValues,
  headId,
  prevId = null,
  currentId,
  nextId = null,
  rewiredNodeIds = [],
  result,
  codeLine,
  note
}: {
  nodes: LinkedListNode[]
  inputValues: number[]
  headId: string | null
  prevId?: string | null
  currentId: string | null
  nextId?: string | null
  rewiredNodeIds?: string[]
  result?: string
  codeLine: number
  note: string
}): LinkedListStep {
  return {
    nodes: nodes.map((node) => ({ ...node })),
    inputValues: [...inputValues],
    headId,
    prevId,
    currentId,
    nextId,
    rewiredNodeIds: [...rewiredNodeIds],
    result,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    codeLine,
    note
  }
}

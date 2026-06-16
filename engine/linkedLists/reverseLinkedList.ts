import type { LinkedListNode, LinkedListStep } from '@/engine/types'

export function* reverseLinkedList(values: number[]): Generator<LinkedListStep> {
  const nodes = createNodes(values)
  let prevId: string | null = null
  let currentId: string | null = nodes[0]?.id ?? null
  const rewiredNodeIds: string[] = []

  yield step({
    nodes,
    inputValues: values,
    headId: currentId,
    prevId,
    currentId,
    rewiredNodeIds,
    codeLine: 1,
    note: 'Start with prev as null and current at the head.'
  })

  while (currentId) {
    const current = findNode(nodes, currentId)
    const nextId = current.nextId

    yield step({
      nodes,
      inputValues: values,
      headId: nodes[0]?.id ?? null,
      prevId,
      currentId,
      nextId,
      rewiredNodeIds,
      codeLine: 3,
      note: `Store next pointer before changing node ${current.value}.`
    })

    current.nextId = prevId
    rewiredNodeIds.push(current.id)

    yield step({
      nodes,
      inputValues: values,
      headId: nodes[0]?.id ?? null,
      prevId,
      currentId,
      nextId,
      rewiredNodeIds,
      codeLine: 4,
      note: `Reverse pointer: ${current.value}.next now points to ${prevId ? findNode(nodes, prevId).value : 'null'}.`
    })

    prevId = currentId
    currentId = nextId

    yield step({
      nodes,
      inputValues: values,
      headId: nodes[0]?.id ?? null,
      prevId,
      currentId,
      nextId,
      rewiredNodeIds,
      codeLine: 5,
      note: 'Move prev and current one step forward.'
    })
  }

  yield step({
    nodes,
    inputValues: values,
    headId: prevId,
    prevId,
    currentId: null,
    nextId: null,
    rewiredNodeIds,
    codeLine: 7,
    note: 'Current is null, so prev is the new reversed head.'
  })
}

function createNodes(values: number[]): LinkedListNode[] {
  return values.map((value, index) => ({
    id: `node-${index}-${value}`,
    value,
    nextId: index < values.length - 1 ? `node-${index + 1}-${values[index + 1]}` : null,
    x: 90 + index * 132,
    y: 190
  }))
}

function findNode(nodes: LinkedListNode[], id: string) {
  const node = nodes.find((item) => item.id === id)
  if (!node) throw new Error(`Linked list node ${id} was not found.`)
  return node
}

function step({
  nodes,
  inputValues,
  headId,
  prevId,
  currentId,
  nextId = null,
  rewiredNodeIds,
  codeLine,
  note
}: {
  nodes: LinkedListNode[]
  inputValues: number[]
  headId: string | null
  prevId: string | null
  currentId: string | null
  nextId?: string | null
  rewiredNodeIds: string[]
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
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    codeLine,
    note
  }
}

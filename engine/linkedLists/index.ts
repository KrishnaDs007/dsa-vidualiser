import { reverseLinkedList } from '@/engine/linkedLists/reverseLinkedList'

export const LINKED_LIST_ALGORITHMS = {
  reverse: {
    id: 'reverse',
    label: 'Reverse Linked List',
    complexity: 'O(n) time / O(1) space',
    run: reverseLinkedList
  }
} as const

export type LinkedListAlgorithmId = keyof typeof LINKED_LIST_ALGORITHMS

export function isLinkedListAlgorithmId(
  value?: string
): value is LinkedListAlgorithmId {
  return Boolean(value && value in LINKED_LIST_ALGORITHMS)
}

export const LINKED_LIST_PSEUDOCODE: Record<LinkedListAlgorithmId, string> = {
  reverse: `function reverseList(head: ListNode | null) {
  let prev = null
  let current = head
  while (current !== null) {
    const next = current.next
    current.next = prev
    prev = current
    current = next
  }
  return prev
}`
}

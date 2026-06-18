import {
  detectCycle,
  mergeTwoSortedLists,
  middleOfLinkedList,
  removeNthFromEnd
} from '@/engine/linkedLists/linkedListPatterns'
import { reverseLinkedList } from '@/engine/linkedLists/reverseLinkedList'

export const LINKED_LIST_ALGORITHMS = {
  reverse: {
    id: 'reverse',
    label: 'Reverse Linked List',
    complexity: 'O(n) time / O(1) space',
    run: reverseLinkedList
  },
  middle: {
    id: 'middle',
    label: 'Middle of Linked List',
    complexity: 'O(n) time / O(1) space',
    run: middleOfLinkedList
  },
  cycle: {
    id: 'cycle',
    label: 'Detect Cycle',
    complexity: 'O(n) time / O(1) space',
    run: detectCycle
  },
  merge: {
    id: 'merge',
    label: 'Merge Two Sorted Lists',
    complexity: 'O(n + m) time / O(1) extra space',
    run: mergeTwoSortedLists
  },
  removeNth: {
    id: 'removeNth',
    label: 'Remove Nth Node From End',
    complexity: 'O(n) time / O(1) space',
    run: removeNthFromEnd
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
}`,
  middle: `function middleNode(head: ListNode | null) {
  let slow = head
  let fast = head
  while (fast !== null && fast.next !== null) {
    slow = slow.next
    fast = fast.next.next
  }
  return slow
}`,
  cycle: `function hasCycle(head: ListNode | null) {
  let slow = head
  let fast = head
  while (fast !== null && fast.next !== null) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}`,
  merge: `function mergeTwoLists(a: ListNode | null, b: ListNode | null) {
  const dummy = new ListNode(0)
  let tail = dummy
  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      tail.next = a
      a = a.next
    } else {
      tail.next = b
      b = b.next
    }
    tail = tail.next
  }
  tail.next = a ?? b
  return dummy.next
}`,
  removeNth: `function removeNthFromEnd(head: ListNode | null, n: number) {
  const dummy = new ListNode(0, head)
  let slow = dummy
  let fast = dummy
  for (let i = 0; i < n; i++) fast = fast.next
  while (fast.next !== null) {
    slow = slow.next
    fast = fast.next
  }
  slow.next = slow.next.next
  return dummy.next
}`
}

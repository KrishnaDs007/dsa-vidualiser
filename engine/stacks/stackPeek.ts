import type { StackStep } from '@/engine/types'
import { cloneStack, makeStackItem } from '@/engine/stacks/stackUtils'

export function* stackPeek(values: number[]): Generator<StackStep> {
  const items = values.map((value, index) => makeStackItem(value, index))
  const top = items.at(-1) ?? null

  yield {
    items: cloneStack(items),
    inputValues: [...values],
    activeValue: top?.value ?? null,
    activeItemId: top?.id ?? null,
    removedItemId: null,
    operation: 'peek',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    codeLine: 1,
    note: 'Peek reads the top stack item without removing it.'
  }

  yield {
    items: cloneStack(items),
    inputValues: [...values],
    activeValue: top?.value ?? null,
    activeItemId: top?.id ?? null,
    removedItemId: null,
    operation: 'peek',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    codeLine: 3,
    note: top
      ? `Top value is ${top.value}. The stack stays unchanged.`
      : 'The stack is empty, so there is no value to peek.'
  }
}

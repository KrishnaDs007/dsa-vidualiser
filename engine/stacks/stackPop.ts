import type { StackStep } from '@/engine/types'
import { cloneStack, makeStackItem } from '@/engine/stacks/stackUtils'

export function* stackPop(values: number[]): Generator<StackStep> {
  const items = values.map((value, index) => makeStackItem(value, index))

  yield step({
    items,
    inputValues: values,
    operation: 'pop',
    codeLine: 1,
    note: 'Start with a filled stack. Pop always removes the current top.'
  })

  while (items.length > 0) {
    const top = items[items.length - 1]

    yield step({
      items,
      inputValues: values,
      activeValue: top.value,
      activeItemId: top.id,
      operation: 'pop',
      codeLine: 3,
      note: `Read top value ${top.value}.`
    })

    const removed = items.pop()

    yield step({
      items,
      inputValues: values,
      activeValue: removed?.value ?? null,
      removedItemId: removed?.id ?? null,
      operation: 'pop',
      codeLine: 4,
      note: `Pop ${removed?.value}. The item below becomes the new top.`
    })
  }

  yield step({
    items,
    inputValues: values,
    operation: 'pop',
    codeLine: 6,
    note: 'The stack is empty.'
  })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  removedItemId = null,
  operation,
  codeLine,
  note
}: {
  items: { id: string; value: number }[]
  inputValues: number[]
  activeValue?: number | null
  activeItemId?: string | null
  removedItemId?: string | null
  operation: 'pop'
  codeLine: number
  note: string
}): StackStep {
  return {
    items: cloneStack(items),
    inputValues: [...inputValues],
    activeValue,
    activeItemId,
    removedItemId,
    operation,
    timeComplexity: 'O(1) per pop',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

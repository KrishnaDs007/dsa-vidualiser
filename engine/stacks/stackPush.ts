import type { StackItem, StackStep } from '@/engine/types'
import { cloneStack, makeStackItem } from '@/engine/stacks/stackUtils'

export function* stackPush(values: number[]): Generator<StackStep> {
  const items: StackItem[] = []

  yield step({
    items,
    inputValues: values,
    operation: 'push',
    codeLine: 1,
    note: 'Start with an empty stack. The top is the last pushed item.'
  })

  for (let index = 0; index < values.length; index++) {
    const value = values[index]

    yield step({
      items,
      inputValues: values,
      activeValue: value,
      operation: 'push',
      codeLine: 3,
      note: `Read ${value} from the input list.`
    })

    const item = makeStackItem(value, index)
    items.push(item)

    yield step({
      items,
      inputValues: values,
      activeValue: value,
      activeItemId: item.id,
      operation: 'push',
      codeLine: 4,
      note: `Push ${value}. It becomes the new top of the stack.`
    })
  }

  yield step({
    items,
    inputValues: values,
    operation: 'push',
    codeLine: 6,
    note: 'All values were pushed in input order.'
  })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  operation,
  codeLine,
  note
}: {
  items: { id: string; value: number }[]
  inputValues: number[]
  activeValue?: number | null
  activeItemId?: string | null
  operation: 'push'
  codeLine: number
  note: string
}): StackStep {
  return {
    items: cloneStack(items),
    inputValues: [...inputValues],
    activeValue,
    activeItemId,
    removedItemId: null,
    operation,
    timeComplexity: 'O(1) per push',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

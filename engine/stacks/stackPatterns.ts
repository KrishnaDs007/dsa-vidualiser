import type { StackItem, StackStep } from '@/engine/types'
import { cloneStack, makeStackItem } from '@/engine/stacks/stackUtils'

export function* validParentheses(values: number[]): Generator<StackStep> {
  const text = '({[]})'
  const items: StackItem[] = []
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

  yield step({ items, inputValues: [...text], operation: 'parse', result: 'pending', codeLine: 1, note: 'Scan each bracket and keep opening brackets on the stack.' })

  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if ('([{'.includes(char)) {
      const item = makeStackItem(char, index)
      items.push(item)
      yield step({ items, inputValues: [...text], activeValue: char, activeItemId: item.id, operation: 'parse', result: 'pending', codeLine: 4, note: `Push opening bracket ${char}.` })
      continue
    }

    const top = items.at(-1)
    yield step({ items, inputValues: [...text], activeValue: char, activeItemId: top?.id ?? null, operation: 'parse', result: 'pending', codeLine: 7, note: `Closing bracket ${char} must match stack top ${top?.value ?? 'empty'}.` })

    if (!top || top.value !== pairs[char]) {
      yield step({ items, inputValues: [...text], activeValue: char, activeItemId: top?.id ?? null, operation: 'parse', result: 'invalid', codeLine: 8, note: `Mismatch found, so the expression is invalid.` })
      return
    }

    const removed = items.pop()
    yield step({ items, inputValues: [...text], activeValue: char, removedItemId: removed?.id ?? null, operation: 'parse', result: 'pending', codeLine: 10, note: `Pop ${removed?.value}; it matches ${char}.` })
  }

  yield step({ items, inputValues: [...text], operation: 'parse', result: items.length === 0 ? 'valid' : 'invalid', codeLine: 13, note: items.length === 0 ? 'Every bracket matched and the stack is empty.' : 'Unmatched opening brackets remain.' })
}

export function* nextGreaterElement(values: number[]): Generator<StackStep> {
  const stack: StackItem[] = []
  const answers = Array(values.length).fill(-1) as number[]

  yield step({ items: stack, inputValues: values, operation: 'monotonic', result: answers.join(', '), codeLine: 1, note: 'Keep indexes in a decreasing monotonic stack.' })

  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    yield step({ items: stack, inputValues: values, activeValue: value, operation: 'monotonic', result: answers.join(', '), codeLine: 3, note: `Read ${value} at index ${index}.` })

    while (stack.length > 0 && values[Number(stack.at(-1)?.value)] < value) {
      const removed = stack.pop()
      const removedIndex = Number(removed?.value)
      answers[removedIndex] = value
      yield step({ items: stack, inputValues: values, activeValue: value, removedItemId: removed?.id ?? null, operation: 'monotonic', result: answers.join(', '), codeLine: 5, note: `${value} is the next greater value for index ${removedIndex}.` })
    }

    const item = makeStackItem(index, index)
    stack.push(item)
    yield step({ items: stack, inputValues: values, activeValue: value, activeItemId: item.id, operation: 'monotonic', result: answers.join(', '), codeLine: 7, note: `Push index ${index}; it waits for a greater value.` })
  }

  yield step({ items: stack, inputValues: values, operation: 'monotonic', result: answers.join(', '), codeLine: 10, note: `Remaining indexes have no greater value to their right.` })
}

export function* dailyTemperatures(values: number[]): Generator<StackStep> {
  const stack: StackItem[] = []
  const waits = Array(values.length).fill(0) as number[]

  yield step({ items: stack, inputValues: values, operation: 'monotonic', result: waits.join(', '), codeLine: 1, note: 'Use a decreasing stack of day indexes waiting for warmer temperatures.' })

  for (let day = 0; day < values.length; day++) {
    const temp = values[day]
    yield step({ items: stack, inputValues: values, activeValue: temp, operation: 'monotonic', result: waits.join(', '), codeLine: 3, note: `Read day ${day} with temperature ${temp}.` })

    while (stack.length > 0 && values[Number(stack.at(-1)?.value)] < temp) {
      const removed = stack.pop()
      const previousDay = Number(removed?.value)
      waits[previousDay] = day - previousDay
      yield step({ items: stack, inputValues: values, activeValue: temp, removedItemId: removed?.id ?? null, operation: 'monotonic', result: waits.join(', '), codeLine: 5, note: `Day ${previousDay} waits ${waits[previousDay]} day(s) for warmer temperature ${temp}.` })
    }

    const item = makeStackItem(day, day)
    stack.push(item)
    yield step({ items: stack, inputValues: values, activeValue: temp, activeItemId: item.id, operation: 'monotonic', result: waits.join(', '), codeLine: 7, note: `Push day ${day}; it waits for a warmer future day.` })
  }

  yield step({ items: stack, inputValues: values, operation: 'monotonic', result: waits.join(', '), codeLine: 10, note: 'Days left in the stack never see a warmer future temperature.' })
}

function step({
  items,
  inputValues,
  activeValue = null,
  activeItemId = null,
  removedItemId = null,
  operation,
  result,
  codeLine,
  note
}: {
  items: StackItem[]
  inputValues: Array<number | string>
  activeValue?: number | string | null
  activeItemId?: string | null
  removedItemId?: string | null
  operation: StackStep['operation']
  result?: string
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
    result,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    codeLine,
    note
  }
}

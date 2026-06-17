import type { StackItem } from '@/engine/types'

export function makeStackItem(value: number | string, index: number): StackItem {
  return {
    id: `stack-${value}-${index}`,
    value
  }
}

export function cloneStack(items: StackItem[]) {
  return items.map((item) => ({ ...item }))
}

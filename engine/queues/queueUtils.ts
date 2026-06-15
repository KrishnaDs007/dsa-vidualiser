import type { QueueItem } from '@/engine/types'

export function makeQueueItem(value: number, index: number): QueueItem {
  return {
    id: `queue-${value}-${index}`,
    value
  }
}

export function cloneQueue(items: QueueItem[]) {
  return items.map((item) => ({ ...item }))
}

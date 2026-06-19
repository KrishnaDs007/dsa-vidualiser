import type { GreedyItem, GreedyStep } from '@/engine/types'

export function* activitySelectionGreedy(): Generator<GreedyStep> {
  const activities = [
    { id: 'a1', start: 1, end: 3 },
    { id: 'a2', start: 2, end: 5 },
    { id: 'a3', start: 4, end: 7 },
    { id: 'a4', start: 6, end: 9 },
    { id: 'a5', start: 8, end: 10 }
  ].sort((left, right) => left.end - right.end)
  const selected: string[] = []
  const rejected: string[] = []
  let lastEnd = -Infinity

  yield step(toIntervalItems(activities, selected, rejected, null), selected, rejected, null, '', 'O(n log n)', 'O(1)', 1, 'Sort activities by earliest finish time.')

  for (const activity of activities) {
    if (activity.start >= lastEnd) {
      selected.push(activity.id)
      lastEnd = activity.end
      yield step(toIntervalItems(activities, selected, rejected, activity.id), selected, rejected, activity.id, `${selected.length} selected`, 'O(n log n)', 'O(1)', 5, `Select ${activity.id} because it starts after the last finish.`)
    } else {
      rejected.push(activity.id)
      yield step(toIntervalItems(activities, selected, rejected, activity.id), selected, rejected, activity.id, `${selected.length} selected`, 'O(n log n)', 'O(1)', 7, `Reject ${activity.id} because it overlaps the selected activity.`)
    }
  }
}

export function* mergeIntervalsGreedy(): Generator<GreedyStep> {
  const intervals = [
    { id: 'i1', start: 1, end: 3 },
    { id: 'i2', start: 2, end: 6 },
    { id: 'i3', start: 8, end: 10 },
    { id: 'i4', start: 9, end: 12 }
  ].sort((left, right) => left.start - right.start)
  const selected: string[] = []
  const rejected: string[] = []
  const merged: Array<{ start: number; end: number }> = []

  yield step(toIntervalItems(intervals, selected, rejected, null), selected, rejected, null, '', 'O(n log n)', 'O(n)', 1, 'Sort intervals by start time.')

  for (const interval of intervals) {
    const last = merged.at(-1)
    if (!last || interval.start > last.end) {
      merged.push({ start: interval.start, end: interval.end })
      selected.push(interval.id)
      yield step(toIntervalItems(intervals, selected, rejected, interval.id), selected, rejected, interval.id, formatIntervals(merged), 'O(n log n)', 'O(n)', 4, `Start a new merged interval [${interval.start}, ${interval.end}].`)
    } else {
      last.end = Math.max(last.end, interval.end)
      rejected.push(interval.id)
      yield step(toIntervalItems(intervals, selected, rejected, interval.id, 'merged'), selected, rejected, interval.id, formatIntervals(merged), 'O(n log n)', 'O(n)', 7, `Merge ${interval.id} into the previous interval.`)
    }
  }
}

export function* jumpGameGreedy(): Generator<GreedyStep> {
  const jumps = [2, 3, 1, 1, 4]
  let farthest = 0
  const selected: string[] = []
  const rejected: string[] = []

  yield step(toArrayItems(jumps, selected, rejected, null), selected, rejected, null, 'farthest 0', 'O(n)', 'O(1)', 1, 'Track the farthest reachable index.')

  for (let index = 0; index < jumps.length; index++) {
    const id = `j${index}`
    if (index > farthest) {
      rejected.push(id)
      yield step(toArrayItems(jumps, selected, rejected, id), selected, rejected, id, 'cannot reach end', 'O(n)', 'O(1)', 4, `Index ${index} is beyond farthest reach.`)
      return
    }
    selected.push(id)
    farthest = Math.max(farthest, index + jumps[index])
    yield step(toArrayItems(jumps, selected, rejected, id), selected, rejected, id, `farthest ${farthest}`, 'O(n)', 'O(1)', 6, `From index ${index}, reach up to ${farthest}.`)
    if (farthest >= jumps.length - 1) {
      yield step(toArrayItems(jumps, selected, rejected, id), selected, rejected, id, 'can reach end', 'O(n)', 'O(1)', 8, 'The end is reachable.')
      return
    }
  }
}

export function* gasStationGreedy(): Generator<GreedyStep> {
  const gas = [1, 2, 3, 4, 5]
  const cost = [3, 4, 5, 1, 2]
  let tank = 0
  let total = 0
  let start = 0
  const selected: string[] = []
  const rejected: string[] = []

  yield step(toGasItems(gas, cost, selected, rejected, null), selected, rejected, null, 'start 0', 'O(n)', 'O(1)', 1, 'Track total balance and current tank.')

  for (let index = 0; index < gas.length; index++) {
    const id = `g${index}`
    const delta = gas[index] - cost[index]
    tank += delta
    total += delta
    selected.push(id)
    yield step(toGasItems(gas, cost, selected, rejected, id), selected, rejected, id, `tank ${tank}`, 'O(n)', 'O(1)', 4, `Station ${index}: gas - cost = ${delta}.`)
    if (tank < 0) {
      rejected.push(...selected.splice(0))
      start = index + 1
      tank = 0
      yield step(toGasItems(gas, cost, selected, rejected, id), selected, rejected, id, `restart ${start}`, 'O(n)', 'O(1)', 7, 'Tank is negative, so no station in this segment can start the trip.')
    }
  }

  yield step(toGasItems(gas, cost, selected, rejected, `g${start}`), selected, rejected, `g${start}`, total >= 0 ? `start ${start}` : 'no circuit', 'O(n)', 'O(1)', 10, total >= 0 ? `Start at station ${start}.` : 'Total gas is less than total cost.')
}

export function* huffmanCodingGreedy(): Generator<GreedyStep> {
  const queue = [
    { id: 'a', label: 'A', weight: 5 },
    { id: 'b', label: 'B', weight: 9 },
    { id: 'c', label: 'C', weight: 12 },
    { id: 'd', label: 'D', weight: 13 }
  ]
  const selected: string[] = []
  const rejected: string[] = []
  let nextId = 1

  yield step(toWeightItems(queue, [], null), selected, rejected, null, '4 nodes', 'O(n log n)', 'O(n)', 1, 'Put all frequencies into a min-priority queue.')

  while (queue.length > 1) {
    queue.sort((left, right) => left.weight - right.weight)
    const first = queue.shift()!
    const second = queue.shift()!
    selected.push(first.id, second.id)
    yield step(toWeightItems([first, second, ...queue], selected, first.id), selected, rejected, first.id, `${queue.length + 2} nodes`, 'O(n log n)', 'O(n)', 4, `Take two smallest nodes: ${first.label} and ${second.label}.`)
    const merged = {
      id: `m${nextId++}`,
      label: `${first.label}${second.label}`,
      weight: first.weight + second.weight
    }
    queue.push(merged)
    yield step(toWeightItems([merged, ...queue.filter((item) => item.id !== merged.id)], [merged.id], merged.id), selected, rejected, merged.id, `${merged.label}:${merged.weight}`, 'O(n log n)', 'O(n)', 6, `Merge them into node ${merged.label} with weight ${merged.weight}.`)
  }

  yield step(toWeightItems(queue, [queue[0].id], queue[0].id), selected, rejected, queue[0].id, `root ${queue[0].weight}`, 'O(n log n)', 'O(n)', 9, 'The final node is the Huffman tree root.')
}

function step(items: GreedyItem[], selectedIds: string[], rejectedIds: string[], activeId: string | null, result: string, timeComplexity: string, spaceComplexity: string, codeLine: number, note: string): GreedyStep {
  return { items, selectedIds: [...selectedIds], rejectedIds: [...rejectedIds], activeId, result, timeComplexity, spaceComplexity, codeLine, note }
}

function toIntervalItems(intervals: Array<{ id: string; start: number; end: number }>, selected: string[], rejected: string[], activeId: string | null, mergedState = ''): GreedyItem[] {
  return intervals.map((item) => ({
    id: item.id,
    label: item.id.toUpperCase(),
    value: `[${item.start}, ${item.end}]`,
    meta: `start ${item.start} / end ${item.end}`,
    state: activeId === item.id ? 'active' : selected.includes(item.id) ? 'selected' : rejected.includes(item.id) ? (mergedState ? 'merged' : 'rejected') : 'default'
  }))
}

function toArrayItems(values: number[], selected: string[], rejected: string[], activeId: string | null): GreedyItem[] {
  return values.map((value, index) => item(`j${index}`, `idx ${index}`, String(value), `reach ${index + value}`, selected, rejected, activeId))
}

function toGasItems(gas: number[], cost: number[], selected: string[], rejected: string[], activeId: string | null): GreedyItem[] {
  return gas.map((value, index) => item(`g${index}`, `S${index}`, `${value}/${cost[index]}`, `net ${value - cost[index]}`, selected, rejected, activeId))
}

function toWeightItems(nodes: Array<{ id: string; label: string; weight: number }>, selected: string[], activeId: string | null): GreedyItem[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.label,
    value: String(node.weight),
    meta: 'frequency',
    state: activeId === node.id ? 'active' : selected.includes(node.id) ? 'selected' : 'default'
  }))
}

function item(id: string, label: string, value: string, meta: string, selected: string[], rejected: string[], activeId: string | null): GreedyItem {
  return {
    id,
    label,
    value,
    meta,
    state: activeId === id ? 'active' : selected.includes(id) ? 'selected' : rejected.includes(id) ? 'rejected' : 'default'
  }
}

function formatIntervals(intervals: Array<{ start: number; end: number }>) {
  return intervals.map((interval) => `[${interval.start},${interval.end}]`).join(' ')
}

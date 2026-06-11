import type { SearchStep } from '@/engine/types'

export function* linearSearch(
  input: number[],
  target: number
): Generator<SearchStep> {
  const array = [...input]
  const eliminated: number[] = []

  yield {
    array,
    target,
    checking: [],
    activeRange: array.map((_, index) => index),
    eliminated: [],
    foundIndex: null,
    codeLine: 1,
    note: 'Start scanning from the first item.'
  }

  for (let index = 0; index < array.length; index++) {
    yield {
      array,
      target,
      checking: [index],
      activeRange: array.map((_, activeIndex) => activeIndex),
      eliminated: [...eliminated],
      foundIndex: null,
      codeLine: 3,
      note: `Compare index ${index} with the target.`
    }

    if (array[index] === target) {
      yield {
        array,
        target,
        checking: [index],
        activeRange: [],
        eliminated: [...eliminated],
        foundIndex: index,
        codeLine: 4,
        note: `Target found at index ${index}.`
      }
      return
    }

    eliminated.push(index)

    yield {
      array,
      target,
      checking: [],
      activeRange: array.slice(index + 1).map((_, offset) => index + 1 + offset),
      eliminated: [...eliminated],
      foundIndex: null,
      codeLine: 6,
      note: `Index ${index} is eliminated.`
    }
  }

  yield {
    array,
    target,
    checking: [],
    activeRange: [],
    eliminated: array.map((_, index) => index),
    foundIndex: null,
    codeLine: 8,
    note: 'Target was not found after scanning every item.'
  }
}

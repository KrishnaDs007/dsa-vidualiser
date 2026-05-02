import { describe, expect, it } from 'vitest'
import { bubbleSort } from '@/engine/sorting/bubbleSort'
import { insertionSort } from '@/engine/sorting/insertionSort'

function finalArray(generator: Generator<{ array: number[] }>) {
  return Array.from(generator).at(-1)?.array
}

describe('sorting engine', () => {
  it('bubble sort emits sorted final snapshot without mutating input', () => {
    const input = [5, 2, 9, 1]
    const result = finalArray(bubbleSort(input))

    expect(result).toEqual([1, 2, 5, 9])
    expect(input).toEqual([5, 2, 9, 1])
  })

  it('insertion sort emits sorted final snapshot without mutating input', () => {
    const input = [8, 3, 7, 4, 2]
    const result = finalArray(insertionSort(input))

    expect(result).toEqual([2, 3, 4, 7, 8])
    expect(input).toEqual([8, 3, 7, 4, 2])
  })
})

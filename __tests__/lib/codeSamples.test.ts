import { describe, expect, it } from 'vitest'
import { CODE_SAMPLE_LANGUAGES } from '@/lib/codeSampleLanguages'
import { buildCodeSamples } from '@/lib/codeSamples'

const source = `function binarySearch(nums: number[], target: number) {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }

  return -1
}`

describe('code sample generation', () => {
  it('generates a non-empty sample for every code panel language', () => {
    const samples = buildCodeSamples(source)

    for (const language of CODE_SAMPLE_LANGUAGES) {
      expect(samples[language.id].trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps TypeScript as the source-shaped sample', () => {
    const samples = buildCodeSamples(source)

    expect(samples.typescript).toContain('function binarySearch')
    expect(samples.typescript).toContain('target: number')
  })

  it('generates language-shaped reference samples', () => {
    const samples = buildCodeSamples(source)

    expect(samples.javascript).toContain('function binarySearch(nums, target)')
    expect(samples.python).toContain('def binary_search(nums, target):')
    expect(samples.java).toContain('public class Solution')
    expect(samples.cpp).toContain('#include <vector>')
    expect(samples.c).toContain('#include <stdbool.h>')
    expect(samples.csharp).toContain('using System;')
  })
})

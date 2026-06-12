import { describe, expect, it } from 'vitest'
import {
  CUSTOM_CODE_TEMPLATES,
  CUSTOM_CODE_LANGUAGES,
  analyzeComplexity,
  createCustomCodeTrace,
  getLanguageLabel
} from '@/lib/customCode'

describe('custom code analyzer', () => {
  it('has a profile for every supported custom code language', () => {
    expect(CUSTOM_CODE_LANGUAGES.map((language) => language.id)).toEqual([
      'javascript',
      'typescript',
      'python',
      'java',
      'cpp',
      'c',
      'csharp'
    ])
  })

  it('detects linear traversal in Python snippets', () => {
    const result = analyzeComplexity(
      `def total(nums):
    output = 0
    for value in nums:
        output += value
    return output`,
      'python'
    )

    expect(result.time).toBe('O(n)')
    expect(result.signals).toContain(`Language profile: ${getLanguageLabel('python')}`)
  })

  it('detects auxiliary collection usage in C++ snippets', () => {
    const result = analyzeComplexity(
      `int countPairs(vector<int>& nums) {
    unordered_set<int> seen;
    for (int value : nums) {
        seen.insert(value);
    }
    return seen.size();
}`,
      'cpp'
    )

    expect(result.time).toBe('O(n)')
    expect(result.space).toBe('O(n)')
  })

  it('detects repeated scans as quadratic', () => {
    const result = analyzeComplexity(
      `for (let i = 0; i < nums.length; i++) {
  for (let j = 0; j < nums.length; j++) {
    console.log(i, j)
  }
}`,
      'javascript'
    )

    expect(result.time).toBe('O(n^2)')
  })

  it('returns structured factors for visual complexity breakdowns', () => {
    const result = analyzeComplexity(
      `function find(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}`,
      'javascript'
    )

    expect(result.confidence).toBeGreaterThan(50)
    expect(result.factors.map((factor) => factor.label)).toEqual([
      'Iteration',
      'Recursion',
      'Divide',
      'Storage'
    ])
    expect(result.factors.find((factor) => factor.label === 'Divide')?.value).toBe(
      'Yes'
    )
  })

  it('provides templates for switching custom code examples', () => {
    expect(CUSTOM_CODE_TEMPLATES.map((template) => template.id)).toContain(
      'binary-search'
    )
  })

  it('creates line-by-line trace steps with cumulative complexity', () => {
    const trace = createCustomCodeTrace(
      `function total(nums) {
  let sum = 0
  for (const value of nums) {
    sum += value
  }
  return sum
}`,
      'javascript'
    )

    expect(trace.length).toBeGreaterThan(1)
    expect(trace[0].lineNumber).toBe(1)
    expect(trace.some((step) => step.result.time === 'O(n)')).toBe(true)
    expect(trace.at(-1)?.codePrefix).toContain('return sum')
  })
})

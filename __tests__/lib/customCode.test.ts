import { describe, expect, it } from 'vitest'
import {
  CUSTOM_CODE_LANGUAGES,
  analyzeComplexity,
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
})
